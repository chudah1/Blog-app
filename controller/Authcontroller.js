const {User}= require("../models/Model.js");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res)=>{
	try{
	const {username, email, password, password2} = req.body;
    // array obect for holding objects containing a message amd value
	let errors= []
	//check required field 
   const existUsername = await User.findOne({username});
   if (existUsername) {
	   errors.push({msg:"Username taken already"})
   }
	
	if(!username ||!email || !password){
		errors.push({msg:"Please fill all fields"})
	}
    //check passwords 
	if (password.length<6){
		errors.push({msg:"Password length should be at least 6 characters"})
	}
	if (password != password2){
		errors.push({msg:"Passwords do no match"})
	}
    //meaning there are problems, render along the errors with the input fields user passed
	if (errors.length > 0){
		return res.render("register", {errors, username, email,password, password2})
	}
    
	
	 User.findOne({email:email})
	 .then(existingUser=>{
		 //user exists
		if (existingUser){
			errors.push({msg:"Email already exists"})
			return res.render("register", {errors, username,email, password,password2});
		}

		
		const newUser = new User({
			username,
			email, 
			password
		});
	
			//hash password
	    bcrypt.hash(newUser.password, 10, (err, encryptedPassword)=>{
			if (err) throw err
			newUser.password=encryptedPassword
			newUser.save()
			.then(user=>{
				return res.json(user)
			})
			.catch(err=> console.log(err.message))
		});
	
		// use json web token to create a token for the newly created user
		jwt.sign( 
			{newUser},
			process.env.TOKEN_SECRET,
			{expiresIn:"2h"}
		);
		req.flash("success_msg", "Registered successfully" )
		return res.redirect("/users/login")
		
	
	})
	}catch(err){
		console.log(err.message)
	}
}

const login = async (req, res)=>{
	    const errors=[]
	 	const {email, password} = req.body;
		const user = await User.findOne({email})

		if (user && await bcrypt.compare(password, user. password)){
				jwt.sign(
					{user},
					process.env.TOKEN_SECRET,
					{expiresIn:"2h"}
				)
				req.flash("success_mg", "You have successfully logged in")
				return res.redirect("/blogs/")
			}
			errors.push({msg:"Incorrect email or password"})
		    return res.render("login",{errors, email} )
		}


const logout = (req, res)=>{
	//using jwt there is no direct way to logout 
	//replace the jwt with an empty string and set the expiry date to 1 millisecond
	res.cookie("jwt", "", { maxAge: 1, httpOnly: true })
	req.flash("success_msg", "You have been logged out successfully")
	res.redirect("/users/login")
}


const loginRequired = (req, res, next) => {
	try {
	const token =req.headers.authorization.split(" ")[1]
	console.log(token)
	if (!token) {
		return res.sendStatus(403)
	}

	jwt.verify(token,process.env.TOKEN_SECRET, (err, decoded)=>{
		if(err) {
			req.flash("err_msg", "Please login")
			return res.sendStatus(403)
		}
		else {
		console.log(decoded)
		next()
		}

	});
	} catch (err) {
		console.log(err.message)
	}
	return next;
}


const checkUser = (req, res, next)=>{
	const token = req.headers['authorization'].split(" ")[1]
	if (token){
		jwt.verify(token, process.env.TOKEN_SECRET, (err,decoded)=>{
			//invalid token, call the next handler
			if(err) {
				res.locals.user =null;
				next();
			}
			//user exists make the user property, decoded contains the payload which contains the user
			else{
				user = User.findById(decoded.user._id)
				res.locals.user=user
				next();
			}
		})
	}
	//no token
	else{
		res.locals.user=null
		next();
	}
}


module.exports={register, login, logout, loginRequired, checkUser}

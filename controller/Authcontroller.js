const {User}= require("../models/Model.js");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res)=>{
	try{
	const {username, email, password, password2} = req.body;
    // array obect for holding objects containing a message amd value
	let errors= []
	//check required field 
	
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
		res.render("register", {errors, username, email,password, password2})
	}

	else{
		User.findOne({email:email})
		.then(existingUser=> {
			   //user exists
			  if (existingUser){
				  errors.push({msg:"Email already exists"})
				  res.render("register", {errors, username,email, password,password2});
			  }
			  
				//hash password
				const encryptedPassword = bcrypt.hash(password, 10);
				const newUser = new User({
					username:username,
					email:email, 
					password:encryptedPassword
				});
				newUser.save()
				.then(user=>{
					req.flash("success_msg", "Registered successfully")
					res.redirect("users/login")
				})
				.catch(err=> console.log(err.message))
				// use json web token to create a token for the newly created user
				jwt.sign( 
					{newUser},
					process.env.TOKEN_SECRET,
					{expiresIn:"2h"},
				(err, token)=>{
					res.status(201).json(user);
				}
				);
			
		}).catch(err=> console.log(err));

	}

	}catch(err){
		console.log(err.message)
	}
}
const logout = (req, res)=>{
	//using jwt there is no direct way to logout 
	//replace the jwt with an empty string and set the expiry date to 1 millisecond
	res.cookie("jwt", "", { maxAge: 1, httpOnly: true })
	req.flash("success_msg", "You have been logged out successfully")
	res.redirect("/users/login")
}

const login = async (req, res)=>{
		const {email, password} = req.body;
		const user = await User.findOne({email:email});
		if (user && await(bcrypt.compare(password, user.password))){
		jwt.sign(
				{user},
				process.env.TOKEN_SECRET,
				{expiresIn:"2h"},
				(err, token)=>{
					res.status(200).json(token);
				}
			);
		}
		res.status(401).send("Invalid details")
}
const loginRequired = (req, res, next) => {
	try {
	const token =req.headers["authorization"].split(" ")[1]; 
	if (!token) {
	  return res.status(403).send("A token is required for authentication");
	}

	jwt.verify(token,process.env.TOKEN_KEY, (err, decoded)=>{
		if(err) res.redirect("users/login")
		else {console.log(decoded)}
		next()

	});
	} catch (err) {
	  return res.status(401).send("Invalid Token");
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
				newUser = User.findById(decoded.user._id)
				res.locals.user=newUser
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

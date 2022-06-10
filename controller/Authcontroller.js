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
		let token = jwt.sign( 
			{newUserid:newUser._id},
			process.env.TOKEN_SECRET,
			{expiresIn:"2h"}
		);
		res.cookie('jwt', token, {httpOnly:true, maxAge:3*3600*1000})
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
				let token = jwt.sign(
					{newUserid:user._id},
					process.env.TOKEN_SECRET,
					{expiresIn:"2h"}
				)
				res.cookie('jwt', token, {httpOnly:true, maxAge:3*3600*1000})

				req.flash("success_mg", "You have successfully logged in")
				return res.redirect("/blogs/")
			}``
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


const loginRequired = async (req, res, next) => {
		try {
			let token =req.cookies.jwt
			if (token){
			const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
			if (decoded){
    		req.user = await (User.findById(decoded.newUserid));
			 return next();
			} else return res.redirect('/users/login')
		}else return res.status(403).json({"error":"A token is required for authentication"})
		
		}catch (err) {
			return res.json({err:err.message})
		  }
}


const checkUser = async(req, res, next)=>{
		try{
			let token =req.cookies.jwt
			if (token){
		     const decoded =jwt.verify(token, process.env.TOKEN_SECRET)
			 if (decoded){
				//user exists make the user property, decoded contains the payload which contains the user
				user = await (User.findById(decoded.newUserid))
				res.locals.user=user
				return next();
			 }
			//invalid token, call the next handler
			res.locals.user =null;
				next();
			}
			//no token
			else{
				res.locals.user=null
				next();
			}
		}catch(err){
			res.json({err:err.message})
		}
	
}






module.exports={register, login, logout, loginRequired, checkUser}

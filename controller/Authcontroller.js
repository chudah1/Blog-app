const {User}= require("../models/Model.js");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")


const transporter = nodemailer.createTransport(
	{host: 'smtp.mail.yahoo.com',
	service: "yahoo",
	secure:false,
	auth: {
		user: process.env.EMAIL_USERNAME,
		pass: process.env.EMAIL_PASSWORD,
	},
});

const signToken = (newUserid=>{
	
})


//function to prevent authenticated users from accessing routes
const fowardAuthenticated = async(req, res, next)=>{
	let token = req.cookies.jwt
	if (token){
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
		if (decoded) return res.redirect("/blogs/")
	}
	return next();

	}


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
    
	
	 const existingUser = await User.findOne({email:email}).exec()
	
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
	    bcrypt.hash(newUser.password, 10, async(err, encryptedPassword)=>{
			if (err) throw err
			newUser.password=encryptedPassword
			await newUser.save()	
		});
	
		// use json web token to create a token for the newly created user
		let token = jwt.sign(
			{newUserid:newUser._id},
			process.env.TOKEN_SECRET,
			{expiresIn:"2h"}
		)
		//set token for user
		res.cookie('jwt', token, {httpOnly:true, maxAge:3*3600*1000})
		return res.redirect("/blogs/")

		//email verification link
		/** 
		const url = `http://localhost:3000/users/verify/${token}`
			transporter.sendMail({
		    from:process.env.EMAIL_USERNAME,
			to: newUser.email,
			subject: 'Verify Account',
			html: `Click <a href = '${url}'>here</a> to confirm your email.`
		})
		res.status(201).send(`Sent a verification email to ${newUser.email}`)
		*/
	

	}catch(err){
		console.log(err.message)
	}
}

const login = async (req, res)=>{
	    const errors=[]
	 	const {email, password} = req.body;
		const user = await User.findOne({email})
		user.verified=true
		await user.save()

		if (!user.verified){
			return res.status(403).send("Verify your Account.");
		}

		if (user && await bcrypt.compare(password, user. password)){
			let token = jwt.sign(
				{newUserid:user._id},
				process.env.TOKEN_SECRET,
				{expiresIn:"2h"}
			)
			res.cookie('jwt', token, {httpOnly:true, maxAge:3*3600*1000})

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


const loginRequired = async (req, res, next) => {
		try {
			let token = req.cookies.jwt
			if (token){
				const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
				if (decoded){
    		req.user = await (User.findById(decoded.newUserid)).select("_id email username verified");
			return next();
				}
			} else return res.redirect('/users/login')		
		}catch (err) {
			return res.json({err:err.message})
		  }
}

const verifiedEmail = async (req, res)=>{
	try {
		let {token} =req.params
		if (token){
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
		if (decoded){
		let user = await (User.findById(decoded.newUserid)).select("_id email username verified");
		 user.verified=true;
		await user.save()
		}
		return res.status(200).send("Account Verified");

	} else return res.status(403).json({"error":"A token is required for authentication"})
}catch(err){
   console.error(err.message)
}	
}


const checkUser = async(req, res, next)=>{
		try{
			let token =req.cookies.jwt
			if (token){
		     const decoded =jwt.verify(token, process.env.TOKEN_SECRET)
			 if (decoded){
				//user exists make the user property, decoded contains the payload which contains the user
				let user = await (User.findById(decoded.newUserid))
				res.locals.user=user
				return next();
			 }
			//invalid token, call the next handler
			else{
			res.locals.user =null;
				next();
			}
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




module.exports={register, login, logout, loginRequired, checkUser, verifiedEmail, fowardAuthenticated}

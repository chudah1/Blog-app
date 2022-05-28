const {User}= require("../models/Model.js");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async(req, res)=>{
	try{
	const {username, email, password, password2} = req.body;
	const errors= []
	if(!username ||!email || !password){
		errors.push({msg:"Please fill all fields"})
	}

	if (password.length<6){
		errors.push({msg:"Password length should be at least 6 characters"})
	}
	if (password != password2){
		errors.push({msg:"Passwords do no match"})

	}

	if (errors.length > 0){
		res.render("register", {errors, username, email,password, password2})
	}

	
	 const existingUser = User.findOne({email:email});
	 if (existingUser){
		errors.push({msg:"Email already exists"})
				     //res.render("register", {errors, username,email, password,password2});
			}
	 const encryptedPassword = await bcrypt.hash(password, 10);

			const newUser = await User.create({
						username:username,
						email:email, 
						password:encryptedPassword
					});
			const token = jwt.sign(
				{userid: newUser._id, email},
				"chudahisthegreatestofalltime",
				{expiresIn:"2h"}
			);
			newUser.token = token;
			res.status(201).json(newUser);
				
		}catch(err){
			console.log(err)
		}

	}



module.exports={register}

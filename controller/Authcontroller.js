const {User}= require("../models/Model.js");

const bcrypt = require("bcryptjs");

register =(req, res)=>{
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

	else{
		User.findOne({email:email}, (err, user)=>{
			if (user){
				errors.push({msg:"Email already exists"})
				     //res.render("register", {errors, username,email, password,password2});
			

				}else{
					 const newUser = new User({
						username:username,
						email:email, 
						password:password});
					console.log(newUser.password);
					bcrypt.hash(newUser.password, 10, (err, hash)=>{
						console.log(hash);
						if (err){ console.log(err)};
						newUser.password=hash;
						newUser.save().then(user=>{
							console.log(user.password)
							res.redirect("/users/login")})
						.catch(err=>console.log(err))
					})
			}
		})

	}
}

module.exports={register}

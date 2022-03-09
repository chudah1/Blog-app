const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blogsdb", {useNewUrlParser:true}).then(()=>
	console.log("Db connected..")
).catch(err=>console.log(err));


const userSchema= new mongoose.Schema({
	username:{
		type:String,
		required:true
	},

	email:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true

	}
})

const commentSchema = new mongoose.Schema({
	content:{
		type: String,
		required:true
	},
	author:{
		type:
	}

})

const User = mongoose.model("User", userSchema);

const blogSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  content:{
    type:String,
    required:true
  }

})
const blogModel = new mongoose.model("Blog", blogSchema); 

module.exports = {blogModel, User};
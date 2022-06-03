const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {isEmail} = require("validator");
mongoose.connect("mongodb://localhost:27017/blogsdb", {useNewUrlParser:true})
.then(()=> console.log("Db connected..")
).catch(err=>console.log(err));


const userSchema= new Schema({
	username:{
		type:String,
		required:[true, "Please enter a username"], 
		unique: true
	},

	email:{
		unique:true,
		type:String,
		required:true,
		validate:[isEmail, "Please provide a valid email"]
	},
	password:{
		type:String,
		required:true,
		minlength:6

	},
	posts:[{
		type: Schema.ObjectId,
		ref:"Blog"
	}],
	comments:[{
		type: Schema.ObjectId,
		ref:"Comment"
	}],
	likes:[{
		type: Schema.ObjectId,
		ref:"Like"
	}]

})
const User = mongoose.model("User", userSchema);

const commentSchema = new Schema({
	content:{
		type: String,
		required:true
	},
	author:{
		type:Schema.ObjectId,
		ref:"User"
	},
	post :{
		type:Schema.ObjectId,
		ref:"Blog"
	}
})
const CommentModel = mongoose.model("Comment", commentSchema);
	
const likeSchema = new Schema({
	content:{
		type: String,
		required:true
	},
	author:{
		type:Schema.ObjectId,
		ref:"User"
	},
	post :{
		type:Schema.ObjectId,
		ref:"Blog"
	}
})
const likeModel = mongoose.model("Like", likeSchema);


const blogSchema = new Schema({
  title:{
    type:String,
    required:true
  },
  content:{
    type:String,
    required:true
  },
})
const blogModel = new mongoose.model("Blog", blogSchema); 

module.exports = {blogModel, User, CommentModel, likeModel};
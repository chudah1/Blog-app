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
		type: Schema.Types.ObjectId,
		ref:"Blog"
	}],
	comments:[{
		type: Schema.Types.ObjectId,
		ref:"Comment"
	}],
	likes:[{
		type: Schema.Types.ObjectId,
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
		type:Schema.Types.ObjectId,
		ref:"User"
	},
	post :{
		type:Schema.Types.ObjectId,
		ref:"Blog"
	}
})
const Comment = mongoose.model("Comment", commentSchema);
	
const likeSchema = new Schema({
	author:{
		type:Schema.Types.ObjectId,
		ref:"User"
	},
	post :{
		type:Schema.Types.ObjectId,
		ref:"Blog"
	}
})
const Like = mongoose.model("Like", likeSchema);


const blogSchema = new Schema({
  author:{
		type:Schema.Types.ObjectId,
		ref:"User"
	},
  title:{
    type:String,
    required:true
  },
  content:{
    type:String,
    required:true
  },
  comments:[{
	type: Schema.Types.ObjectId,
	ref:"Comment"
}],
likes:[{
	type: Schema.Types.ObjectId,
	ref:"Like"
}]

})
const Blog = new mongoose.model("Blog", blogSchema); 

module.exports = {Blog, User, Comment, Like};
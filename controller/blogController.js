const {Blog, User, Comment, Like} = require("../models/Model.js");
const jwt = require("jsonwebtoken");


const get_blogs = (req,res)=>{
 Blog.find({}).populate("comments")
  .then(blogs=>{res.render("blogs", {blogs})})
  .catch(err=>console.log(err))
};

 const find_blog = async (req, res)=>{
   try{
 const blog= await Blog.findById(req.params.id)
      if(blog){
       return res.render("post", {id:blog._id,title: blog.title, content:blog.content, comments:blog.comments})
      }
      else{
        return res.redirect("/blogs/")
      }
    }catch(err){
      console.error(err)
    }
  }


  /** 
const get_blogs_user = async (req, res)=>{
  try{
  const user = await User.findOne({username:req.params.username})
  if (user){
    res.render()
  }

  } catch(err){
    return res.json({"error":"Could not find user"})
  }
}
*/

const blog_form= (req, res)=>{
  res.render("compose")
}
const new_blog = (req, res)=>{
  try{
  const blog = new Blog({
    title:req.body.title,
    content:req.body.content, 
    author:req.user._id
  })
  blog.save()
  .then(res=>console.log(res))
  .catch(err=>console.log(err))
  req.user.posts.push(blog)
  req.user.save()
  .then(res=>console.log(res))
  .catch(err=>console.error(err))
  res.redirect("/blogs/")
}catch(err){
  console.error(err)
}
}

const edit_form = (req, res)=>{
  Blog.findById(req.params.id)
    .then(blog=>{
      res.render("edit", {id:blog._id, title: blog.title, content:blog.content})
    })
  .catch(err=>console.log(err.message));

}

const update_blog = (req, res)=>{
 Blog.findByIdAndUpdate(req.params.id, {
   title:req.body.title,
   content:req.body.content
  }, (err)=>{
    if (!err){
      return res.redirect("/blogs")
    }
  return res.status(401).json({"message":"Could not update blog"})
    
  })
}

const delete_blog = async (req,res)=>{
  try{ 
    let user = req.user
    const blog = await Blog.findById(req.params.id)
    console.log(blog.author)
  if (blog){
      if (user._id===blog.author){
       Blog.findByIdAndDelete(blog._id)
       return res.json({"redirect":"/blogs/"})
    }
    else{
    req.flash("error", "You cannot delete")
    return res.json({"error":"Unauthorized user"})
    }
    
  }else return res.sendStatus(409)
}catch(err){
  console.log(err)
}
}

const makeComment =async (req, res)=>{
  let user= req.user
  //create a new comment
  const comment = await Comment.create({author:user._id, post:req.params._id, content:req.body})
  comment.save()
  //update the user comments with new comment
  user.comments.push(comment)
  user.save()
  .then(res=>console.log(res))
  .catch(err=>console.error(err.message))
  //update blog with comment
    if (comment){
      const blog =Blog.findByIdAndUpdate(req.params.id, {comments:comment._id},{new:true})
      if(blog) return res.json(blog)
      else return res.json({"error":"Could not update blog"})
}
  else return res.json({"err":"Could not create comment"})
    
}


const deleteComment = (req, res)=>{
  let user = req.user
 Comment.findById(req.params.id)
 .then(comment=>{
   if (user._id!=comment.author && user._id!= comment.post.author){
     req.flash("err_message", "You cannot delete this comment")
     res.redirect("/blogs/")
   }
   else{
   comment.remove()
   .then(comment=>{
     res.json({"message":"comment deleted successfully", "redirect":"/blogs/posts/comment.post"})
   }).catch(console.log(err))
  }
 })
}

const makeLike =async(req, res)=>{
 const blog = await Blog.findById(req.params.id)
 let like;
 if (!blog){
   res.status(400).json({"err":"Could not find blog"})
 }
 else{
    like = await Like.find({post: blog._id, author:user._id})
   if (like){
     Like.findByIdAndDelete(like._id)
   }
   else {
     newLike = await Like.create({author:user._id, post:blog._id})
     if (newLike){
       newLike.save()
       newBlog = awaitBlog.findByIdAndUpdate(req.params.id, {likes:newLike._id}, {new:true})
       if (new_blog) return res.json({new_blog})
     }
   }
   return res.json({"likes":blog.likes.length, "liked": user._id in blog.likes.map(like=>like.author)})
 }
}


 module.exports={
 	get_blogs,
 	find_blog,
   blog_form,
 	new_blog,
 	edit_form,
 	update_blog,
 	delete_blog, 
   makeComment,
   makeLike
  }
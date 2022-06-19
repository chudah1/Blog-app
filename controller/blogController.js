const {Blog, User, Comment, Like} = require("../models/Model.js");
const { request } = require("express");


const get_blogs = (req,res)=>{
 Blog.find({}).populate("comments")
  .then(blogs=>{res.render("blogs", {blogs})})
  .catch(err=>console.log(err))
};

 const find_blog = async (req, res)=>{
   try{
 const blog= await Blog.findById(req.params.id)
      if(blog){
       return res.render("blog", {id:blog._id,title: blog.title, content:blog.content, comments:blog.comments})
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


const new_blog = async (req, res)=>{
  try{
  const user= req.user
  const blog = new Blog({
    title:req.body.title,
    content:req.body.content, 
    author:user._id,
    imageName:request.file.filename
  })
  await blog.save()
  if (Array.isArray(user.blogs)){
  user.blogs.push(blog)
  }
  await user.save()
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

const update_blog = async (req, res)=>{
  let user = req.user
  let blogId = req.params.id
 let blog = await Blog.findbyId(blogId)
 if (blog){
  if (user._id.equals(blog.author)){
    await blog.updateOne({
      title:req.body.title,
      content:req.body.content
    },
    {new:true}
    ) 
    return res.redirect("/blogs")
  }
  else{
    return res.status(409).send("You are not authorized to update this post")
  }
 }
  return res.status(401).send("Post does not exist") 
  }

const delete_blog = async (req,res)=>{
  try{ 
    let user = req.user
    const blog = await Blog.findById(req.params.id).select("_id author")
  if (blog){
      if (user._id.equals(blog.author)){
       await blog.remove()
       return res.json({"redirect":"/blogs/"})
    }
    req.flash("error", "You cannot delete")
    return res.json({"error":"Unauthorized user"})

  }else return res.sendStatus(409)
}catch(err){
  console.error(err)
}
}

const makeComment =async (req, res)=>{
  let user= req.user
  const blogId = req.params.id;
  const blog = await Blog.findById(blogId);
  
  if (blog){
    const comment = new Comment({author:user._id, blog:blogId, content:req.body.comment, username:user.username})
    await comment.save()
  //update the blog comments with new comment
    blog.comments.push(comment)
  //update blog with comment to save to database
      Blog.findByIdAndUpdate(blogId, {$push: {comments:{_id:comment._id}}},{new:true}).exec()
       return res.status(200).send("Comment added successfully")
  }
   return res.status(409).send("Could not create comment succesfully")
}


const deleteComment = async (req, res)=>{
  let blog;
  let user = req.user
  let comment = await Comment.findById(req.params.id)
    if (comment){
      blog = await Blog.findById(comment.blog).select("_id author")
      if (user._id.equals(comment.author) || user._id.equals(blog.author)){
       await comment.remove()
       return res.status(201).json({"message":"comment deleted successfully", "redirect":"/blogs/posts/" + blog._id})
    } 
    req.flash("err_message", "You cannot delete this comment")
    return res.status(409).send("Unauthorized to delete this comment")
   }
   else return res.status(409).send("Comment does not exist")
 
}

const makeLike=async (req, res)=>{
  let user = req.user
 const blog = await Blog.findById(req.params.id)
 if (!blog){
   res.status(400).json({"err":"Could not find blog"})
 }
 else{
   let liked = blog.likes.map(like=>{
    return (like._id.equals(user._id))
  })
  if (liked){
    await blog.updateOne({$pull:{likes:user._id}}, {new:true}).exec()
    return res.json({"likes":blog.likes.length, "liked": liked })

  } else {
    await blog.updateOne({$push:{likes:{_id:user._id}}}, {new:true}).exec()
    return res.json({"likes":blog.likes.length, "liked": liked })
  }
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
   deleteComment,
   makeLike
  }
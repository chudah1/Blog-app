const { blogModel, User, CommentModel, likeModel} = require("../models/Model.js");

const get_blogs = (req,res)=>{
  blogModel.find({})
  .then(blogs=>{res.render("home", {blogs})})
  .catch(err=>console.log(err))};

 const find_blog = (req, res)=>{
  blogModel.findById(req.params.id).populate("comments")
  .then(blog=>{
       res.render("post", {id:blog._id,title: blog.title, content:blog.content, comments:blog.comments})
  }).catch(err=>res.json(err))
  }


const new_blog = (req, res)=>{
  const blog = new blogModel({
    title:req.body.title,
    content:req.body.content
  })
  blog.save()
  .then(res=>console.log(res))
  .catch(err=>console.log(err))
  res.redirect("/blogs")
}

const edit_form = (req, res)=>{
   blogModel.findById(req.params.id)
    .then(blog=>{
      res.render("edit", {id:blog._id, title: blog.title, content:blog.content})
    })
  .catch(err=>res.redirect("/blogs"));

}

const update_blog = (req, res)=>{
  blogModel.findByIdAndUpdate(req.params.id, {
   title:req.body.title,
   content:req.body.content
  }, (err)=>{
    if (!err){
      res.redirect("/blogs")
    }
  res.status(401).json({"message":"Could not update blog"})
    
  })
}

const delete_blog = (req,res)=>{
  blogModel.findByIdAndDelete(req.params.id)
  .then(result=>{
    res.json({"redirect":"/blogs"})

  })
  .catch(err=>console.log(err))
}

const makeComment =(req, res)=>{
  CommentModel.create(req.body)
  .then((comment)=>{
    if (comment){
      blogModel.findByIdAndUpdate(req.params.id, 
        {$set:{comments:comment._id}},
      {new:true}
  ).then((blog)=>{
    if(blog) res.json(blog)
  }).catch(res.json({"error":"Could not update blog"}))
}
  })
  .catch(err=>res.json({"err":"Could not create comment"}) )
    
}

const deleteComment = (req, res)=>{
 CommentModel.findById(req.params.id)
 .then(comment=>{
   if (user._id!=comment.author && user._id!= comment.post.author){
     req.flash("err_message", "You cannot delete this comment")
   }
   comment.remove()
   .then(comment=>{
     res.status.json({"message":"comment deleted successfully", "redirect":"/blogs/posts/comment.post._id"})
   }).catch(console.log(err))
 })
}



 module.exports={
 	get_blogs,
 	find_blog,
 	new_blog,
 	edit_form,
 	update_blog,
 	delete_blog, 
   makeComment
  }
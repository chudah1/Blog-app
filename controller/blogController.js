const blogModel= require("../models/Model.js").blogModel;


const get_blogs = (req,res)=>{
  blogModel.find({})
  .then(blogs=>{res.render("home", {blogs})})
  .catch(err=>console.log(err))};

 const find_blog = (req, res)=>{
  blogModel.findById(req.params.id, (err, blog)=>{
    if (!err){
      res.render("post", {id:blog._id,title: blog.title, content:blog.content})

}else{
  console.log(err);
}
  })
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
   blogModel.findById(req.params.id, (err, blog)=>{
    if (!err){
      res.render("edit", {id:blog._id, title: blog.title, content:blog.content})

}else{
  res.redirect("/blogs");
}
 })

}

const update_blog = (req, res)=>{
  blogModel.findByIdAndUpdate(req.params.id, {
   title:req.body.title,
   content:req.body.content
  }, (err)=>{
    if (!err){
      res.redirect("/blogs")
    }else{
      console.log(err);
    }
  })
}

const delete_blog = (req,res)=>{
  blogModel.findByIdAndDelete(req.params.id)
  .then(result=>{
    res.json({"redirect":"/blogs"})

  })
  .catch(err=>console.log(err))
}






 module.exports={
 	get_blogs,
 	find_blog,
 	new_blog,
 	edit_form,
 	update_blog,
 	delete_blog



 }
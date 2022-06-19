const router = require("express").Router();
const { loginRequired, checkUser } = require("../controller/Authcontroller.js");
const blogController = require("../controller/blogController.js");
const multer = require("multer");


router.get("/",  loginRequired, blogController.get_blogs )

// get request for a single blog
router.get("/posts/:id",loginRequired, blogController.find_blog )

// create new blog
router.get("/compose", blogController.blog_form)
//image storing options
const storage = multer.diskStorage({
    //destination for files
    destination: function(request, file, callback){
     callback(null, "../public/images")
    },
    filename: function(request, file, callback){
       callback(null, Date.now()+file.originalname)
    }
 
 })
 
 //upload parameters
 const upload = multer({
   storage:storage,
   limits:{
     fieldSize:1024*1024*4
   }
 })
 
router.post("/compose", loginRequired, upload.single("blogImage"), blogController.new_blog)

// edit a blog
router.get("/posts/edit/:id", blogController.edit_form)

//update post submit route

router.post("/posts/update/:id", blogController.update_blog)

//delete request
router.delete("/delete/:id", loginRequired, blogController.delete_blog)

// make comment

router.post("/makecomment/:id", loginRequired, blogController.makeComment)
router.delete("/deletecomment/:id", loginRequired, blogController.deleteComment)

//like
router.post("/likeBlog/:id", loginRequired, blogController.makeLike)

module.exports=router;
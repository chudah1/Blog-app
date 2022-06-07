const router = require("express").Router();
const { loginRequired, checkUser } = require("../controller/Authcontroller.js");
const blogController = require("../controller/blogController.js");


router.get("/", loginRequired, blogController.get_blogs )

// get request for a single blog
router.get("/posts/:id",loginRequired, blogController.find_blog )

// create new blog
router.get("/compose", loginRequired, blogController.blog_form)
router.post("/compose", loginRequired, blogController.new_blog)

// edit a blog
router.get("/posts/edit/:id", blogController.edit_form)

//update post submit route

router.post("/posts/update/:id", blogController.update_blog)

//delete request
router.delete("/delete/:id", loginRequired, blogController.delete_blog)

// make comment

router.post("/makecomment/:id", blogController.makeComment)
router.delete("/deletecomment/:id")

module.exports=router;
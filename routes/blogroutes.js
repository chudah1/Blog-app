const router = require("express").Router();
const blogController = require("../controller/blogController.js");

router.get("/", blogController.get_blogs )

// get request for a single blog
router.get("/posts/:id", blogController.find_blog )

// create new blog


router.post("/compose", blogController.new_blog)

// edit a blog
router.get("/posts/edit/:id", blogController.edit_form)

//update post submit route

router.post("/posts/update/:id", blogController.update_blog)

//delete request
router.delete("/posts/delete/:id", blogController.delete_blog)

module.exports=router;
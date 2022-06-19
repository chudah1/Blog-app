const router = require("express").Router();
const {register, verifiedEmail, checkUser, fowardAuthenticated} = require("../controller/Authcontroller.js");
const {login} = require("../controller/Authcontroller.js")
const{logout} = require("../controller/Authcontroller.js")


router.get("/register", fowardAuthenticated, (req, res)=>res.render("register"))
router.post("/register", register)
router.get("/login", fowardAuthenticated, (req, res)=>res.render("login"))
router.get("/verify/:id", verifiedEmail)
router.post("/login", login)
router.get("/logout", logout)
module.exports=router;
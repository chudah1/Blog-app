const router = require("express").Router();
const {register} = require("../controller/Authcontroller.js");
const {login} = require("../controller/Authcontroller.js")


router.get("/register", (req, res)=>res.render("register"))
router.post("/register", register)
router.get("/login", (req, res)=>res.render("login"))
router.post("/login", login)

module.exports=router;
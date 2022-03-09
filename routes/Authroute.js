const express= require("express");
const router = express.Router();
const {register} = require("../controller/Authcontroller.js");


router.get("/register", (req, res)=>res.render("register"))
router.post("/register", register)
router.get("/login", (req, res)=>res.render("login"))

module.exports=router;
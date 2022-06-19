
const express = require("express");
const cookieParser = require('cookie-parser')

require("dotenv").config();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ =require("lodash");
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const flash = require("connect-flash")
const session = require("express-session");
const { checkUser } = require("./controller/Authcontroller.js");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.json())
app.use(cookieParser())

//apply checkUser middleware to all routess
app.get("*", checkUser)
// render the individual pages
app.get("/about",(req,res)=>{
  res.render("about", {aboutContent});
})


app.get("/contact",(req,res)=>{
  res.render("contact", {contactContent});
})

app.get("/compose", (req, res)=>{
  res.render("compose")
})


//express-session
app.use(session({
  secret: 'keyboardcat',
  resave: true,
  saveUninitialized: true,
}))
//flash
app.use(flash())

//global varibales for flash messages
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash("success_msg")
  res.locals.err_msg = req.flash("err_msg")
  res.locals.error = req.flash('error');
  next()
})

//blog routes
app.use("/blogs", require("./routes/blogroutes.js"));

//auth routes
app.use("/users", require("./routes/Authroute.js"))
//set up the server
app.listen(3000, ()=> {
  console.log('Server started on port 3000');
});

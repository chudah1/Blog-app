
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ =require("lodash");
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const passport =  require("passport");
const session = require('express-session');
const LocalStrategy = require("passport-local").Strategy
const app = express();
const {User} =require("./models/Model.js")
const bcrypt = require("bcryptjs");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//express session middleware
app.use(session({
  secret: "secret",
  resave: false ,
  saveUninitialized: true ,
}))
// passport session middleware
app.use(passport.initialize()) 
app.use(passport.session())    


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

//passport
const Authuser = (email, password, done)=>{
  User.findOne({email:email})
  .then(user=>{
    if (user){
      bcrypt.compare(password, user.password, (err, checked)=>{
        if (err) throw err
        if (checked){
          return done(null, user, {msg:"Validation passed"})
        } else{
          return done(null, false, {msg:"Password does not match"})
        }
      })
    } else{
      return done(false, null, {msg:"Email is not registered"})
    }

  })

}
passport.use(new LocalStrategy({usernameField:"email"},Authuser))
//serialiaze user
passport.serializeUser( (user, done) => {
    done(null, user.id)
})
//deserialize
passport.deserializeUser((id, done) => {
  User.findById(id, function(err, user) {
      done(err, user);
    });
})

app.post ("/users/login", (req, res,next)=>{passport.authenticate('local', {
   successRedirect: "/blogs",
   failureRedirect: "/users/login",
})(req, res,next)
})

//blog routes
app.use("/blogs", require("./routes/blogroutes.js"));

//auth routes
app.use("/users", require("./routes/Authroute.js"))
//set up the server
app.listen(process.env.PORT || 3000, function() {
  console.log('Server started on port 3000');
});

//jshint esversion:6

//require express
const express = require("express");
//require body-parser
const bodyParser = require("body-parser");
//require ejs
const ejs = require("ejs");
//require mongoose
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = {
    email: String,
    password: String
};

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save().then(() => {
        res.render("secrets");
    }).catch((err)=>{
        console.log(err);
    })
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}).then((user)=>{
        if (user){
            if (user.password === password){
                res.render("secrets");
            }
        } else {
            console.log("User not found");
        }
    }).catch((err)=>{
        console.log(err);
    });
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});
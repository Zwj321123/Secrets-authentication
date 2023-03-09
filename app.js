//jshint esversion:6

//require dotenv
require("dotenv").config();
//require express
const express = require("express");
//require body-parser
const bodyParser = require("body-parser");
//require ejs
const ejs = require("ejs");
//require mongoose
const mongoose = require("mongoose");
//require mongoose-encryption
const encrypt = require("mongoose-encryption");
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET;

// userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

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

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save().then(() => {
            res.render("secrets");
        }).catch((err)=>{
            console.log(err);
        });
    });
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}).then((user)=>{
        if (user){
            //if user found, compare the password with the hash. If password matches the hash, render secrets page
            bcrypt.compare(password, user.password, function(err, result) {
                if (result === true){
                    res.render("secrets");
                } else {
                    console.log("Wrong password");
                }
            });
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
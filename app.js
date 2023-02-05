//jshint esversion:6

require('dotenv').config(); // tre pus mereu aici sus de tot
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
  }));
// am instalat si dotenv pentru variabile sa tin secretele safe
// tre sa fac un file in root sa se numeasca .env

// console.log(process.env.API_KEY); asa am scos la consola API_KEY din .env

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({ // ca sa pot baga criptarea tre sa fac un obiect din schema in felul asta cu new
  email: String,
  password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] }); // am bagat criptarea pe schema inainte sa creez un obiect cu schema asta si sa il folosesc
// am setat sa fie criptare doar pe password, daca vrei mai multe campuri, "alt camp"

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
    email: req.body.username, // corespunde pe inputul username din register.ejs
    password: req.body.password // corespunde pe inputul password din register.ejs
  });
  newUser.save(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.render("secrets"); // daca nu e eroare ii rendeaza secrets.ejs
    }
  });
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser) {
    // User e colectia Users si cauta in ea dupa email, daca ezista sau nu 
    if(err) {
      console.log(err);
    } else {
      if(foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        } else {
          console.log("The password is wrong");
        }
      }
    }
  });
});

















  app.listen(3000, function() {
    console.log("Server started on port 3000");
  });


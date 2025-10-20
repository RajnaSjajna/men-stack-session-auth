const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const User = require("../models/User.js")

// sign up routes

router.get("/sign-up", (req, res)=> {
    res.render("auth/sign-up.ejs")
})

router.post("/sign-up", async (req,res)=> {
    // res.send("Form data submitted")

    // Check if User exsists
    const userInDatabase = await User.findOne({username: req.body.username})
    if(userInDatabase) {
        res.send("Username is Already Taken")
    }
    // Check if passwords match
    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Password and Confirm Password must match");
      }
    // Hash the password
      const hashedPassword = bcrypt.hashSync(req.body.password, 10)
      req.body.password = hashedPassword

    const user = await User.create(req.body)
    res.send(`Thanks for signing up ${user.username}`)
})

// sign in routes

router.get("/sign-in", (req, res)=> {
    res.render("auth/sign-in.ejs")
})

router.post("/sign-in", async (req, res)=> {
    // res.send("Request to sign in received!");

    // check if user exists 
    const userInDatabase = await User.findOne({username: req.body.username}) 
        if(!userInDatabase){
            return res.send("Login Failed. please try again!")
        }

    // check if passwords match

        const validPassword = bcrypt.compareSync(
            req.body.password,
            userInDatabase.password
          );
          if (!validPassword) {
            return res.send("Login failed. Password is incorrect. Please try again.");
          }

        // create a session

        req.session.user = {
            username: userInDatabase.username,
            _id: userInDatabase._id
        };

        res.redirect("/")
          
})

module.exports = router
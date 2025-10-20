const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const morgan = require("morgan")
const session = require("express-session")

const port = process.env.PORT ? process.env.PORT : "4000"

const authCtrl =require("./controllers/auth.js")

dotenv.config()
const app = express()

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on("connected", ()=> {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})


//middlware
app.use(express.urlencoded({extended: false}))
app.use(methodOverride("_method"))
app.use(morgan("dev"))

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
)

app.use("/auth", authCtrl)

//Routes
app.get("/", (req, res)=> {
    // res.send("This is the root of the app")
    res.render("index.ejs", {
        user: req.session.user
    })
})



app.listen(port, ()=>{
    console.log(`This express app is ready on ${port}`)
})

const User =require("./models/user-model")
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

// 連結MongoDB
mongoose
  .connect(process.env.URL)
  .then(() => {
    console.log("連結到mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.get("/students",async(req,res)=>{
  try{
    let data =await User.find()
    return res.status(200).send(data)
    console.log(data)
  }
  catch(e){
res.status(500).send({error:"error"})
  }
})
app.get("/students/:username",async(req,res)=>{
  let {username}=req.params
  try{
    let data =await User.findOne({username})
    return res.status(200).send(data)
    console.log(data)
  }
  catch(e){
console.log(e)
  }
})
app.use("/api/user", authRoute);
// course route應該被jwt保護
// 如果request header內部沒有jwt，則request就會被視為是unauthorized
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

app.listen(8080, () => {
  console.log("後端伺服器聆聽在port 8080...");
});

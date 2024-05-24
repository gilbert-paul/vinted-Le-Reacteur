const express = require('express')
require('dotenv').config();
const app = express()
const cors = require('cors')
const cloudinary = require("cloudinary").v2;
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});


app.use(cors())
app.use(express.json())
app.use("/user",require('./routes/user.routes.js'))
app.use("/offers", require('./routes/offer.routes.js'))



app.all("*", (req,res)=>{
  return res.status(404).json({message: "Route Not Found"})
})
app.listen(process.env.PORT, ()=>console.log(`Server ON - ${process.env} ${process.env.PORT}`))
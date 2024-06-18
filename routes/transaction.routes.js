const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const isAuthentificated = require("../utils/isAuthentificated.js");
const isOwner = require("../utils/isOwner.js");





router.get("/buy", isAuthentificated, async (req, res) => {
  try {
    const result = {
      status:200,
      message:"buy",
      data:{}
    }
   return res.status(result.status).json({message: result.message, data: result.data});
  } catch (error) {
    return res.status(500).json({ message: "Error with BDD" });
  }
});
router.get("/sell", isAuthentificated, async (req, res) => {
  try {
    const result = {
      status:200,
      message:"sell",
      data:{}
    }
   return res.status(result.status).json({message: result.message, data: result.data});
  } catch (error) {
    return res.status(500).json({ message: "Error with BDD" });
  }
});


module.exports = router;

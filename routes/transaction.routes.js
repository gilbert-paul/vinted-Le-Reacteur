const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const isAuthentificated = require("../utils/isAuthentificated.js");
const isOwner = require("../utils/isOwner.js");
const Transaction = require("../models/Transaction.js");





router.get("/buy", isAuthentificated, async (req, res) => {
  try {
    
      const user = req.user
      const sellTransactions = await Transaction.find({buyer:{_id:user._id}}).populate("seller buyer offer")
      console.log(sellTransactions)
      const result = {
        status:200,
        message:"sell",
        data:{sellTransactions}
      }

   return res.status(result.status).json({message: result.message, data: result.data});
  } catch (error) {
    return res.status(500).json({ message: "Error with BDD" });
  }
});
router.get("/sell", isAuthentificated, async (req, res) => {
  try {
    const user = req.user
    const sellTransactions = await Transaction.find({seller:{_id:user._id}}).populate("seller buyer offer")
    const result = {
      status:200,
      message:"sell",
      data:{sellTransactions}
    }
   return res.status(result.status).json({message: result.message, data: result.data});
  } catch (error) {
    return res.status(500).json({ message: "Error with BDD" });
  }
});


module.exports = router;

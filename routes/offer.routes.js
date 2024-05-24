const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const isAuthentificated = require("../utils/isAuthentificated.js");
const isOwner = require("../utils/isOwner.js");
const publishOffer = require("../utils/offer/publishOffer.js");
const seeAllOffers = require("../utils/offer/seeAllOffers.js");
const seeMyOffers = require("../utils/offer/seeMyOffers.js");
const deleteOffer = require("../utils/offer/deleteOffer.js");
const seeOneOffer = require("../utils/offer/seeOneOffer.js");
const updateOffer = require("../utils/offer/updateOffer.js");


router.post("/publish", isAuthentificated, fileUpload(), async (req, res) => {
  try {
    return publishOffer(req,res)
  } catch (error) {
    return res.status(500).json({ message: "Error with BDD" });
  }
});
router.get("/my-offers", isAuthentificated, async (req, res) => {
  try {
    return seeMyOffers(req,res)
  } catch (error) {
    return res.status(500).json({ message: "Error with BDD" });
  }
});
router.get("/", async (req, res) => {
  try {
   return seeAllOffers(req,res)
  } catch (error) {
    return res.status(500).json({ message: "Error with BDD" });
  }
});
router.delete(
  "/delete/:id",
  isAuthentificated,
  isOwner,
  fileUpload(),
  async (req, res) => {
    try {
      return deleteOffer(req,res)
    } catch (error) {
      return res.status(500).json({ message: "Error with BDD" });
    }
  }
);
router.put(
  "/update/:id",
  isAuthentificated,
  isOwner,
  fileUpload(),
  async (req, res) => {
    try {
      return updateOffer(req,res)
    } catch (error) {
      return res.status(500).json({ message: "Error with BDD" });
    }
  }
);
router.get("/:id", async (req, res) => {
  try {
    return seeOneOffer(req,res)
  } catch (error) {
    return res.status(500).json({ message: "Error with BDD" });
  }
});
module.exports = router;

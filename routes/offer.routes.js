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
    const allInformations = req.body
    const user= req.user
    let image = {};
    if (req.files) {
      image = req.files;
    }

    const result = await publishOffer(allInformations,user, image)
    return res.status(result.status).json({message: result.message, data: result.data});
  } catch (error) {
    return res.status(500).json({ message: "Error with BDD" });
  }
});
router.get("/my-offers", isAuthentificated, async (req, res) => {
  try {
    const allInformations = {user:req.user, query:req.query}
   const result = await seeMyOffers(allInformations)
   return res.status(result.status).json({message: result.message, data: result.data});
  } catch (error) {
    return res.status(500).json({ message: "Error with BDD" });
  }
});
router.get("/", async (req, res) => {
  try {
    const allInformations = {user:req.user, query:req.query}
   const result = await seeAllOffers(allInformations)
   return res.status(result.status).json({message: result.message, data: result.data});
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
      const thisOfferID=req.params.id
      const result = await deleteOffer(thisOfferID)
      return res.status(result.status).json({message: result.message, data: result.data});
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
      const thisOfferID = req.params.id
      const allInformations = req.body
      let newImage = {};
      if (req.files) {
        newImage = req.files;
      }
      const result = await updateOffer(thisOfferID, allInformations, newImage)
      return res.status(result.status).json({message: result.message, data: result.data});
    
    } catch (error) {
      return res.status(500).json({ message: "Error with BDD" });
    }
  }
);
router.get("/:id", async (req, res) => {
  try {
    const thisOfferID=req.params.id
    const result = await seeOneOffer(thisOfferID)
    return res.status(result.status).json({message: result.message, data: result.data});



  } catch (error) {
    return res.status(500).json({ message: "Error with BDD" });
  }
});
module.exports = router;

const Offer = require("../../models/Offer");
const cleanGetOffer = require("../cleanGetOffer");

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Promise}
 */
const seeOneOffer = async(req,res)=>{
  const thisOffer = await Offer.findById(req.params.id).populate("owner")
  if (!thisOffer) {
    return res.status(404).json({ message: "Offer not found" });
  }
  const thisOfferArray = [thisOffer]
  const offerInformations = cleanGetOffer(thisOfferArray, 1)

  return res.status(202).json(offerInformations.offers[0]);
}

module.exports = seeOneOffer
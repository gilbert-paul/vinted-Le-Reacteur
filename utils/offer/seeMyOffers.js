const cleanGetOffer = require("../cleanGetOffer");
const filterOffer = require("../filterOffer");

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise}
 */
const seeMyOffers = async (req, res) => {
  const allOffersParam = await filterOffer(req, true)
  
  const allOffers = allOffersParam.allOffers
  if (!allOffers) {
    return res.status(404).json({ message: "Offer not found" });
  }
  const allOffersInformations = cleanGetOffer(allOffers, allOffers.length)
  if(allOffersInformations.count === 0){
    return res.status(404).json({message: "There is no offer here"})
  }
  if(allOffersParam.thisPage > Math.ceil(allOffersInformations.count/allOffersParam.numberLimit)){
    return res.status(404).json({message: `There is no offer on this page, the last offer is page ${Math.ceil(allOffersInformations.count/allOffersParam.numberLimit)}`})
  }

  return res.status(202).json(allOffersInformations);
};

module.exports = seeMyOffers;
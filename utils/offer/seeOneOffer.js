const Offer = require("../../models/Offer");
const cleanGetOffer = require("../cleanGetOffer");

/**
 * @typedef Result
 * @property {String | Object} message
 * @property {Number} status
 */
/**
 *
 * @param {String} thisOfferID
 * @returns {Promise<Result>}
 */
const seeOneOffer = async (thisOfferID) => {

    const thisOffer = await Offer.findById(thisOfferID)
      .populate("owner")
      .populate({ path: "account.avatar", strictPopulate: false })
    if (!thisOffer) {
      return { message: "This offer doesn't exist", status: 404 };
    }
    const thisOfferArray = [thisOffer];
    const offerInformations = cleanGetOffer(thisOfferArray, 1);
    return { message: offerInformations.offers[0], status: 202 };

};

module.exports = seeOneOffer;

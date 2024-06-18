const Offer = require("../../models/Offer");
const cleanGetOffer = require("../cleanGetOffer");

/**
 * @typedef Result
 * @property {String | Object} message
 *  * @property {String | Object} data
 *  * @property {String | Object} owner
 *  * @property {String | Object} buyer
 * 
 * 

 * @property {Number} status
 */
/**
 *
 * @param {String} thisOfferID
 * @returns {Promise<Result>}
 */
const seeOneOffer = async (thisOfferID) => {
    const thisOwner = await Offer.findById(thisOfferID).populate("owner")
    const thisBuyer = await Offer.findById(thisOfferID).populate("bought").populate("buyer")
    const thisOffer = await Offer.findById(thisOfferID)
      .populate("owner")
      .populate({ path: "account.avatar", strictPopulate: false })
    if (!thisOffer) {
      return { message: "This offer doesn't exist", status: 404 };
    }
    const thisOfferArray = [thisOffer];
    const offerInformations = cleanGetOffer(thisOfferArray, 1);
    return { data: offerInformations.offers[0], owner: thisOwner.owner.token, buyer: thisBuyer.bought, message:"One Offer", status: 202 };

};

module.exports = seeOneOffer;

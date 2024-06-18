const Offer = require("../../models/Offer");

/**
 * @typedef Result
 * @property {String | Object} message
 * @property {String | Object} data
 *
 * @property {Number} status
 */
/**
 *
 * @param {String} thisOfferID
 * @returns {Promise<Result>}
 */
const buyOffer = async (allInformations, user, id) => {
  const thisOffer = await Offer.findById(id);
  if (thisOffer && !thisOffer.bought.isBought) {
    thisOffer.bought.isBought = true;

    await thisOffer.save();
    return {
      data: thisOffer,
      message: "Offer bought with success !",
      status: 202,
    };
  }
  return {
    data: null,
    message: "Offer not found or already bought",
    status: 202,
  };
};

module.exports = buyOffer;

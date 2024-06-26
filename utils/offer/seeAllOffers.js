const cleanGetOffer = require("../cleanGetOffer");
const filterOffer = require("../filterOffer");

/**
 * @typedef Result
 * @property {String | Object} message
 * @property {String | Object} data
 *
 * @property {Number} status
 */
/**
 *
 * @param {Object} allInformations
 * @returns {Promise<Result>}
 */
const seeAllOffers = async (allInformations) => {
  const allOffersParam = await filterOffer(allInformations, false);

  const allOffers = allOffersParam.allOffers;
  if (!allOffers) {
    return { message: "Offer not found", status: 404 };
  }
  const allOffersInformations = cleanGetOffer(
    allOffers,
    allOffersParam.counter
  );
  if (allOffersInformations.count === 0) {
    return { message: "There is no offer yet", status: 404 };
  }
  if (
    allOffersParam.thisPage >
    Math.ceil(allOffersInformations.count / allOffersParam.numberLimit)
  ) {
    return {
      message: `There is no offer on this page, the last offer is page ${Math.ceil(
        allOffersInformations.count / allOffersParam.numberLimit
      )}`,
      status: 404,
    };
  }
  return { data: allOffersInformations, message: "All Offers", status: 202 };
};

module.exports = seeAllOffers;

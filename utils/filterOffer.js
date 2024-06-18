const Offer = require("../models/Offer");

/**
 *
 * @param {Object} req
 * @param {Boolean} seeOnlyOwnerOffers => Add a key owner to allFiltersFind, use for the request /offers/my-offer
 * @returns
 */
const filterOffer = async (allInformations, seeOnlyOwnerOffers = false, offersPerPage = 20) => {
  const { title, priceMin, priceMax, sort, page, limit } = allInformations.query;
    let numberLimit = offersPerPage;
if(limit){
  numberLimit = Number(limit)
}
  let thisPage = 1;
  if (page) {
    thisPage = Number(page);
  }
  const allFiltersFind = {};
  allFiltersFind.bought.isBought=false;
  if (seeOnlyOwnerOffers) {
    allFiltersFind.owner = allInformations.user._id;
  }
  if (title) {
    allFiltersFind.product_name = new RegExp(title, "i");
  }
  if (priceMin) {
      allFiltersFind.product_price = {$gte: Number(priceMin)}
  }
  if (priceMax) {
      allFiltersFind.product_price = { ...allFiltersFind.product_price, $lte: Number(priceMax) }; 
  }
  let sortFilter;
  if (sort === "price-asc" || sort === "price-desc") {
    const sortArray = sort.split("-");
    sortFilter = { product_price: sortArray[1] };
  }
  console.log(allFiltersFind)
  const counter = (await Offer.find(allFiltersFind)).length
  const allOffers = await Offer.find(allFiltersFind)
    .populate("owner","account")
    .limit(numberLimit)
    .skip(numberLimit * (thisPage - 1))
    .sort(sortFilter);
  return {allOffers,numberLimit,thisPage,counter};
};

module.exports = filterOffer;

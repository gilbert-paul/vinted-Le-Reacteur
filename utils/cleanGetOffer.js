/**
 *
 * @param {Object} allOffers
 */
const cleanGetOffer = (allOffers,counter) => {
  const allOffersInformations = {
    count: counter,
    offers: [],
  };
  allOffersInformations.offers = [];
  for (let i = 0; i < allOffers.length; i++) {
    const allProductImages = [];
    for (let j = 0; j < allOffers[i].product_pictures.length; j++) {
      allProductImages.push(allOffers[i].product_pictures[j].secure_url);
    }

    const offerInformations = {
      product_name: allOffers[i].product_name,
      product_description: allOffers[i].product_description,
      product_price: allOffers[i].product_price,
      product_details: allOffers[i].product_details,
      product_pictures: allProductImages,
      owner: {
        account: {
          username: allOffers[i].owner.account.username,
        },
      },

    };
    if(allOffers[i].product_image){
      offerInformations.product_image = allOffers[i].product_image.secure_url
    }
      if(allOffers[i].owner.account.avatar){
        offerInformations.owner.account.avatar = allOffers[i].owner.account.avatar.secure_url
      }
    allOffersInformations.offers.push(offerInformations);
  }
  return allOffersInformations;
};

module.exports = cleanGetOffer;

const cloudinary = require("cloudinary").v2;
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
const deleteOffer = async(thisOfferID)=>{

    const thisOffer = await Offer.findById(thisOfferID);
    if (thisOffer) {
      if (thisOffer.product_image) {
        await cloudinary.api.delete_resources_by_prefix(
          thisOffer.product_image.folder
        );
        await cloudinary.api.delete_folder(thisOffer.product_image.folder);
      }
    }
    await Offer.findByIdAndDelete(thisOfferID);
    return { data:null, message: "Offer deteled with success !", status: 202 };
}

module.exports = deleteOffer
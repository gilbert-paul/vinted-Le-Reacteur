const cloudinary = require("cloudinary").v2;
const Offer = require("../../models/Offer");

/**
 * 
 * @param {Object} res 
 * @param {Object} req 
 * @returns {Promise}
 */
const deleteOffer = async(req,res)=>{
  const thisOffer = await Offer.findById(req.params.id);
      if (thisOffer) {
        if (thisOffer.product_image.length > 0) {
          await cloudinary.api.delete_resources_by_prefix(
            thisOffer.product_image[0].folder
          );
          await cloudinary.api.delete_folder(thisOffer.product_image[0].folder);
        }
      }
      await Offer.findByIdAndDelete(req.params.id);
      return res.status(202).json({ message: "Offer deleted with success !" });
}

module.exports = deleteOffer
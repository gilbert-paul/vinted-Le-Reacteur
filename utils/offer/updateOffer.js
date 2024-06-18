const Offer = require("../../models/Offer");
const convertToBase64 = require("../convertToBase64.js");
const cloudinary = require("cloudinary").v2;
/**
 * @typedef Result
 * @property {String | Object} message
 *  * @property {String | Object} data

 * @property {Number} status
 */
/**
 *
 * @param {String} thisOfferID
 * @param {Object} allInformations
 * @param {Object} newImage
 * @returns {Promise<Result>}
 */
const updateOffer = async (thisOfferID, allInformations, newImage) => {
  const thisOffer = await Offer.findById(thisOfferID);
  if (!thisOffer) {
    return { message: "This offer doesn't exist", status: 404 };
  }

  const { title, description, price, condition, city, brand, size, color } =
    allInformations;

  if (newImage.picture) {
    const result = await cloudinary.uploader.upload(
      convertToBase64(newImage.picture),
      { folder: `${process.env.CLOUDINARY_FOLDER}/offer/${thisOffer._id}` }
    );
    thisOffer.product_pictures.push(result);
    thisOffer.product_image = result;
  }

  if (title) {
    if (title.length > 50) {
      return { message: "Your title is too long...", status: 417 };
    }

    thisOffer.product_name = title;
  }
  if (description) {
    if (description.length > 500) {
      return { message: "Your description is too long...", status: 417 };
    }
    thisOffer.description = description;
  }
  if (price) {
    if (Number(price) > 100000) {
      return { message: "Your price is too hight...", status: 417 };
    }

    thisOffer.price = price;
  }
  if (condition) {
    thisOffer.product_details[2]["ETAT"] = condition;
  }
  if (city) {
    thisOffer.product_details[4]["EMPLACEMENT"] = city;
  }
  if (brand) {
    thisOffer.product_details[0]["MARQUE"] = brand;
  }
  if (size) {
    thisOffer.product_details[1]["TAILLE"] = size;
  }
  if (color) {
    thisOffer.product_details[3]["COULEUR"] = color;
  }
  await thisOffer.markModified("product_details");
  await thisOffer.markModified("product_image");

  await thisOffer.save();
  return { data: thisOffer, message: "Offer Updated", status: 202 };
};

module.exports = updateOffer;

const Offer = require("../../models/Offer");
const offerVerify = require("../offerVerify");
const convertToBase64 = require("../convertToBase64.js");
const cloudinary = require("cloudinary").v2;

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
 * @param {Object} user
 * @param {array} image
 * @returns {Promise<Result>}
 */
const publishOffer = async (allInformations, user, image) => {
  const { title, description, price, condition, city, brand, size, color } =
    allInformations;
  const missingInformations = offerVerify(allInformations);
  if (missingInformations.length === 1) {
    return {
      message: `${missingInformations.join("")} is missing`,
      status: 417,
    };
  }
  if (missingInformations.length > 1) {
    return {
      message: `${missingInformations
        .slice(0, missingInformations.length - 1)
        .join("")} and ${missingInformations[
        missingInformations.length - 1
      ].replace(", ", "")} are missing`,
      status: 417,
    };
  }
  if (title.length > 50) {
    return { message: "Your title is too long...", status: 417 };
  }
  if (description.length > 500) {
    return { message: "Your description is too long...", status: 417 };
  }
  if (Number(price) > 100000) {
    return { message: "Your price is too hight...", status: 417 };
  }
  const newOffer = await new Offer({
    product_name: title,
    product_description: description,
    product_price: Number(price),
    product_details: [
      { MARQUE: brand },
      { TAILLE: size },
      { ETAT: condition },
      { COULEUR: color },
      { EMPLACEMENT: city },
    ],
    product_pictures: [],
    product_image: {},
    owner: user,
    bought: { isBought: false },
  });
  let productImage = {};
  await newOffer.save();
  const pictures = Object.values(image);
  if (pictures.length > 0) {
    for (let i = 0; i < pictures.length; i++) {
      productImage = await cloudinary.uploader.upload(
        convertToBase64(pictures[i]),
        { folder: `${process.env.CLOUDINARY_FOLDER}/offer/${newOffer._id}` }
      );
      newOffer.product_pictures.push(productImage);
      newOffer.product_image = productImage;
    }
  }
  await newOffer.markModified("product_image");
  await newOffer.save();
  const resultOwner = await newOffer.populate(
    "owner",
    "account.username account.avatar.secure_url"
  );
  return { data: resultOwner, message: "Offer publicated", status: 201 };
};

module.exports = publishOffer;

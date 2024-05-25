const Offer = require("../../models/Offer");
const offerVerify = require("../offerVerify");
const convertToBase64 = require("../convertToBase64.js");
const cloudinary = require("cloudinary").v2;

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Promise}
 */
const publishOffer = async (req, res) => {
  const { title, description, price, condition, city, brand, size, color } =
    req.body;
  const missingInformations = offerVerify(req.body);
  if (missingInformations.length === 1) {
    return res
      .status(417)
      .json({ message: `${missingInformations.join("")} is missing` });
  }
  if (missingInformations.length > 1) {
    return res.status(417).json({
      message: `${missingInformations
        .slice(0, missingInformations.length - 1)
        .join("")} and ${missingInformations[
        missingInformations.length - 1
      ].replace(", ", "")} are missing`,
    });
  }
  if (title.length > 50) {
    return res.status(417).json({ message: "Your title is too long..." });
  }
  if (description.length > 500) {
    return res.status(417).json({ message: "Your description is too long..." });
  }
  if (Number(price) > 100000) {
    return res.status(417).json({ message: "Your price is too hight..." });
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
    product_image:{},
    owner: req.user,
  });
  let productImage = {}
  await newOffer.save();
  if (req.files) {
    productImage = await cloudinary.uploader.upload(
      convertToBase64(req.files.picture),
      { folder: `${process.env.CLOUDINARY_FOLDER}/offer/${newOffer._id}` }
    );
    newOffer.product_pictures.push(productImage)
    newOffer.product_image = productImage
  }
  await newOffer.markModified("product_image");
  await newOffer.save();
  const resultOwner = await newOffer.populate(
    "owner",
    "account.username account.avatar.secure_url"
  );
  return res.status(202).json(resultOwner);
};

module.exports = publishOffer;

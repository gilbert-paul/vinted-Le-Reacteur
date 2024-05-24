const Offer = require("../../models/Offer");
const convertToBase64 = require("../convertToBase64.js");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});
/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Promise}
 */
const updateOffer = async (req, res) => {
  const thisOffer = await Offer.findById(req.params.id);
  if (!thisOffer) {
    return res.status(404).json({ message: "This offer doesn't exist" });
  }

  const { title, description, price, condition, city, brand, size, color } =
    req.body;

  if (req.files) {
    const result = await cloudinary.uploader.upload(
      convertToBase64(req.files.picture),
      { folder: `/vinted/offer/${thisOffer._id}` }
    );
    thisOffer.product_pictures.push(result)
    thisOffer.product_image = result;
  }

  if (title) {
    if (title.length > 50) {
      return res.status(417).json({ message: "Your title is too long..." });
    }

    thisOffer.product_name = title;
  }
  if (description) {
    if (description.length > 500) {
      return res
        .status(417)
        .json({ message: "Your description is too long..." });
    }
    thisOffer.description = description;
  }
  if (price) {
    if (Number(price) > 100000) {
      return res.status(417).json({ message: "Your price is too hight..." });
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
  return res.status(202).json(thisOffer);
};

module.exports = updateOffer;

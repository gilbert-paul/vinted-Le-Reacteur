const Offer = require("../../models/Offer");
const User = require("../../models/User");
const cloudinary = require("cloudinary").v2;

const deleteAllFromAnUser = async (req, res) => {
  const thisUser = await User.findById(req.user._id);
  if (!thisUser) {
    return res.status(404).json({ message: "Id is invalid" });
  }
  const allOffers = await Offer.find({ owner: thisUser._id });

  if (allOffers.length > 0) {
    for (let i = 0; i < allOffers.length; i++) {
      const thisOffer = allOffers[i];
      if (thisOffer) {
        if (thisOffer.product_pictures.length > 0) {
          await cloudinary.api.delete_resources_by_prefix(
            thisOffer.product_image.folder
          );
          await cloudinary.api.delete_folder(thisOffer.product_image.folder);
          await Offer.findByIdAndDelete(thisOffer._id);
        }
      }
    }
  }

  if (thisUser.account.avatar) {
    await cloudinary.api.delete_resources(thisUser.account.avatar.folder);
    await cloudinary.api.delete_folder(thisUser.account.avatar.folder);
  }
  await User.findByIdAndDelete(req.user._id);

  return res.status(202).json({ message: "User and Offers deleted" });
};

module.exports = deleteAllFromAnUser;

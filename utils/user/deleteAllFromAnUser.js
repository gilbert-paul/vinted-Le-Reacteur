const Offer = require("../../models/Offer");
const User = require("../../models/User");
const cloudinary = require("cloudinary").v2;

const deleteAllFromAnUser = async (user) => {
  const thisUser = await User.findById(user._id);
  if (!thisUser) {
    return { message: "Id is invalid", status: 404 };
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
    await cloudinary.api.delete_resources_by_prefix(
      thisUser.account.avatar.folder
    );
    await cloudinary.api.delete_folder(thisUser.account.avatar.folder);
  }
  await User.findByIdAndDelete(user._id);

  return { message: "User deleted", status: 202 };
};

module.exports = deleteAllFromAnUser;

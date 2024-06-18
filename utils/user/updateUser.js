const User = require("../../models/User.js");
const emailVerify = require("../emailVerifiy.js");
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
 * @param {Object} user
 * @param {String} username
 * @param {String} email
 * @param {Boolean} newsletter
 * @returns {Promise<Result>}
 */
const updateUser = async (user, username, email, newsletter, newAvatar) => {
  const thisUser = await User.findById(user._id);
  if (!thisUser) {
    return { message: "ID is invalid", status: 404 };
  }

  if (username) {
    thisUser.account.username = username;
  }
  if (email) {
    if (!emailVerify(email)) {
      return { message: "Mail is invalid", status: 417 };
    }
    thisUser.email = email;
  }
  if (newsletter || typeof newsletter === "boolean") {
    thisUser.newsletter = newsletter;
  }
  await thisUser.markModified("account");
  await thisUser.save();
  if (newAvatar.avatar) {
    let avatarInformations = {};
    avatarInformations = await cloudinary.uploader.upload(
      convertToBase64(newAvatar.avatar),
      {
        folder: `${process.env.CLOUDINARY_FOLDER}/users/${thisUser._id}`,
      }
    );
    if (thisUser.account.avatar) {
      await cloudinary.uploader.destroy(thisUser.account.avatar.public_id);
    }
    thisUser.account.avatar = avatarInformations;
  }

  await thisUser.markModified("account.avatar");
  await thisUser.save();
  return { data: thisUser, message: "Modifications saved", status: 202 };
};

module.exports = updateUser;

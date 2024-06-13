const User = require("../../models/User");
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
 * @param {Object} user
 * @returns {Promise<Result>}
 */
const deleteUser = async (user) => {
  const thisUser = await User.findById(user._id);
  if (!thisUser) {
    return { message: "Id is invalid", status: 404 };
  }
  if (thisUser.account.avatar) {
    await cloudinary.api.delete_resources(thisUser.account.avatar.public_id);
  }
  if (thisUser.account.avatar) {
    await cloudinary.api.delete_folder(thisUser.account.avatar.folder);
  }
  await User.findByIdAndDelete(user._id);

  return { data:null, message: "User deleted", status: 202 };
};

module.exports = deleteUser;

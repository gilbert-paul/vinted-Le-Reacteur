const User = require("../../models/User");
const cloudinary = require("cloudinary").v2;

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise}
 */
const deleteUser = async (req, res) => {
  const thisUser = await User.findById(req.user._id);
  if (!thisUser) {
    return res.status(404).json({ message: "Id is invalid" });
  }
  if (thisUser.account.avatar.public_id) {
    await cloudinary.api.delete_resources(thisUser.account.avatar.public_id);
  }
  if (thisUser.account.avatar.folder) {
    await cloudinary.api.delete_folder(thisUser.account.avatar.folder);
  }
  await User.findByIdAndDelete(req.user._id);
  return res.status(202).json({ message: "User deleted" });
};

module.exports = deleteUser;

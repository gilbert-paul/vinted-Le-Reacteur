const User = require("../../models/User.js");
const emailVerify = require("../emailVerifiy.js");
const convertToBase64 = require("../convertToBase64.js");
const cloudinary = require("cloudinary").v2;

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Promise}
 */
const updateUser = async (req, res) => {
  const thisUser = await User.findById(req.user);
  console.log(req.files)
  let newAvatar
 
  if (!thisUser) {
    return res.status(404).json({ message: "Id is invalid" });
  }
  const { username, email, newsletter } = req.body;
 


  if (username) {
    thisUser.account.username = username;
  }
  if (email) {
    if (!emailVerify(email)) {
      return res.status(417).json({ message: "Mail is invalid" });
    }
    thisUser.email = email;
  }
  if (newsletter || typeof newsletter === "boolean") {
    thisUser.newsletter = newsletter;
  }
  await thisUser.markModified("account");

  if (req.files) {
    const result = await cloudinary.uploader.upload(
      convertToBase64(req.files.avatar),
      {
        folder: `vinted/users/${thisUser._id}`,
      }
    );

    if (thisUser.account.avatar) {
      await cloudinary.uploader.destroy(thisUser.account.avatar.public_id);
    }
    thisUser.account.avatar = result;
  }
  await thisUser.markModified("account.avatar");
  await thisUser.save();
  return res.status(202).json({ message: "Modifications saved" });
};

module.exports = updateUser;

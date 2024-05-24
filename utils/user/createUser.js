const { SHA256 } = require("crypto-js");
const User = require("../../models/User.js");
const uid2 = require("uid2");
const encBase64 = require("crypto-js/enc-base64");
const cloudinary = require("cloudinary").v2;
const convertToBase64 = require("../convertToBase64.js");
const emailVerify = require("../emailVerifiy.js");

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
const createUser = async (req,res)=>{
  const { email, username, password, newsletter } = req.body;
    if (!username) {
      return res.status(417).json({ message: "Username is not defined" });
    }
    if (!email) {
      return res.status(417).json({ message: "Email is not defined" });
    }
    if (!password) {
      return res.status(417).json({ message: "Password is not defined" });
    }
    if (!newsletter) {
      return res
        .status(417)
        .json({ message: "Newsletter choice is not defined" });
    }
    if (!emailVerify(email)) {
      return res.status(417).json({ message: "Mail is invalid" });
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already used" });
    }
    let token = uid2(64);
    const tokenUserUsed = await User.findOne({ token: token });
    while (tokenUserUsed) {
      token = uid2(64);
    }
    const salt = uid2(64);
    const hash = SHA256(req.body.password + salt).toString(encBase64);
    const newUser = new User({
      email: email,
      account: {
        username: username,
      },
      newsletter: newsletter,
      token: token,
      hash: hash,
      salt: salt,
    });
    await newUser.save();
    const avatar = {}
    if (req.files) {
      avatar = await cloudinary.uploader.upload(
        convertToBase64(req.files.avatar),
        {
          folder: `vinted/users/${newUser._id}`,
        }
      );
    }
    newUser.account.avatar = avatar;
    await newUser.markModified("account");
    await newUser.save();
    const userInformations = {
      _id: newUser._id,
      token: newUser.token,
      account: { username: newUser.account.username, avatar: newUser.account.avatar.secure_url },
    };
    return res.status(201).json(userInformations);
  }
module.exports = createUser

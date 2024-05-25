const { SHA256 } = require("crypto-js");
const User = require("../../models/User.js");
const uid2 = require("uid2");
const encBase64 = require("crypto-js/enc-base64");
const cloudinary = require("cloudinary").v2;
const convertToBase64 = require("../convertToBase64.js");
const emailVerify = require("../emailVerifiy.js");
const { Model } = require("mongoose");
/**
 * @typedef Result
 * @property {String | Object} message
 * @property {Number} status
 */
/**
 * @typedef  {Model} User
 */
/**
 */
/**
 *
 * @param {String} email
 * @param {String} username
 * @param {String} password
 * @param {Boolean} newsletter
 * @param {Object} avatar
 * @returns {Promise<Result>}
 */
const createUser = async (email, username, password, newsletter, avatar = {}) => {
  try {
    if (!username) {
      return { message: "Username is not defined", status: 409 };
    }
    if (!email) {
      return { message: "Email is not defined", status: 409 };
    }
    if (!password) {
      return { message: "Password is not defined", status: 409 };
    }
    if (!newsletter) {
      return { message: "Newsletter choice is not defined", status:409 };
    }
    if (!emailVerify(email)) {
      return { message: "Mail is invalid", status: 409 };
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return { message: "Email already used", status: 417 };
    }
    let token = uid2(64);
    const tokenUserUsed = await User.findOne({ token: token });
    while (tokenUserUsed) {
      token = uid2(64);
    }
    const salt = uid2(64);
    const hash = SHA256(password + salt).toString(encBase64);
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
    if (avatar) {
      avatar = await cloudinary.uploader.upload(convertToBase64(avatar), {
        folder: `${process.env.CLOUDINARY_FOLDER}/users/${newUser._id}`,
      });
    }

    newUser.account.avatar = avatar;
    await newUser.markModified("account");
    await newUser.save();
    const userInformations = {
      _id: newUser._id,
      token: newUser.token,
      account: {
        username: newUser.account.username,
        avatar: newUser.account.avatar.secure_url,
      },
    };
    return { message: userInformations, status: 201 };
  } catch (error) {
    return { message: error.message, status: 404 };
  }
};
module.exports = createUser;

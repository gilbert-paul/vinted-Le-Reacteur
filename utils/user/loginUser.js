const SHA256 = require("crypto-js/sha256");
const User = require("../../models/User");
const encBase64 = require("crypto-js/enc-base64");

/**
 * @typedef Result
 * @property {String | Object} message
 * @property {String | Object} data
 * 
 * @property {Number} status
 */
/**
 *
 * @param {String} email
 * @param {String} password
 * @returns {Promise<Result>}
 */
const loginUser = async (email,password)=>{

if (!password) {
  return { message: "Password missing", status: 417 };
}
if (!email) {
  return { message: "Email missing", status: 417 };
}

const thisUser = await User.findOne({ email: email });
if (!thisUser) {
  return { message: "Invalid email or password", status: 417 };
}
const thisHash = SHA256(password + thisUser.salt).toString(encBase64);
if (thisHash !== thisUser.hash) {
  return { message: "Invalid email or password", status: 417 };
}
const userInformations = {
  _id: thisUser._id,
  token: thisUser.token,
  account: thisUser.account,
};
return { data:userInformations, message: "You are connected !", status: 202 };
}
module.exports = loginUser
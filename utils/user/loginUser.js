const { SHA256 } = require("crypto-js");
const User = require("../../models/User");
const emailVerify = require("../emailVerifiy");
const encBase64 = require("crypto-js/enc-base64");

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Promise}
 */
const loginUser = async (req,res)=>{
  const { email, password } = req.body;
if (!password) {
  return res.status(417).json({ message: "Password missing" });
}
if (!email) {
  return res.status(417).json({ message: "Email missing" });
}
if (!emailVerify(email)) {
  return res.status(417).json({ message: "Mail is invalid" });
}
const thisUser = await User.findOne({ email: email });
if (!thisUser) {
  return res.status(400).json({ message: "Invalid email or password" });
}
const thisHash = SHA256(password + thisUser.salt).toString(encBase64);
if (thisHash !== thisUser.hash) {
  return res.status(417).json({ message: "Invalid email or password" });
}
const userInformations = {
  _id: thisUser._id,
  token: thisUser.token,
  account: thisUser.account,
};
return res.status(202).json({message: "You are connected !"});
}
module.exports = loginUser
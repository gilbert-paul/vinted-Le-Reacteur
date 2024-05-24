const User = require("../models/User.js");
/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 * @returns {Promise}
 */
const isAuthentificated = async (req, res, next) => {
  try {
    if(!req.headers.authorization){
      return res.status(401).json({ message: "You need to be connected" });
    }
    const headersToken = req.headers.authorization.replace("Bearer ", "");
    const thisUser = await User.findOne({token:headersToken}).select("account")
    if (thisUser) {
    req.user = thisUser;
      return next();
    }
    return res.status(401).json({ message: "You need to be connected" });
  } catch (error) {
    return res.status(500).json({ message: "Error BDD" });
  }
};

module.exports = isAuthentificated;

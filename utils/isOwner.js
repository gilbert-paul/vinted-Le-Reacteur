const User = require("../models/User.js");
const Offer = require("../models/Offer.js");

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise}
 */
const isOwner = async (req, res, next) => {
  try {
    const thisOffer = await Offer.findById(req.params.id).populate("owner");
    if (!thisOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    const thisUserOffer = await User.findById(thisOffer.owner._id);
    if (thisUserOffer) {
      req.user = thisUserOffer;
      return next();
    }
    return res.status(401).json({ message: "You need to be owner" });
  } catch (error) {
    return res.status(500).json({ message: "Error BDD" });
  }
};

module.exports = isOwner;

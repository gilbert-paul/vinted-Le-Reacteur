const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const Offer = require("../../models/Offer");
const Transaction = require("../../models/Transaction");

/**
 * @typedef Result
 * @property {String | Object} message
 * @property {String | Object} paymentIntent
 *
 * @property {String | Object} data
 *
 * @property {Number} status
 */
/**
 *
 * @param {String} thisOfferID
 * @returns {Promise<Result>}
 */
const buyOffer = async (user, id) => {
  try {
    console.log(id)
    const thisOffer = await Offer.findById(id);
     if (thisOffer && !thisOffer.bought.isBought) {
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Number((thisOffer.product_price * 100).toFixed(0)),
        currency: "eur",
        description: thisOffer.product_title + " - " + thisOffer._id,
        });
        thisOffer.bought.isBought = true;
      thisOffer.bought.buyer = user;
      const newTransaction = await new Transaction({
            buyer:user,
            selller:thisOffer.owner,
            offer:thisOffer,
            date:"Date"
      })
      
      
      await thisOffer.save();
      await newTransaction.save()
      return {
        data: thisOffer,
        paymentIntent: paymentIntent,
        message: `Offer bought with success by ${user.account.username} !`,
        status: 202,
      };
     }
    
  } catch (error) {
    return {
      data: null,
      paymentIntent: error.message,
      message: "Offer not found or already bought",
      status: 202,
    };
  }
};

module.exports = buyOffer;

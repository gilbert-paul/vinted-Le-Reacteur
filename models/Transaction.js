const mongoose = require("mongoose");

const Transaction = mongoose.model("Transaction", {
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offer",
  },
  date:String
}
);

module.exports = Transaction;

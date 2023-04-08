const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  description: { type: String },
  destination: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  value: { type: Number, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Payment", paymentSchema);

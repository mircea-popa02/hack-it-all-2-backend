const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const payment = require("./payment");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
  payments: [{ type: mongoose.Types.ObjectId, required: true, ref: "Payment" }],
  group: { type: mongoose.Types.ObjectId, required: true, ref: "Group" },
  balance: { type: Number, required: true },
  accountlimit: { type: Number, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

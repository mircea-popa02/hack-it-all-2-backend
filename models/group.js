const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
});

// const Group = mongoose.model("Group", groupSchema);

groupSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Group", groupSchema);

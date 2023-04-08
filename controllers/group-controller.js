const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Place = require("../models/place");
const User = require("../models/user");
const Payment = require("../models/payment");
const Group = require("../models/group");

const getAllMembers = async (req, res, next) => {
  const groupId = req.params.gid;

  // let places;
  let groupWithMembers;
  try {
    groupWithMembers = await User.find({ group: groupId });
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later.",
      500
    );
    return next(error);
  }

  //   if (!groupWithMembers || groupWithMembers.members.length === 0) {
  //     return next(
  //       new HttpError("Could not find places for the provided user id.", 404)
  //     );
  //   }

  res.json({
    groupWithMembers: groupWithMembers.map((income) => income.toObject({ getters: true })),
  });
};

const createGroup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, members } = req.body;

  const createdGroup = new Group({
    name,
    members,
  });

  try {
    await createdGroup.save();
  } catch (err) {
    const error = new HttpError(
      "Create group failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ group: createdGroup.toObject({ getters: true }) });
};

exports.getAllMembers = getAllMembers;
exports.createGroup = createGroup;

const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Place = require("../models/place");
const User = require("../models/user");
const Payment = require("../models/payment");

const getPayments = async (req, res, next) => {
  let payments;
  try {
    payments = await Payment.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching payments failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    payments: payments.map((payment) => payment.toObject({ getters: true })),
  });
};

const createPayment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { description, destination, value, type, creator } = req.body;

  const createdPayment = new Payment({
    description,
    destination,
    value,
    type,
    creator,
    date: Date.now(),
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPayment.save({ session: sess });
    user.payments.push(createdPayment);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ payment: createdPayment });
};

const deletePayment = async (req, res, next) => {
  const paymentID = req.params.pid;

  let payment;
  try {
    payment = await Payment.findById(paymentID).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  if (!payment) {
    const error = new HttpError("Could not find place for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await payment.remove({ session: sess });
    payment.creator.payments.pull(payment);
    await payment.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted payment." });
};

const createPaymentSplit = async (req, res, next) => {
  const nrOfPeople = req.params.nrOfPeople;

  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return next(
  //     new HttpError("Invalid inputs passed, please check your data.", 422)
  //   );
  // }
  const { description, destination, value, type, creator } = req.body;

  const createdPayment = new Payment({
    description,
    destination,
    value,
    type,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPayment.save({ session: sess });
    user.payments.push(createdPayment);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }
};

exports.getPayments = getPayments;
exports.createPayment = createPayment;
exports.deletePayment = deletePayment;
exports.createPaymentSplit = createPaymentSplit;

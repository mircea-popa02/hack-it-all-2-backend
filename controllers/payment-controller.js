const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Place = require("../models/place");
const User = require("../models/user");
const Payment = require("../models/payment");


const redeeemableCodesMap = {
  "123456": 200,
  "ABCDEF": 100,
  "GHIJKL": 50,
  "MNOPQR": 20
}


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

/////////////////////////////////////////////////////////////

const getPaymentByUserID = async (req, res, next) => {
  const userId = req.params.uid;

  // let places;
  let expenses;
  let incomes;
  try {
    expenses = await Payment.find({
      creator: userId,
    });
    incomes = await Payment.find({
      destination: userId,
    });
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later.",
      500
    );
    return next(error);
  }

  // if (!places || places.length === 0) {
  // if (!userWithPlaces || userWithPlaces.places.length === 0) {
  //   return next(
  //     new HttpError("Could not find places for the provided user id.", 404)
  //   );
  // }

  res.json({
    incomes: incomes.map((income) => income.toObject({ getters: true })),
    expenses: expenses.map((expense) => expense.toObject({ getters: true })),
    // places: userWithPlaces.places.map((place) =>
    //   place.toObject({ getters: true })
    // ),
  });
};

/////////////////////////////////////////////////////////////

const createPayment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  let { description, destination, value, type, creator } = req.body;

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
    let p1 = await User.findById(destination);
    let p2 = await User.findById(creator);
    // convert to number
    p1.balance = +p1.balance + +value;
    p2.balance = +p2.balance - +value;

    // (+p1.balance) = (+p1.balance) + (+value);
    // (+p2.balance) = (+p2.balance) - (+value);
    await p1.save();
    await p2.save();
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
    // creator.balance = creator.balance - value;
    // destination.balance = destination.balance + value;
    user.payments.push(createdPayment);

    // await creator.save({ session: sess });
    // await destination.save({ session: sess });
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

/////////////////////////////////////////////////////////////
const createPaymentING = async (req, res, next) => {
  let { description, destination, value, type } = req.body;

  const createdPayment = new Payment({
    description,
    destination,
    value,
    type,
    creator: "6574961721985216835a62a0",
    date: Date.now(),
  });

  let user;
  try {
    let p1 = await User.findById(destination);
    let p2 = await User.findById("6574961721985216835a62a0");
    p1.balance = (+p1.balance) + (+value);
    await p1.save();
    await p2.save();
  } catch (err) {
    const error = new HttpError(
      "Creating payment failed, please try again.",
      500
    );
    return next(error);
  }

  if (!p1) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }


  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPayment.save({ session: sess });
    // creator.balance = creator.balance - value;
    // destination.balance = destination.balance + value;
    user.payments.push(createdPayment);

    // await creator.save({ session: sess });
    // await destination.save({ session: sess });
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

/////////////////////////////////////////////////////////////
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

  const { description, value, type, creator } = req.body;

  const createdPayment = new Payment({
    description,
    destination: "6431ed1a8deaff540c2022e6",
    value: value / nrOfPeople,
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

// check redeemaable codes
const isRedeemable = (code) => {
  return redeeemableCodesMap[code] !== undefined;
}

const redeeemCode = async (req, res, next) => {
  const { code, uid } = req.body;

  let user;
  try {
    if (isRedeemable(code)) {
      user = await User.findById(uid);
      user.coins = user.coins + redeeemableCodesMap[code];
      await user.save();
    } else {
      throw new Error("Code not found");
    }
  } catch (err) {
    const error = new HttpError(
      "Error while redeeming code.",
      500
    );
    return next(error);
  }
  return res.status(200).json({ message: "Code redeemed. You have received " + redeeemableCodesMap[code] + " coins." });
}

const buyItem = async (req, res, next) => {
  const { uid, price, name } = req.body;
  let user;
  try {
    user = await User.findById(uid);
    console.log(user);
    if (user.coins < price) {
      throw new Error("Not enough coins");
    }

    user.coins = user.coins - price;
    if (name === "Gold Membership 30 days") {
      user.accountType = "gold";
      user.premiumAccountStartDate = Date.now();
    }
    if (name === "Platinum Membership 30 days") {
      user.accountType = "platinum";
      user.premiumAccountStartDate = Date.now();
    }
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Error while buying item.",
      500
    );
    return next(error);
  }
  return res.status(200).json({ message: "Item " + name + " bought. You have " + user.coins + " coins left." });
}

exports.buyItem = buyItem;
exports.redeeemCode = redeeemCode;
exports.getPayments = getPayments;
exports.createPayment = createPayment;
exports.deletePayment = deletePayment;
exports.createPaymentSplit = createPaymentSplit;
exports.getPaymentByUserID = getPaymentByUserID;
exports.createPaymentING = createPaymentING;

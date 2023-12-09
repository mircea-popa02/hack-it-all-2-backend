const express = require("express");
const { check } = require("express-validator");

const paymentController = require("../controllers/payment-controller");

const router = express.Router();

router.get("/", paymentController.getPayments);

router.get("/ceva/:uid", paymentController.getPaymentByUserID);

router.post(
  "/",
  [check("value").not().isEmpty()],
  [check("type").not().isEmpty()],
  paymentController.createPayment
);

router.post(
  "/ing",
  [check("value").not().isEmpty()],
  paymentController.createPaymentING
);

router.post(
  "/split/:nrOfPeople",
  [check("value").not().isEmpty()],
  [check("type").not().isEmpty()],
  paymentController.createPaymentSplit
);

router.post(
  "/redeem",
  [check("value").not().isEmpty()],
  paymentController.redeeemCode
);

router.delete("/:pid", paymentController.deletePayment);

module.exports = router;

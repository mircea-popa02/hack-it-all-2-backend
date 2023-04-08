const express = require("express");
const { check } = require("express-validator");

const paymentController = require("../controllers/payment-controller");

const router = express.Router();

router.get("/", paymentController.getPayments);

router.post(
  "/",
  [check("value").not().isEmpty()],
  paymentController.createPayment
);

router.delete("/:pid", paymentController.deletePayment);

module.exports = router;

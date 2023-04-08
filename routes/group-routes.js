const express = require("express");
const { check } = require("express-validator");

const groupController = require("../controllers/group-controller");

const router = express.Router();

router.get("/:gid", groupController.getAllMembers);

router.post("/", [check("name").not().isEmpty()], groupController.createGroup);

// router.post(
//   "/split/:nrOfPeople",
//   [check("value").not().isEmpty()],
//   [check("type").not().isEmpty()],
//   paymentController.createPaymentSplit
// );

// router.delete("/:pid", paymentController.deletePayment);

module.exports = router;

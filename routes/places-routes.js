const express = require('express');
const { check } = require('express-validator');

const placesControllers = require('../controllers/places-controllers');

const router = express.Router();

router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.post(
  '/',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address')
      .not()
      .isEmpty()
  ],
  placesControllers.createPlace
);

// router.post(
//   '/pay',
//   [
//     check('amount')
//       .not()
//       .isEmpty(),
//     check('currency')
//       .not()
//       .isEmpty(),
//     check('source')
//       .not()
//       .isEmpty(),
//     check('description')
//       .not()
//       .isEmpty()
//   ],
//   placesControllers.payPlace
// )

router.patch(
  '/:pid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  placesControllers.updatePlace
);

router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;

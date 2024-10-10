const express = require("express");
const tourControllers = require("./../controllers/tourController");

// Creating new Router
const router = express.Router();

// Alias example
// router
//   .route("/top-5-cheap-tours")
//   .get(tourControllers.alias, tourControllers.getAllTours);

// Route for aggregation pipeline
router.route("/tour-stats").get(tourControllers.getTourStats);
router.route("/monthly-plan/:year").get(tourControllers.getMonthlyPlan);

router
  .route("/")
  .get(tourControllers.getAllTours)
  .post(tourControllers.createTour);
router
  .route("/:id")
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTour);

module.exports = router;

const express = require("express");
const tourControllers = require("./../controllers/tourController");

// Creating new Router
const router = express.Router();

// Middleware with params

router.param("id", tourControllers.checkID);

// Routes
// app.get("/", (req, res) => {
//   res
//     .status(200)
//     .json({ message: "Hello! I am the Server...", API_Name: "Natours" });
// });

// app.get("/api/v1/tours", getAllTours);
// Responding to URL parameters
// app.get("/api/v1/tours/:id", getTour);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

// Refactoring the above methods as below using chaining methods

// app.route("/api/v1/tours").get(getAllTours).post(createTour);
// app
//   .route("/api/v1/tours/:id")
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);

// app.route("/api/v1/users").get(getAllUsers).post(createUser);
// app
//   .route("/api/v1/users/:id")
//   .get(getUser)
//   .patch(updateUser)
//   .delete(deleteUser);

// Cleaning the code based on Mounting Router method and using middlewares

router
  .route("/")
  .get(tourControllers.getAllTours)
  .post(tourControllers.checkBody, tourControllers.createTour);
router
  .route("/:id")
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTour);

module.exports = router;

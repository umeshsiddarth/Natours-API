const fs = require("fs");
const express = require("express");
const app = express(); // Created to get the bunch of values we get to work with upon calling express.
const port = 3000;
// Adding Middleware
app.use(express.json());
// app.get("/", (req, res) => {
//   res
//     .status(200)
//     .json({ message: "Hello! I am the Server...", API_Name: "Natours" });
// });

// Reading Data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Route Handlers
const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours: tours,
      // endpoint : variable
    },
  });
};

const getTour = (req, res) => {
  const id = Number(req.params.id);
  // Condition to check whether the requested id is present on not using the id itself and respond back as failed request
  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: "fail",
  //     message: "Invalid ID",
  //   });
  // }
  const tour = tours.find((el) => el.id === id);

  // Consition to check whether there is a tour or not and respond back as failed request
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: tour,
    },
  });
};

const addNewTour = (req, res) => {
  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (Number(req.params.id) > tours.length) {
    res.status(404).json({
      status: "fail",
      message: "Inavli ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: "Updated Tour",
    },
  });
};

const deleteTour = (req, res) => {
  if (Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
};

// Routes
// app.get("/api/v1/tours", getAllTours);
// Responding to URL parameters
// app.get("/api/v1/tours/:id", getTour);
// app.post("/api/v1/tours", addNewTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

// Refactoring the above methods as below using chaining methods

app.route("/api/v1/tours").get(getAllTours).post(addNewTour);
app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

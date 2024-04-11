const fs = require("fs");

// Reading Data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// Route Handlers
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
      // endpoint : variable
    },
  });
};

exports.getTour = (req, res) => {
  const id = Number(req.params.id);
  // Condition to check whether the requested id is present on not using the id itself and respond back as failed request
  // if (id > tours.length-1) {
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

exports.createTour = (req, res) => {
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

exports.updateTour = (req, res) => {
  if (Number(req.params.id) > tours.length - 1) {
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

exports.deleteTour = (req, res) => {
  if (Number(req.params.id) > tours.length - 1) {
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

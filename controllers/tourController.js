const fs = require("fs");

// Reading Data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  if (Number(req.params.id) > tours.length - 1) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid Properties",
    });
  }
  next();
};
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
  // We use this condition in middleware thus commented here and for consistence the next if method is avoided. That just acts
  //  as a reference to possibilities
  // if (id > tours.length-1) {
  //   return res.status(404).json({
  //     status: "fail",
  //     message: "Invalid ID",
  //   });
  // }
  const tour = tours.find((el) => el.id === id);

  // Condition to check whether there is a tour or not and respond back as failed request
  // if (!tour) {
  //   return res.status(404).json({
  //     status: "fail",
  //     message: "Invalid ID",
  //   });
  // }

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
    `${__dirname}/../dev-data/data/tours-simple.json`,
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
  res.status(200).json({
    status: "success",
    data: {
      tour: "Updated Tour",
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};

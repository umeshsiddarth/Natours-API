const Tour = require("./../model/newModel");

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
    // results: tours.length,
    // data: {
    //   tours: tours,
    // endpoint : variable
    // },
  });
};

exports.getTour = (req, res) => {
  const id = Number(req.params.id);

  res.status(200).json({
    status: "success",
    // data: {
    //   tour: tour,
    // },
  });
};

exports.createTour = (req, res) => {
  res.status(201).json({
    status: "success",
    // data: {
    //   tour: newTour,
    // },
  });
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

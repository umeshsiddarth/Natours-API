const Tour = require("../model/tourModel");

// Route Handlers
exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY

    // 1) Filtering
    //Creating a shallow copy of the query object to manipulate using destructuring
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "fields", "limit"];

    excludeFields.forEach((el) => {
      delete queryObj[el];
    });

    // 2) Advanced Filtering
    // The URL: domain.com/api/v1/tours?duration[gte]=5&difficulty=easy
    // This is how a normal query looks like in mongo
    // {difficulty: 'easy', duration: { $gte: 5 }}
    // But when we get the query from req.query we get
    // {difficulty: 'easy', duration: { gte: 5 }}
    //  The $ sign is missing infront of gte

    // So we use simple JS with regex to replace the query with the $ sign in front
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => {
      return `$${match}`;
    });
    // console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));

    // 3) Sorting
    if (req.query.sort) {
      // The below line works because Tour.find() is going to return a query and the query object has methods such as sort
      const sortBy = req.query.sort.split(",").join(" ");
      query.sort(sortBy);
      // console.log(sortBy);
    } else {
      query.sort("-createdAt");
    }
    // find() is used for querying all data from a doc
    // const tours = await Tour.find();

    // 4) FIELD LIMITING (Projecting)
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query.select(fields);
    } else {
      query.select("-__v");
    }

    // 5) PAGINATION
    const page = req.query.page * 1 || 1; // *1 converts the string to Number
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Condition to send an error if the results are less than the requested number of tours
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error("This page does not exist");
    }

    // EXECUTE QUERY
    const tours = await query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours: tours,
        //   endpoint : variable
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // findById is equal to Tour.findOne({_id: req.params.id})
    res.status(200).json({
      status: "success",
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

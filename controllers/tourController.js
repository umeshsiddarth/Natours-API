const Tour = require("./../model/tourModel");
const APIFeatures = require("../utils/apiFeatures");

// Aliasing Example for the route top-5-cheap-tours
// exports.alias = (req, res, next) => {
//   req.query.limit = "5";
//   req.query.sort = "-ratingsAverage,price";
//   req.query.select = "name,price,summary,duration,difficulty";
// };

// Route Handlers
// exports.getAllTours = async (req, res) => {
//   try {
// BUILD QUERY

// 1) Filtering
//Creating a shallow copy of the query object to manipulate using destructuring
// const queryObj = { ...req.query };
// const excludeFields = ["page", "sort", "fields", "limit"];

// excludeFields.forEach((el) => {
//   delete queryObj[el];
// });

// 2) Advanced Filtering
// The URL: domain.com/api/v1/tours?duration[gte]=5&difficulty=easy
// This is how a normal query looks like in mongo
// {difficulty: 'easy', duration: { $gte: 5 }}
// But when we get the query from req.query we get
// {difficulty: 'easy', duration: { gte: 5 }}
//  The $ sign is missing infront of gte

// So we use simple JS with regex to replace the query with the $ sign in front
// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => {
//   return `$${match}`;
// });
// console.log(JSON.parse(queryStr));

// let query = Tour.find(JSON.parse(queryStr));

// 3) Sorting
// if (req.query.sort) {
// The below line works because Tour.find() is going to return a query and the query object has methods such as sort
//   const sortBy = req.query.sort.split(",").join(" ");
//   query.sort(sortBy);
//   console.log(sortBy);
// } else {
//   query.sort("-createdAt");
// }
// find() is used for querying all data from a doc
// const tours = await Tour.find();

// 4) FIELD LIMITING (Projecting)
// if (req.query.fields) {
//   const fields = req.query.fields.split(",").join(" ");
//   query.select(fields);
// } else {
//   query.select("-__v");
// }

// 5) PAGINATION
// const page = req.query.page * 1 || 1; // *1 converts the string to Number
// const limit = req.query.limit * 1 || 100;
// const skip = (page - 1) * limit;
// query = query.skip(skip).limit(limit);

// EXECUTE QUERY

// const tours = await query;

// SEND RESPONSE
// res.status(200).json({
//   status: "success",
//   requestedAt: req.requestTime,
//   results: tours.length,
//   data: {
//     tours: tours,
//   endpoint : variable
//   },
// });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       message: err,
//     });
//   }
// };

// The class that is required is in utils.
exports.getAllTours = async (req, res) => {
  try {
    // We are chaining all the methods in the features along with creating the instance of the class is due to modifying or building the query with multiple features and finally to call it.
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFileds()
      .paginate();
    const tours = await features.query;

    res.status(200).json({
      status: "success",
      data: {
        tours: tours,
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

// Aggregation Pipeline
exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        // Matching or filtering the values of a certain query
        $match: { ratingsAverage: { $gte: 4.4 } },
      },
      {
        $group: {
          // id null can be used when we don't want to group by anything
          // _id: null
          // To group by a certain property then
          // _id: "$difficulty",
          // We can manipulate the above line like this
          _id: { $toUpper: "$difficulty" },
          // For each of the document that is going through this pipeline we need to add 1 to the num, to do that we can use the below method to find the sum of tours
          numTours: { $sum: 1 },
          // $avg is a MongoDB operator and teh field name should be represented inside '' with a $
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 }, // For ascending and we need to use the names from the abopve pipeline and not from teh original data
      },
      // {
      // We can repeat the stages and ne = not equal
      //   $match: { _id: { $ne: "EASY" } },
      // },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

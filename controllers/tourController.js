const Tour = require("./../model/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");

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

// In order to get rid of try catch block we wrapped the async function in he catchAsync Function. This function will return an anonymous function which will be assigned to createTour. Becasue createTour should be called by express when required. It should not be calling the function itself, this is why we need the wrapper.

// My Understanding:
// To avoid try catch block and code repitition I am creating a function where I am passing a function as an argument. Whenever express calls a certain function like createTour this catchAsync function is called and this function will execute the functon passed as an argument. The executed fucntion will return a promise and incase it failes the catchAsync function will catch the error using the catch method available on all promises. This catch method will pass the error to the next function and in turn make it reach our global error handler.

// const catchAsync = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   };
// };
// Exported to Utils and Imported here. Leave it here for reference.

// BEFORE Wrapping
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

// AFTER Wrapping
exports.getAllTours = catchAsync(async (req, res) => {
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
});
exports.getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  // findById is equal to Tour.findOne({_id: req.params.id})
  res.status(200).json({
    status: "success",
    data: {
      tour: tour,
    },
  });
});

// Before catchAsync implementation
// exports.createTour = async (req, res) => {
//   try {
//     const newTour = await Tour.create(req.body);
//     res.status(201).json({
//       status: "success",
//       data: {
//         tour: newTour,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: err,
//     });
//   }
// };

// After catchAsync function
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(200).json({
    status: "Success",
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res) => {
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
});

exports.deleteTour = catchAsync(async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Aggregation Pipeline
exports.getTourStats = catchAsync(async (req, res) => {
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
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const monthlyData = await Tour.aggregate([
    {
      $unwind: "$startDates", // This will unwind each data in an array and spit out individual tours for each date in that array
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" }, // This will make an array of the tour names
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    { $project: { _id: 0 } }, // This is like true or false to show or hide a particular field
    { $sort: { numTourStarts: -1 } },
    // { $limit: 6 },
  ]);

  res.status(200).json({
    status: "success",
    data: { monthlyData },
  });
});

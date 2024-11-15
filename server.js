const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION. SHUTTING DOWN!");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");
// console.log(process.env);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then((con) => console.log("Connected"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log(process.env.NODE_ENV);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! SHUTTING DOWN...");
  console.log(err.name, err.message);
  server.close(() => {
    // This allows server to finish the pending reqests and allow the process to close or app to crash in real world scenerio
    process.exit(1);
  });
});

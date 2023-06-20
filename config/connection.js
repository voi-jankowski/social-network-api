const { connect, connection } = require("mongoose");

// After you create your Heroku application, visit https://dashboard.heroku.com/apps/ select the application name and add your Atlas connection string as a Config Var
// Node will look for this environment variable and if it exists, it will use it. Otherwise, it will assume that you are running this application locally and use your local database connection string instead.
const connectionString =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/socialNetwork";

connect(connectionString);

connection.on("connected", () => {
  console.log("Mongoose connected successfully");
});

connection.on("error", (err) => {
  console.log("Mongoose connection error: ", err);
  process.exit(1);
});

connection.once("open", () => {
  console.log("Mongoose connected successfully");
});

module.exports = connection;

const { connect, connection } = require("mongoose");

// After you create your Heroku application, visit https://dashboard.heroku.com/apps/ select the application name and add your Atlas connection string as a Config Var
// Node will look for this environment variable and if it exists, it will use it. Otherwise, it will assume that you are running this application locally and use your local database connection string instead.
const connectionString =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/socialNetwork";

// The connect() function takes two arguments: the connection string and an object containing some options for the connection. We'll set useFindAndModify to false because it's an older method that's no longer necessary with Mongoose 5.x, and we'll set useNewUrlParser to true because it allows us to use a newer string parser.
connect(connectionString, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// The connection object represents the active connection. We can use it to hook into various events throughout the connection lifecycle. We'll use it to log a message in the console when the connection is established.
connection.on("connected", () => {
  console.log("Mongoose connected successfully");
});

// If the connection throws an error, we'll log the error and then exit the Node process with process.exit(1) (an exit code of 0 means a success, and a code of 1 means an error).
connection.on("error", (err) => {
  console.log("Mongoose connection error: ", err);
  process.exit(1);
});

// Finally, we'll use the connection object's once() method to hook into the connection's events. The once() method is like the on() method, except that it only listens for the event once and then stops.
connection.once("open", () => {
  console.log("Mongoose connected successfully");
});

module.exports = connection;

require("dotenv").config();
const mongoose = require("mongoose");

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    const uri = process.env.MONGODB_URI;
    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // Remove deprecated options below
        // useFindAndModify: false,
        // useCreateIndex: true,
      })
      .then(() => {
        console.log("Successfully connected to MongoDB.");
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
      });
  }

  disconnect() {
    mongoose
      .disconnect()
      .then(() => {
        console.log("Successfully disconnected from MongoDB.");
      })
      .catch((err) => {
        console.error("Error disconnecting from MongoDB:", err);
      });
  }
}

module.exports = new Database();

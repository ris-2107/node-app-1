const routes = require("./routes");
const express = require("express");
const app = express();

const PORT = 8000;

// Database:
const Database = require("./configurations/Database");

app.listen(PORT, () => {
  console.log("Gateway started on PORT " + PORT);
});

app.use("/", routes);

const express = require("express");
const CacheHydration = require("./configurations/CacheHydration");
const routes = require("./routes");
const internalGatewayRoutes = require("./routes/InternalRoutes");
const Database = require("./configurations/Database");
const app = express();
const cors = require('cors');

app.use(cors());

const PORT = 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize CacheHydration instance
global.routesCache = new CacheHydration();

// Start the server
app.listen(PORT, () => {
  console.log("Gateway started on PORT " + PORT);
});

// Routes
app.use("/api/gateway/internal", internalGatewayRoutes);
app.use("/api", routes);

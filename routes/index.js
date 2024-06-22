const express = require("express");
const axios = require("axios");
const router = express.Router();

router.all("/:destinationAppRoot/*", (req, res) => {
  const { destinationAppRoot } = req.params;
  const routeDetails = global.routesCache.getRouteByPath(destinationAppRoot);
  if (routeDetails) {
    true;
  }
  const path = req.params[0]; // Get any additional path segments

  console.log(`Forwarding request for ${destinationAppRoot}${path}`);

  axios
    .get(`http://auth-service:8080/${destinationAppRoot}${path}`)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.error("Error forwarding request:", error);
      res.status(500).send("Error forwarding request");
    });
});

module.exports = router;

const express = require("express");
const axios = require("axios");
const router = express.Router();
const RouteUtils = require("../utils/RouteUtils");

router.all("/:destinationAppRoot/*", async (req, res) => {
  const destinationAppRoot = RouteUtils.trimBeforeLastSlash(
    req.params.destinationAppRoot
  );
  const routeDetails = await global.routesCache.getRouteByPath(
    RouteUtils.appendSlashAtStart(destinationAppRoot)
  );
  if (routeDetails) {
    const path = req.params[0];
    axios
      .get(`${routeDetails.baseUrl}/${path}`)
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        console.error("Error forwarding request:", error);
        res.status(500).send("Error forwarding request");
      });
  } else {
    console.error("Route not found for : ", destinationAppRoot);
  }
});

module.exports = router;

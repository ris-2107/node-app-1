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

    const headers = {};
    if (routeDetails.headers) {
      Object.assign(headers, routeDetails.headers);
    }
    try {
      const response = await axios({
        method: routeDetails.method,
        url: `${routeDetails.baseUrl}/${path}`,
        headers: headers,
        params: routeDetails.queryParams,
        data: routeDetails.bodyParams,
      });

      res.status(response.status).json(response.data);
    } catch (error) {
      console.error("Error forwarding request:", error);
      res.status(500).send("Error forwarding request");
    }
  } else {
    console.error("Route not found for App Root: ", destinationAppRoot);
    res.status(404).send(`Route not found for App Root ${destinationAppRoot}`);
  }
});

module.exports = router;

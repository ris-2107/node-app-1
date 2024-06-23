const express = require("express");
const router = express.Router();
const axiosInstance = require("../utils/interceptors/AxiosWithRetry");
const RouteUtils = require("../utils/RouteUtils");

const retryConfig = {
  maxAttempts: 3,
  delay: 1000,
  maxDelay: 5000,
};

router.all("/:destinationAppRoot/*", async (req, res) => {
  const destinationAppRoot = RouteUtils.trimBeforeLastSlash(
    req.params.destinationAppRoot
  );
  const routeDetails = await global.routesCache.getRouteByPath(
    RouteUtils.appendSlashAtStart(destinationAppRoot)
  );

  if (routeDetails) {
    const path = req.params[0];
    const headers = { ...routeDetails.headers }; // Use spread operator to clone headers

    try {
      // Make request using axiosInstance with retry logic
      const response = await axiosInstance({
        method: routeDetails.method,
        url: `${routeDetails.baseUrl}/${path}`,
        headers,
        params: routeDetails.queryParams,
        data: routeDetails.bodyParams,
        retry: { ...retryConfig }, // Optionally pass retry configuration per request
      });

      // Forward response from destination service
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error("Error forwarding request:", error);
      res.status(500).send("Error forwarding request");
    }
  } else {
    console.error("Route not found for App Root:", destinationAppRoot);
    res.status(404).send(`Route not found for App Root ${destinationAppRoot}`);
  }
});

module.exports = router;

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
    // console.log(req.body);
    try {
      const response = await axiosInstance({
        method: req.method,
        url: `${routeDetails.baseUrl}/${path}`,
        headers: {
          ...req.headers, // Clone request headers
        },
        params: req.query,
        data: JSON.stringify(req.body),
        retry: { ...retryConfig },
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        res.status(error.response.status).send(error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser
        // and an instance of http.ClientRequest in node.js
        console.error(
          "No response received from target server:",
          error.request
        );
        res.status(503).send("Service Unavailable");
      }
    }
  } else {
    console.error("Route not found for App Root:", destinationAppRoot);
    res.status(404).send(`Route not found for App Root ${destinationAppRoot}`);
  }
});

module.exports = router;

// Internal routes
// routes/internalRoutes.js

const express = require("express");
const router = express.Router();
const RouteDetail = require("../models/RouteDetails");

// GET /routes
// Fetch all route details
router.get("/routes", async (req, res) => {
  try {
    const allRoutes = await RouteDetail.find();
    res.status(200).json(allRoutes);
  } catch (err) {
    console.error("Error fetching route details:", err);
    res.status(500).json({ error: "Failed to fetch route details" });
  }
});

// POST /gateway/internal/api/routes
// Create a new route detail (internal API)
router.post("/routes", async (req, res) => {
  try {
    const {
      serviceName,
      baseUrl,
      path,
      method,
      headers,
      queryParams,
      bodyParams,
      description,
    } = req.body;

    const newRoute = new RouteDetail({
      serviceName,
      baseUrl,
      path,
      method,
      headers,
      queryParams,
      bodyParams,
      description,
    });

    const savedRoute = await newRoute.save();
    res.status(201).json(savedRoute);
  } catch (err) {
    console.error("Error creating route detail:", err);
    res.status(500).json({ error: "Failed to create route detail" });
  }
});

router.post("/routes/bulk", async (req, res) => {
  try {
    const routesData = req.body;
    //TODO: write validation:

    const createdRoutes = await RouteDetail.insertMany(routesData);

    res.status(201).json(createdRoutes);
  } catch (err) {
    console.error("Error creating route details:", err);
    res.status(500).json({ error: "Failed to create route details" });
  }
});

router.get("/cache", (req, res) => {
  try {
    const cacheContent = global.routesCache.get("allRoutesMap");
    res.status(200).json(cacheContent);
  } catch (err) {
    console.error("Error fetching cache content:", err);
    res.status(500).json({ error: "Failed to fetch cache content" });
  }
});

router.get("/cache/:path", async (req, res) => {
  const { path } = req.params;
  try {
    const routeDetail = await global.routesCache.getRouteByPath("/" + path);
    if (routeDetail) {
      res.status(200).json(routeDetail);
    } else {
      res
        .status(404)
        .json({ error: `Route detail for path '${path}' not found in cache` });
    }
  } catch (err) {
    console.error("Error fetching route detail from cache:", err);
    res.status(500).json({ error: "Failed to fetch route detail from cache" });
  }
});

// PUT /gateway/internal/api/routes/:id
// Update an existing route detail by ID (internal API)
router.put("/routes/:id", async (req, res) => {
  try {
    const {
      serviceName,
      baseUrl,
      path,
      method,
      headers,
      queryParams,
      bodyParams,
      description,
    } = req.body;

    const updatedRoute = await RouteDetail.findByIdAndUpdate(
      req.params.id,
      {
        serviceName,
        baseUrl,
        path,
        method,
        headers,
        queryParams,
        bodyParams,
        description,
      },
      { new: true }
    );

    if (!updatedRoute) {
      return res.status(404).json({ error: "Route detail not found" });
    }

    res.status(200).json(updatedRoute);
  } catch (err) {
    console.error("Error updating route detail:", err);
    res.status(500).json({ error: "Failed to update route detail" });
  }
});

module.exports = router;

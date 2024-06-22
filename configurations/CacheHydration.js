const NodeCache = require("node-cache");
const RouteDetail = require("../models/RouteDetails");
class CacheHydration {
  constructor() {
    this.cache = new NodeCache({
      stdTTL: 300,
      checkperiod: 120,
      useClones: false,
    });

    this.init();
  }

  async init() {
    try {
      console.log("Initializing cache hydration...");

      // Fetch only the most recent 1000 routes from MongoDB
      const allRoutes = await RouteDetail.find()
        .sort({ createdAt: -1 })
        .limit(1000)
        .exec();

      // Create a map where each key is the path and the value is the route object
      const routeMap = {};
      allRoutes.forEach((route) => {
        routeMap[route.path] = route.toObject(); // Convert Mongoose document to plain JavaScript object
      });
      global.routesCache.set("allRoutesMap", routeMap);
      console.log("Cache hydrated with initial data map.");
    } catch (err) {
      console.error("Error hydrating cache with initial data:", err);
    }
    setInterval(this.refresh.bind(this), 300 * 1000);
  }

  async refresh() {
    try {
      const allRoutes = await RouteDetail.find()
        .sort({ createdAt: -1 })
        .limit(1000)
        .exec();

      const routeMap = {};
      allRoutes.forEach((route) => {
        routeMap[route.path] = route.toObject();
      });
      global.routesCache.set("allRoutesMap", routeMap);
    } catch (err) {
      console.error("Error refreshing cache:", err);
    }
  }

  getCacheContent() {
    return this.cache.keys().reduce((content, key) => {
      content[key] = this.cache.get(key);
      return content;
    }, {});
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value) {
    return this.cache.set(key, value);
  }

  del(key) {
    return this.cache.del(key);
  }

  async getRouteByPath(path) {
    const routeMap = global.routesCache.get("allRoutesMap");
    if (routeMap && routeMap[path]) {
      return routeMap[path];
    } else {
      console.log("Cache miss, checking DB");
      const routeDetail = await RouteDetail.findOne({ path }).exec();
      if (routeDetail) {
        routeMap[path] = routeDetail.toObject();
        global.routesCache.set("allRoutesMap", routeMap);
        return routeMap[path];
      } else {
        console.error("Route not presnet for appRoot: ", path);
        return null;
      }
    }
  }
}

module.exports = CacheHydration;

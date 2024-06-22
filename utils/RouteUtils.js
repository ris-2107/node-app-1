// RouteUtils.js

class RouteUtils {
  static appendSlashAtStart(path) {
    if (typeof path !== "string") {
      throw new TypeError("Input must be a string");
    }

    if (path.startsWith("/")) {
      return path;
    } else {
      return "/" + path;
    }
  }

  static trimBeforeLastSlash(path) {
    if (typeof path !== "string") {
      throw new TypeError("Input must be a string");
    }

    const firstSlashIndex = path.indexOf("/");
    if (firstSlashIndex === -1) {
      return path;
    }
    return path.slice(0, firstSlashIndex);
  }
}

module.exports = RouteUtils;

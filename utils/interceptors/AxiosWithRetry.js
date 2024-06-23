const axios = require("axios");

class AxiosWithRetry {
  constructor(defaultRetryConfig = {}) {
    this.instance = axios.create();
    this.retryAttempts = new Map();
    this.defaultRetryConfig = {
      maxAttempts: defaultRetryConfig.maxAttempts || 3,
      delay: defaultRetryConfig.delay || 1000,
      maxDelay: defaultRetryConfig.maxDelay || 5000,
    };

    // Add request interceptor
    this.instance.interceptors.request.use(
      this.handleRequest.bind(this),
      this.handleRequestError.bind(this)
    );

    this.instance.interceptors.response.use(
      this.handleResponse.bind(this),
      this.handleResponseError.bind(this)
    );

    // Initialize a queue to handle concurrent retries
    this.retryQueue = Promise.resolve();
  }

  async handleRequest(config) {
    // Log the request interception
    console.log(
      `[${new Date().toISOString()}] Request intercepted: ${config.method.toUpperCase()} ${
        config.url
      }`
    );

    config.metadata = { startTime: new Date() };
    // Log the request details
    // this.logRequest(config);
    return config;
  }

  handleRequestError(error) {
    // Log request error
    this.logError("Request Failed: " + error);
    return Promise.reject(error);
  }

  async handleResponse(response) {
    // Log the response
    this.logResponse(response);
    return response;
  }

  async handleResponseError(error) {
    const config = error.config;
    if (!config || !config.retry) {
      return Promise.reject(error);
    }

    // Retry logic for timeout
    if (error.code === "ECONNABORTED" || error.message === "timeout") {
      const retryConfig = {
        ...this.defaultRetryConfig,
        ...config.retry,
      };

      const retryAttempt = this.retryAttempts.get(config.url) || 0;

      if (retryAttempt >= retryConfig.maxAttempts) {
        this.logError(`Retry limit exceeded for request to ${config.url}`);
        return Promise.reject(error);
      }

      const delay = retryConfig.delay;
      const maxDelay = retryConfig.maxDelay;
      const calculatedDelay = Math.min(
        delay * Math.pow(2, retryAttempt),
        maxDelay
      );

      // Log retry attempt
      this.logError(
        `Retry attempt ${retryAttempt + 1} for request to ${
          config.url
        }, Delay: ${calculatedDelay} ms`
      );
      this.retryAttempts.set(config.url, retryAttempt + 1);

      await this.addToRetryQueue(config, calculatedDelay);
      return this.instance(config);
    }

    // For other errors, just reject the promise
    return Promise.reject(error);
  }

  async addToRetryQueue(config, delay) {
    const retryRequest = async () => {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return this.instance(config);
    };

    this.retryQueue = this.retryQueue.then(retryRequest).catch((error) => {
      this.logError(
        `Retry failed for request to ${config.url}: ${error.message}`
      );
      return Promise.reject(error);
    });

    return this.retryQueue;
  }

  logRequest(request) {
    console.log(
      `[${new Date().toISOString()}] Request: ${request.method.toUpperCase()} ${
        request.url
      }`
    );
  }

  logResponse(response) {
    console.log(
      `[${new Date().toISOString()}] Response: ${response.status} ${
        response.config.url
      }`
    );
  }

  logError(message) {
    console.error(`[${new Date().toISOString()}] Error: ${message}`);
  }

  getInstance() {
    return this.instance;
  }
}

module.exports = new AxiosWithRetry({
  maxAttempts: 3,
  delay: 1000,
  maxDelay: 5000,
}).getInstance();

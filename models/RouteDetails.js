// models/RouteDetail.js
const mongoose = require('mongoose');

const routeDetailSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
    unique: true
  },
  baseUrl: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    required: true
  },
  headers: {
    type: Map,
    of: String,
    default: {}
  },
  queryParams: {
    type: Map,
    of: String,
    default: {}
  },
  bodyParams: {
    type: Map,
    of: String,
    default: {}
  },
  description: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('RouteDetail', routeDetailSchema);

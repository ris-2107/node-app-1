const express = require("express");
const router = express.Router();
const axios = require("axios");

router.all("/:apiName", (req, res) => {
  console.log(req.params.apiName + "\n");
  axios
    .get("http://auth-service:8080/" + req.params.apiName)
    .then((response) => {
      res.send(response.data);
    });
});

module.exports = router;

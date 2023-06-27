const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("html/login.html");
});

module.exports = router;

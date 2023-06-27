const PORT = 3000;

const express = require("express");
const app = express();
const path = require("path");
const initRouter = require("./routes/app");

//app.use("/", initRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/html/login.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

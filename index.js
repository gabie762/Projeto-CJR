const PORT = 3000;

const express = require("express");
const app = express();
const path = require("path");
const initRouter = require("./routes/app");

//app.use("/", initRouter);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/html/login.html"));
});

app.get("/recuperar", (req, res) => {
  res.sendFile(path.join(__dirname + "/html/recuperacao.html"));
});

app.get("/criar-conta", (req, res) => {
  res.sendFile(path.join(__dirname + "/html/SignUp.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

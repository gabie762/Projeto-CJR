//OBS: O QUE ESTÁ COMENTADO ESTÁ A ESPERA DO BANCO DE DADOS PARA SE INTEGRAR AO SISTEMA
const PORT = 3000;

const express = require("express");
const session = require("express-session");

const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const initRouter = require("./routes/app");

//app.use("/", initRouter);
app.use(session({ secret: "lafduiuliucsacsoajf" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

//Login
app.get("/", (req, res) => {
  /*
  if (req.session.login){
    res.sendFile(path.join(__dirname + "/html/pagina-inicial.html"));
  }else{
    res.sendFile(path.join(__dirname + "/html/login.html"));
  }
  */
  res.sendFile(path.join(__dirname + "/html/pagina-inicial.html"));
});

app.post("/", (req, res) => {
  /*
  if (req.session.login == login && req.session.password == password){
    req.session.login = login
    res.sendFile(path.join(__dirname + "/html/pagina-inicial.html"));
  }else{
    res.sendFile(path.join(__dirname + "/html/login.html"));
  }
  */
});

//Recuperar Senha
app.get("/recuperar", (req, res) => {
  res.sendFile(path.join(__dirname + "/html/recuperacao.html"));
});

//Criar Conta
app.get("/criar-conta", (req, res) => {
  res.sendFile(path.join(__dirname + "/html/SignUp.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//OBS: O QUE ESTÁ COMENTADO ESTÁ A ESPERA DO BANCO DE DADOS PARA SE INTEGRAR AO SISTEMA
const PORT = 3000;

const express = require("express");
const session = require("express-session");

const bodyParser = require("body-parser");
const app = express();

//const initRouter = require("./routes/app");

//app.use("/", initRouter);
app.use(express.static(__dirname + '/public'))
//app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

//Login
app.get("/", (req, res) => {
  res.render("login");
});

app.post("/", (req, res) => {
  try{
    const {user, senha}= req.body;
    const resultado = {user, senha};
    console.log(req.body);
    res.send(`${JSON.stringify(resultado)} salvo com sucesso`)
  } catch(err){
    res.status(500).send(`Fatal: error`)
  }

});

//Recuperar Senha
app.get("/recuperar", (req, res) => {
  res.render("recuperacao");
});


app.post("/recuperar", (req, res)=>{
  try{
    const {nova_senha, confirma_senha}= req.body;
    const resultado = {nova_senha, confirma_senha};
    console.log(req.body)
    res.send(`${JSON.stringify(resultado)} enviado com sucesso`)
  } catch (err){
    res.status(500).send(`Fatal: error`)
  }
})

//Criar Conta
app.get("/criar-conta", (req, res) => {
  res.render("SignUp");
});

app.post("/criar-conta", async (req, res)=>{
  try {
    const {nome, genero, cargo, email, password} = req.body;
    const resultado =  {nome, genero, cargo, email, password};
    console.log(req.body);

    res.send(`${JSON.stringify(resultado)} salvo com sucesso`)
  } catch (err){
    console.log(err);
    res.status(500).send("Fatal: error")
  }
})

//Perfil Logado
app.get("/perfil", (req, res)=>{
  res.render("perfil")
})


//Feed com post aberto
app.get("/feed", (req,res)=>{
  res.render("feed")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

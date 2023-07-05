const PORT = 3000;

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
//const initRouter = require("./routes/app");

//app.use("/", initRouter);
app.use(express.static(__dirname + '/public'))
app.use(express.static("public"));
//app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: "Bravo-52-FLUMINENSE",
  resave: false,
  saveUninitialized: false
}))

//Login
app.get("/", (req, res) => {
  let logIn = false;
  res.render("login",{logIn:logIn});
});

app.post("/", async (req, res) => {
  try{
    const {login, senha}= req.body;
    console.log(req.body);

    const user = await prisma.user.findFirst({
      where: {OR:[{username: login},{email:login}]}
    })

    if (!login){
      return res.status(401).json({error:"User not found"})
    }

   if (user.senha!= senha){
    return res.status(401).json({ error: 'Invalid password' });
   } 
    res.send(`${JSON.stringify(user)} logado com sucesso`)
  } catch(err){
    console.log(err)
    console.log(req.body)
    res.status(500).send(`Fatal: error`)
  }

});

//Recuperar Senha
app.get("/recuperar", (req, res) => {
  let logIn = false;
  res.render("recuperacao",{logIn:logIn});
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
  let logIn = false;
  res.render("SignUp",{logIn:logIn});
});

app.post("/criar-conta", async (req, res) => {
  try {
    const { nome, genero, cargo, email, password } = req.body;
    const resultado = { nome, genero, cargo, email, password };
    console.log(req.body);

    const newUser = await prisma.user.create({
      data: {
        username:nome,
        senha:password,
        gender:genero,
        email:email,
        cargo:cargo,
        admin: false,
      },
    });
    console.log(newUser); // Fix: Log newUser instead of user
    res.status(201).send(`${JSON.stringify(newUser)} salvo com sucesso`);
  } catch (err) {
    console.log(err);
    res.status(500).send("Fatal: error");
  }
});


//Perfil Logado
app.get("/perfil", (req, res)=>{
  let logIn = false;
  res.render("perfil",{logIn:logIn})
})


//Feed com post aberto
app.get("/feed", (req,res)=>{
  let logIn = true;
  res.render("feed", {logIn:logIn})
  
  await 
})

app.put("/feed", (req,res)=>{
  const {log_out} = req.body;
  res.render("login", {logIn:log_out})
})


app.on('close', async () =>{
  await prisma.$disconnect();
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

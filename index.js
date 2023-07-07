const PORT = 3000;

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const fs =  require("fs")
const sharp = require("sharp")
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const multer = require("multer")
const upload = multer({dest:'./public/imagens'})

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
  saveUninitialized: false,
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

    req.session.authenticated = true;
    const isAuthenticated = req.session.authenticated 
    req.session.user = user.username
    req.session.img = user.userImg
    console.log(req.session)
    res.redirect("/feed",201,{logIn:req.session.authenticated, username: user.username})
    //res.render("feed", {logIn:req.session.authenticated, username: user.username})

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

app.post("/criar-conta", upload.single('userImg'),async (req, res) => {
  try {
    const {file, body} = req;
    console.log(file)
    const {nome, genero, cargo, email, password } = body;
    const resultado = { nome, genero, cargo, email, password };
  

    const auxImg = fs.readFileSync(file.path)
    const userImg = await sharp(auxImg).resize({width:200}).jpeg().toBuffer()
    if (file==undefined || !file){
      userImg=null
    }

    const newUser = await prisma.user.create({
      data: {
        userImg: userImg,
        username:nome,
        senha:password,
        gender:genero,
        email:email,
        cargo:cargo,
        admin: false,
      },
    });
    

    if (file != undefined){
      fs.unlinkSync(file.path);
    }
    console.log(newUser); // Fix: Log newUser instead of user
    res.status(201).send(`${JSON.stringify(newUser)} salvo com sucesso`);
  } catch (err) {
    console.log(err);
    res.status(500).send("Fatal: error");
  }
});


//Perfil Logado
app.get("/perfil", (req, res)=>{
  try{
    let logIn = req.session.authenticated
    let username = req.session.user
    res.render("userProfile",{logIn:logIn, username: username, img: req.session.img})
  } catch(err){
    let logIn = false
    res.render("userProfile",{logIn:logIn})
  }
})


//Feed com post aberto
app.get("/feed", async (req,res)=>{
  const posts = await prisma.post.findMany({
    include: {user: true}
  })
  try{
    const isAuthenticated = req.session.authenticated || false
    console.log(req.session.authenticated)
    let username = req.session.user
    let userImg = req.session.img
    
    console.log(posts)
    res.render("feed", {logIn:isAuthenticated, username: username, img: userImg, posts:posts})
  } catch(err){
    res.render("/feed", {logIn:false, username: null, img:null, posts:posts})
  }
  

})

app.post("/feed", async (req, res)=> {
  req.session.destroy((error) => {
    if (error) {
      console.error("Error occurred during session destruction:", error);
      res.status(500).redirect("Internal Server Error");
    } else {
      res.redirect(301, "/feed")
    }

})
})


//Comentarios
app.get("/comentarios", (req,res)=>{
  const isAuthenticated = req.session.authenticated || false
  console.log(req.session.authenticated)
  let username = req.session.user
  let userImg = req.session.img
  console.log(req.session.user)
  res.render("comentarios", {logIn:isAuthenticated, username: username, img: userImg})
})


//Criar Post
app.get("/criar-post", (req, res)=>{
  try{
    let logIn = req.session.authenticated;
    let username = req.session.user
    res.render("post", {logIn:logIn, username:username, img: req.session.img})
  } catch(err){
    res.render("post", {logIn:false, username:username})
  }
})

app.post("/criar-post", async (req, res)=>{
  try {

    let {conteudo} = req.body;
    let author = await prisma.user.findUnique({
      where: {username: req.session.user}
    })
    const newPost = await prisma.post.create({
      data:{
        user_id: author.id,
        content:conteudo
      }
    })
    console.log(newPost)
    res.status(201).send(`${JSON.stringify(newPost)} salvo com sucesso`)
  } catch (err){
    console.log(err)
    res.status(500).send("Fatal: error");
  }
})

app.on('close', async () =>{
  await prisma.$disconnect();
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

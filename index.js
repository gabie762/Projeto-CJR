const PORT = 3000;

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const fs =  require("fs") 

const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const multer = require("multer");
const { parse } = require("path");
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

    if (user == undefined){
      return res.status(401).json({error:"User not found"})
    }

   if (user.senha!= senha){
      return res.status(401).json({ error: 'Invalid password' });
   } 

    req.session.authenticated = true;
    const isAuthenticated = req.session.authenticated 
    req.session.user = user.username
    req.session.img = user.userImg
    //console.log(req.session)
    res.redirect("/feed",201,{logIn:req.session.authenticated, username: user.username})
    //res.render("feed", {logIn:req.session.authenticated, username: user.username})

  } catch(err){
    console.log(err)
    //console.log(req.body)
    res.status(500).send(`error: ${err}`)
  }

});

//Recuperar Senha
app.get("/recuperar", (req, res) => {
  let logIn = false;
  res.render("recuperacao",{logIn:logIn});
});


app.post("/recuperar", async (req, res)=>{
    
    const {login, nova_senha, confirma_senha}= req.body;
    const resultado = {login, nova_senha, confirma_senha};
    
    const user = await prisma.user.findFirst({
      where: {OR:[{username: login},{email:login}]}
    })

    if (user == undefined){
      return res.send(`Error: ${login} not found`)
    }
    if (nova_senha != confirma_senha){
      return res.send(`As senhas se diferem\nPor favor, certifique-se de que as senhas são iguais.`)
    }

    const newPssword = await prisma.user.update({
      where: {id: user.id},
      data: {
        senha: nova_senha,
      },
    });
    res.redirect("/")
  
})

//Criar Conta
app.get("/criar-conta", (req, res) => {
  let logIn = false;
  res.render("SignUp",{logIn:logIn});
});

app.post("/criar-conta", upload.single('userImg'),async (req, res) => {
  try {
    const {file, body} = req;
   
    //console.log(body);
    //console.log(file);
    const {nome, genero, cargo, email, password } = body;
    const resultado = { nome, genero, cargo, email, password };
  
    
    const userImg = fs.readFileSync(file.path, {encoding: 'base64'})

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
    //console.log(newUser); 
    res.redirect("/")
    //res.status(201).send(`${JSON.stringify(newUser)} salvo com sucesso`);
  } catch (err) {

    
    const {file, body} = req;
    
    // console.log(body);
    // console.log(file);
    const {nome, genero, cargo, email, password } = body;
    
    const userImg=fs.readFileSync("./public/imagens/foto-perfil.png", {encoding: 'base64'})
    

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
    // console.log(newUser); 
    res.redirect("/")

  }
});


//Perfil Logado
app.get("/perfil/:id", async (req, res)=>{
  let userId = req.path.split("/")[2];
  
  const perfil = await prisma.user.findUnique({
    where: {id: userId},
    include: {posts:true, comments:true}
  })
  
  // console.log(user)
  try{
    let logIn = req.session.authenticated
    let username = req.session.user
    let author = await prisma.user.findUnique({
      where: {username: req.session.user}
    })
    res.render("userProfile",{logIn:logIn, username: username, img: req.session.img, user:author, admin: author.admin, perfil: perfil})
  } catch(err){
    let logIn = false
    res.render("userProfile",{logIn:logIn, username: null, img: null, user:null, admin: false, perfil: perfil})
  }
})


//Feed com post aberto
app.get("/feed", async (req,res)=>{
  const posts = await prisma.post.findMany({
    include: {user: true, likes:true}
  })
  //console.log(posts)
  try{
    const isAuthenticated = req.session.authenticated || false
    // console.log(req.session.authenticated)
    let username = req.session.user
    let author = await prisma.user.findUnique({
      where: {username: req.session.user}
    })

    let userImg = author.userImg
    res.render("feed", {logIn:isAuthenticated, user: author, img:userImg, posts:posts })
  } catch(err){
    res.render("feed", {logIn:false, user: null, img:null, posts:posts})
  }

})


app.post("/feed", upload.single('post_img'), async (req, res)=>{
  try {
    let {file} = req.file;
    let {post_img, conteudo} = req.body;
    
    let author = await prisma.user.findUnique({
      where: {username: req.session.user}
    })
    
    const postImg = fs.readFileSync(req.file.path, {encoding: 'base64'})
    
    const newPost = await prisma.post.create({
      data:{
        user_id: author.id, postImg: postImg, content: conteudo
      }
    })
    
    if (file != undefined){
      fs.unlinkSync(req.file.path);
    }  

    res.redirect("/feed")
    //res.status(201).send(`${JSON.stringify(newPost)} salvo com sucesso`)
  } catch (err){
      let {conteudo} = req.body;
      // console.log(req.body)
      let author = await prisma.user.findUnique({
        where: {username: req.session.user}
      })
      const newPost = await prisma.post.create({
        data:{
          user_id: author.id,
          content:conteudo
        }
      })

      res.redirect("/feed")
  }
})

//logout


app.post("/logout", async (req, res)=> {
  req.session.destroy((error) => {
    if (error) {
      res.status(500).redirect("Internal Server Error");
    } else {
      res.redirect("/feed")
    }

})
})


//Comentarios
app.get("/comentarios/:id", async (req,res)=>{
  try{
    let postId = parseInt(req.path.split("/")[2]);
    const post = await prisma.post.findUnique({
      where: {id: postId},
      include: {user:true, comments:{include: {user: true}}}
    })

    let user = await prisma.user.findUnique({
      where: {username: req.session.user}
    })
    // console.log(post)
    
    const isAuthenticated = req.session.authenticated || false
    // console.log(req.session.authenticated)


    
    let username = req.session.user
    let userImg = req.session.img
    
    res.render("comentarios", {logIn:isAuthenticated, user: user, img: userImg, post:post})
  }catch(err){
    let postId = parseInt(req.path.split("/")[2]);
    const post = await prisma.post.findUnique({
      where: {id: postId},
      include: {user:true, comments:{include: {user: true}}}
    })
    
    res.render("comentarios", {logIn:false, user: null, img: null, post:post})
  }
})



app.post("/comentarios/:id", async (req, res)=>{
  try {
    let {conteudo} = req.body;
    let author = await prisma.user.findUnique({
      where: {username: req.session.user}
    })

    let postId = parseInt(req.path.split("/")[2]);
    const post = await prisma.post.findUnique({
      where: {id: postId},
      include: {user:true, comments:true}
    })

    const newComment = await prisma.comments.create({
      data : {post_id: post.id, user_id:author.id, content: conteudo},
      include:{user:true, post:true}
    })
    // console.log(newComment)
    res.redirect("/feed" )
    //res.status(201).send(`${JSON.stringify(newPost)} salvo com sucesso`)
  } catch (err){
    console.log(err)
    res.status(500).send("Fatal: error");
  }
})



//Deletar Post
app.post("/deletar-post", async (req, res)=>{
  const {post_id} = req.body;
  // console.log(post_id)

  try{
    const deleteComments = await prisma.comments.deleteMany({
      where:{
        post_id: parseInt(post_id)
      }
    })
    const deletePost = await prisma.post.delete({
      where:{
        id: parseInt(post_id)
      }
    })
  } catch(err){
    const deletePost = await prisma.post.delete({
      where:{
        id: parseInt(post_id)
      }
    })
  }
  res.redirect("/feed")
})
 

//Deletar Comentario
app.post("/deletar-comment", async (req, res)=>{
  const {comment_id} = req.body;
  // console.log(comment_id)

  try{
    const deleteComments = await prisma.comments.delete({
      where:{
        id: parseInt(comment_id)
      }
    })
  } catch(err){
    console.log("comment not found")
  }
  res.redirect("/feed")
})
 

app.post("/deletar-user", async (req, res)=>{
  const {deletar_user} = req.body;
  const perfil =  await prisma.user.findUnique({
    where: {id: deletar_user},
    include:{comments:true, posts:true},
  })
  console.log(perfil)
  try {
    const deleteComments = await prisma.comments.deleteMany({
      where:{user_id: perfil.id}
    })
  } catch(err){
    console.log("Comments not found")
  }

  try {
    const deletePost = await prisma.post.deleteMany({
      where:{user_id: perfil.id}
    })
  } catch(err){
    console.log("Posts not found")
    console.log(err)
  }

  try{
    const deleteUser = await prisma.user.delete({
      where: {id: perfil.id}
    })
  } catch(err){
    console.log("User not found")
    console.log(err)
  }
  res.redirect("/feed")
})



//Editar Post
app.post("/editar-post", async (req, res)=>{
    const {edit_post_id, new_conteudo} = req.body;

    const updatePost = await prisma.post.update({
      where: {
        id: parseInt(edit_post_id),
      },
      data: {
        content: new_conteudo,
      },
    })

    res.redirect("/feed")
})

//Editar Perfil
app.get("/editar-perfil/", async (req, res)=>{
  try{
    login = req.session.authenticated;
    const perfil =  await prisma.user.findUnique({
      where: {username: req.session.user},
    })
    res.render("editProfile", {logIn: login, user: perfil, img: perfil.userImg})
  } catch(err){
    res.redirect("/")
  }
})

app.post("/editar-perfil",  upload.single('userImg'), async (req, res)=>{
  try {
    const {file, body} = req;
   
    // console.log(body);

    // console.log(JSON.stringify(file));
    const perfil = await prisma.user.findUnique({
      where: {username: req.session.user},
    });
    
    const {nome, genero, cargo, email, password } = body;
    const resultado = { nome, genero, cargo, email, password };
    
    
    const userImg = fs.readFileSync(file.path, {encoding: 'base64'})
    if (cargo==""){
      cargo = perfil.cargo;
    }

    const newUser = await prisma.user.update({
      where: {id: perfil.id},
      data: {
        userImg: userImg,
        username:nome,
        senha:password,
        gender:genero,
        email:email,
        cargo:cargo,
        admin: perfil.admin,
      },
    });
    
    if (file != undefined){
      fs.unlinkSync(file.path);
    }
    // console.log(newUser); 
   
    //res.status(201).send(`${JSON.stringify(newUser)} salvo com sucesso`);
  } catch (err) {

    
    const {file, body} = req;
    // console.log(body);
    
    const perfil = await prisma.user.findUnique({
      where: {username: req.session.user},
    });
    
    const {nome, userImg,genero, cargo, email, password } = body;
   

    const newUser = await prisma.user.update({
      where: {id: perfil.id},
      data: {
        userImg: userImg,
        username:nome,
        senha:password,
        gender:genero,
        email:email,
        cargo:cargo,
        admin: perfil.admin,
      },
    });
    

    if (file != undefined){
      fs.unlinkSync(file.path);
    }
    // console.log(newUser); 
  }
  res.redirect("/feed")
})


app.post("/like", async (req, res)=>{
  const {post_liked} = req.body;
  const user = await prisma.user.findUnique({
    where: {username: req.session.user},
  });
  const post = await prisma.post.findUnique({
    where: {id: parseInt(post_liked)},
    include:{likes: true}
    
  })
    
    const dislike = await prisma.likes.findMany({
      where: {user_id:user.id, post_id: post.id}
    })
    //console.log(dislike.length)
    if (dislike.length> 0){
    const liked = await prisma.likes.deleteMany({
      where:{user_id: user.id, post_id: post.id}
    })
    
    const dislikePost = await prisma.post.update({
      where: {id: post.id},
      data: {
        total_likes: post.total_likes-1
      },
    });
  }else{
    const liked = await prisma.likes.create({
      data:{user_id: user.id, post_id: post.id}
    })
    const likedPost = await prisma.post.update({
      where: {id: post.id},
      data: {
        total_likes: post.total_likes+1
      },
    });
  }
  res.redirect("/feed")
})


app.on('close', async () =>{
  await prisma.$disconnect();
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


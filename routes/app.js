const express = require("express");
const router = express.Router();

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
module.exports = router;

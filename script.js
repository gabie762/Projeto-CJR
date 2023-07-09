let textButtons = document.querySelectorAll(".txt-option");
// let advancedButtons = document.querySelectorAll(".adv-option-format");
let writingBox = document.getElementById("txt-input");
let linkButton = document.getElementById("createLink");
let imgButtton = document.getElementById("img");
let formatButtons = document.querySelectorAll(".format");

const initializer = () =>{
    //call de botoes clicados para destacar
    highlighter(textButtons, true);
    highlighter(advancedButtons, true);
}

textButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modifyText(button.id, false, null);
    });
});

const modifyText = (comando, defaultUi, valor) => {
        document.execCommand(comando, defaultUi, valor);
};

optionsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modifyText(button.id, false, null);
    });
});

//Destaca botões clicados
const highlighter = (className, Remover) => {
    className.forEach((button) => {
      button.addEventListener("click", () => {
        //Remover = true, apenas um botão está destacado
        if (Remover) {
          let ativo = false;

          if (button.classList.contains("active")) {
            ativo = true;
          }
          
          //remove destaque dos outros botoes
          highlighterRemover(className);
          if (!ativo) {
            //destaque botao clicado
            button.classList.add("active");
          }
        } 
        else {
          //outros botoes podem ser clicados
          button.classList.toggle("active");
        }
      });
    });
};

const highlighterRemover = (className) => {
    className.forEach((button) => {
      button.classList.remove("active");
    });
};

window.onload = initializer();
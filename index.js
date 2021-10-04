const express = require("express");
const app = express();
const bodyParser = require("body-parser");//importar o bodyParser
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

//Database
connection
    .authenticate() //vai tentar autenticar
    .then(() => {
        console.log("Conexão feita com o banco de dados!"); //Se der certo
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

//Estou dizendo para o Express usar o EJS como View Engine
app.set('view engine', 'ejs'); 
app.use(express.static('public'));
//Body parser
app.use(bodyParser.urlencoded({extended: false}));//linkou o bodyParser
app.use(bodyParser.json());//permite ler dados de formulário via JSON
//Rotas
app.get("/", (req, res) => {
    Pergunta.findAll({ raw: true, order: [
        ["id", "DESC"] //ASC  = Crescente || DESC = Decrescente
    ] }).then(perguntas => {
        res.render("index", {
            perguntas: perguntas //criando variável perguntas que recebe as perguntas do banco de dados
        });
    }) 
    
});

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo, //campo titulo recebe a variável titulo
        descricao: descricao //campo descricao recebe a variável descricao
    }).then(() => {
        res.redirect("/"); // a barra redireciona para a página inicial
    })
});

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined) { //pergunta achada

            Resposta.findAll({
                where: { perguntaId: pergunta.id },
                order: [["id", "DESC"]]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });            
        } else { //não encontrada
            res.redirect("/");
        }
    });
})

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId);
    });
});

app.listen(8080, () => {console.log("App rodando!");});
const Sequelize = require("sequelize");
const connection = require("./database");

const Pergunta = connection.define("perguntas", {
    //definindo o model
    titulo:{
        type: Sequelize.STRING,
        allowNull: false //nunca ficará vazio
    },
    descricao:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//sincronizar com o banco de dados
Pergunta.sync({force: false}).then(() => {});

module.exports = Pergunta;
const Sequelize = require("sequelize");

//banco, administrador, senha
const connection = new Sequelize("guiaperguntas", "root", "1234", {
    host: "localhost",
    dialect: "mysql"
});

module.exports = connection;
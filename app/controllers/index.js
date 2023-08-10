const { check, validationResult } = require("express-validator");
const { connMongoDB } = require('D:/Paulo/Estudos/Javascript/game_of_throne_rpg/config/dbConnection.js'); // Adjust the path accordingly

const UsuariosDAO = require('D:/Paulo/Estudos/Javascript/game_of_throne_rpg/app/models/usuariosDAO.js');


module.exports.index = (application, req, res) => {
    res.render('index', { validacao: {} });
}


module.exports.autenticar = async (application, req, res) => {

    let dadosForm = req.body;
    const validations = [
        check("usuario").notEmpty().withMessage("Usuario não pode ser vazio"),
        check("senha").notEmpty().withMessage("Senha não pode ser vazio"),
    ];

    await Promise.all(validations.map((validation) => validation.run(req)));

    const erros = validationResult(req);

    if (!erros.isEmpty()) {
        // If there are validation errors, send the errors as a response
        return res.render("index", { validacao: erros.array() });
    }

    const connection = await connMongoDB();
    const usuariosDAO = new UsuariosDAO(connection);

    await usuariosDAO.autenticar(dadosForm, req, res);

    //res.send("tudo ok")
}
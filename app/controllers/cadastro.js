const { check, validationResult } = require("express-validator");
const { connMongoDB } = require('D:/Paulo/Estudos/Javascript/game_of_throne_rpg/config/dbConnection.js'); // Adjust the path accordingly

const UsuariosDAO = require('D:/Paulo/Estudos/Javascript/game_of_throne_rpg/app/models/usuariosDAO.js');

module.exports.cadastro = (application, req, res) => {
    res.render("cadastro", { validacao: {}, dadosForm: {} });
};

module.exports.cadastrar = async (application, req, res) => {
    let dadosForm = req.body;

    // Define validation chains using body()
    const validations = [
        check("senha").notEmpty().withMessage("Senha não pode ser vazio"),
        check("nome").notEmpty().withMessage("Nome não pode ser vazio"),
        check("usuario").notEmpty().withMessage("Usuario não pode ser vazio"),
        check("casa").notEmpty().withMessage("Casa não pode ser vazio"),
    ];

    // Execute the validation chains and get the validation result
    try {
        // Execute the validation chains and get the validation result
        await Promise.all(validations.map((validation) => validation.run(req)));

        const erros = validationResult(req);

        if (!erros.isEmpty()) {
            // If there are validation errors, send the errors as a response
            return res.render("cadastro", { validacao: erros.array(), dadosForm: dadosForm });
        } else {
            const connection = await connMongoDB();
            const usuariosDAO = new UsuariosDAO(connection);

            await usuariosDAO.inserirUsuario(dadosForm);
            res.send("Podemos cadastrar");
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

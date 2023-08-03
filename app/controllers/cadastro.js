
const { check, validationResult } = require("express-validator");


module.exports.cadastro = (application, req, res) => {
    res.render("cadastro", { validacao: {}, dadosForm: {} })
};

module.exports.cadastrar = (application, req, res) => {
    let dadosForm = req.body;
    //console.log(dadosForm)

    // Define validation chains using body()
    const validations = [
        check("nome").notEmpty().withMessage("Nome não pode ser vazio"),
        check("usuario").notEmpty().withMessage("Usuario não pode ser vazio"),
        //check("senha").notEmpty().withMessage("Senha não pode ser vazio"),
        check("casa").notEmpty().withMessage("Casa não pode ser vazio"),
    ];

    // Execute the validation chains and get the validation result
    Promise.all(validations.map((validation) => validation.run(req))).then(() => {
        const erros = validationResult(req);
        //console.log(erros);

        if (!erros.isEmpty()) {
            // If there are validation errors, send the errors as a response
            return res.render("cadastro", { validacao: erros.array(), dadosForm: dadosForm });
        } else {
            let connection = application.config.dbConnection;
            let UsuariosDAO = new application.app.models.UsuariosDAO(connection);
            UsuariosDAO.inserirUsuario(dadosForm);
            res.send("Podemos cadastrar");
        }
    });
};





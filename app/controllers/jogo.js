const { check, validationResult } = require("express-validator");
const {
  connMongoDB,
} = require("D:/Paulo/Estudos/Javascript/game_of_throne_rpg/config/dbConnection.js"); // Adjust the path accordingly
const JogoDAO = require("D:/Paulo/Estudos/Javascript/game_of_throne_rpg/app/models/jogoDAO.js");

module.exports.jogo = async (application, req, res) => {
  if (req.session.autorizado !== true) {
    res.send("Nao autorizado");
    return;
  }

  let msg = "";
  if (req.query.msg != "") {
    msg = req.query.msg;
  }
  console.log(msg);

  const usuario = req.session.usuario;
  const casa = req.session.casa;

  const connection = connMongoDB();
  const jogoDAO = new JogoDAO(connection);

  await jogoDAO.iniciaJogo(res, usuario, casa, msg);
};

module.exports.sair = (application, req, res) => {
  req.session.destroy(function (erro) {
    res.render("index", { validacao: {} });
  });
};

module.exports.suditos = (application, req, res) => {
  if (req.session.autorizado !== true) {
    res.send("Faça login");
    return;
  }
  res.render("aldeoes", { validacao: {} });
};

module.exports.pergaminhos = async (application, req, res, usuario) => {
  if (req.session.autorizado !== true) {
    res.send("Faça login");
    return;
  }

  //recuperar ações do bd
  const connection = await connMongoDB();
  const jogoDAO = new JogoDAO(connection);

  jogoDAO.getAcoes(req, res, usuario);
};

module.exports.ordenar_acao_sudito = async (application, req, res) => {
  if (req.session.autorizado !== true) {
    res.send("Nao autorizado");
    return;
  }

  let dadosForm = req.body;
  const validations = [
    check("acao").notEmpty().withMessage("Escolha uma ação"),
    check("quantidade").notEmpty().withMessage("Escolha uma quantidade"),
  ];

  await Promise.all(validations.map((validation) => validation.run(req)));

  const erros = validationResult(req);

  if (!erros.isEmpty()) {
    res.redirect("jogo?msg=A");
    return;
  }

  const connection = await connMongoDB();
  const jogoDAO = new JogoDAO(connection);

  dadosForm.usuario = req.session.usuario;
  await jogoDAO.acao(dadosForm);

  res.redirect("jogo?msg=B");
};

module.exports.revogar_acao = async function (application, req, res) {
  let url_query = req.query;

  const connection = await connMongoDB();
  const jogoDAO = new JogoDAO(connection);

  const _id = url_query.id_acao;
  jogoDAO.revogarAcao(res, _id);
};

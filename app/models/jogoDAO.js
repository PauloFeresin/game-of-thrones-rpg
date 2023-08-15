const {
  connMongoDB,
} = require("D:/Paulo/Estudos/Javascript/game_of_throne_rpg/config/dbConnection.js"); // Adjust the path accordingly

const ObjectId = require("mongodb").ObjectId;

function JogoDAO() {}

JogoDAO.prototype.gerarParametros = async function (usuario) {
  try {
    const connectedClient = await connMongoDB();
    const db = connectedClient.db("got"); // Replace 'got' with your database name
    const collectionName = "jogo"; // Replace 'usuarios' with your desired collection name

    const collection = db.collection(collectionName);

    const result = await collection.insertOne({
      usuario: usuario,
      moeda: 15,
      suditos: 10,
      temor: Math.floor(Math.random() * 1000),
      sabedoria: Math.floor(Math.random() * 1000),
      comercio: Math.floor(Math.random() * 1000),
      magia: Math.floor(Math.random() * 1000),
    });
    console.log("Usuario inserted successfully:", result.ops[0]);
  } catch (error) {
    console.error("Error inserting usuario:", error);
  }
};

JogoDAO.prototype.iniciaJogo = async function (res, usuario, casa, msg) {
  const connectedClient = await connMongoDB();
  const db = connectedClient.db("got");
  const collectionName = "jogo";
  const collection = db.collection(collectionName);

  const query = { nome: usuario.usuario };
  const result = await collection.findOne(query);

  //console.log(result);

  res.render("jogo", { img_casa: casa, jogo: result, msg: msg });
};

JogoDAO.prototype.acao = async function (acao) {
  try {
    const connectedClient = await connMongoDB();
    const db = connectedClient.db("got");
    const collectionName = "acao";

    const collection = db.collection(collectionName);

    const date = new Date();

    let tempo = null;

    switch (parseInt(acao.acao)) {
      case 1:
        tempo = 1 * 60 * 60000;
        break;
      case 2:
        tempo = 2 * 60 * 60000;
        break;
      case 3:
        tempo = 5 * 60 * 60000;
        break;
      case 4:
        tempo = 5 * 60 * 60000;
        break;
    }

    acao.acao_termina_em = date.getTime() + tempo;
    const result = await collection.insertOne(acao);

    console.log("Usuario inserted successfully:", result.ops);
  } catch (error) {
    console.error("Error inserting usuario:", error);
  }

  const connectedClient = await connMongoDB();
  const db = connectedClient.db("got");
  const collectionName = "jogo";

  const collection = db.collection(collectionName);

  let moedas = null;
  switch (parseInt(acao.acao)) {
    case 1:
      moedas = -2 * acao.quantidade;
      break;
    case 2:
      moedas = -3 * acao.quantidade;
      break;
    case 3:
      moedas = -1 * acao.quantidade;
      break;
    case 4:
      moedas = -1 * acao.quantidade;
      break;
  }

  collection.updateOne({ usuario: acao.usuario }, { $inc: { moeda: moedas } });
  console.log(moedas);
};

JogoDAO.prototype.getAcoes = async function (req, res, usuario) {
  const connectedClient = await connMongoDB();
  const db = connectedClient.db("got");
  const collectionName = "acao";
  const collection = db.collection(collectionName);

  const date = new Date();
  let momento_atual = date.getTime();

  const user = req.session.usuario;
  const query = { usuario: user, acao_termina_em: { $gt: momento_atual } };
  const cursor = collection.find(query);

  // Convert the cursor to an array of documents
  const acoes = await cursor.toArray();

  res.render("pergaminhos", { acoes: acoes });
};

JogoDAO.prototype.revogarAcao = async function (res, _id) {
  try {
    const connectedClient = await connMongoDB();
    const db = connectedClient.db("got");
    const collectionName = "acao";
    const collection = db.collection(collectionName);

    const result = await collection.deleteOne({ _id: new ObjectId(_id) });
    if (result.deletedCount === 1) {
      res.redirect("jogo?msg=D");
    }
  } catch (err) {
    console.error("Error revoking action:", err);
  }
};

module.exports = JogoDAO;

const { connMongoDB } = require("D:/Paulo/Estudos/Javascript/game_of_throne_rpg/config/dbConnection.js"); // Adjust the path accordingly

function UsuariosDAO() {
    // No need to accept a connection here
}

UsuariosDAO.prototype.inserirUsuario = async function (usuario) {
    try {
        const connectedClient = await connMongoDB();
        const db = connectedClient.db("got"); // Replace 'got' with your database name
        const collectionName = 'usuarios'; // Replace 'usuarios' with your desired collection name

        const collection = db.collection(collectionName);

        const result = await collection.insertOne(usuario);
        console.log("Usuario inserted successfully:", result.ops[0]);
    } catch (error) {
        console.error("Error inserting usuario:", error);
    }
};

UsuariosDAO.prototype.autenticar = async function (usuario, req, res) {
    try {
        const connectedClient = await connMongoDB();
        const db = connectedClient.db("got");
        const collectionName = 'usuarios';

        const collection = db.collection(collectionName);

        const query = { nome: usuario.usuario, senha: usuario.senha };

        const result = await collection.findOne(query);

        if (result) {
            const nome = result.nome;
            req.session.autorizado = true

            req.session.usuario = result.usuario
            req.session.casa = result.casa

            //console.log("Nome:", nome);
            //console.log(req.session.autorizado)
            res.redirect("jogo")

        } else {
            //console.log("User not found");
            res.render("index", { validacao: {} })

        }
    } catch (error) {
        console.error("Error searching usuario:", error);
    }
};

module.exports = UsuariosDAO;

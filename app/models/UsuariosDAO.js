function UsuariosDAO(connection) {
    this._connection = connection;
}

UsuariosDAO.prototype.inserirUsuario = function (usuario) {
    this._connection.open(function (erro, mongoclient) {
        mongoclient.collection("usuarios", function (erro, collection) {
            collection.insert(usuario)

            mongoclient.close();
        })
    });


}

module.exports = () => {
    return UsuariosDAO;
}
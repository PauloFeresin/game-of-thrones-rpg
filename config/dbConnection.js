//importa o mongo
const { MongoClient } = require("mongodb")

const connMongoDB = async () => {
    console.log("Entrou no func de conexão")
    const url = "mongodb://localhost:27017";
    const dbName = "got";

    try {
        const client = await MongoClient.connect(url, {
            useUnifiedTopology: true,
        });
        const db = client.db(dbName);

        return db;
    } catch (error) {
        console.error("Erro ao conectar ao mongodb:", error);
        throw error;
    }

}


module.exports = () => {
    return connMongoDB
};

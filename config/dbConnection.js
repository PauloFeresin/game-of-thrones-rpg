const { MongoClient } = require('mongodb');

async function connMongoDB() {
    const uri = "mongodb+srv://pauloferesin:Smarters%402023@meucluster.mfvzhcx.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
        // Connect the client to the Atlas cluster
        await client.connect();
        console.log("Connected to MongoDB Atlas!");
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas:", error);
        throw error; // Rethrow the error to handle it outside
    }

    return client;
}

module.exports = {
    connMongoDB
};

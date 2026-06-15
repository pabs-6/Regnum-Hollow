const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

let db;
let clientPromise;

async function connectDB() {
  if (db) return db;

  if (!clientPromise) {
    try {
      console.log('Intentando conectar a:', uri ? uri.replace(/:.+@/, ':****@') : 'URI NO DEFINIDA');
      const client = new MongoClient(uri);
      clientPromise = client.connect().then(connectedClient => {
        db = connectedClient.db(dbName);
        console.log('✅ Conectado a MongoDB Atlas');
        return db;
      }).catch(error => {
        clientPromise = null;
        console.error('❌ Error conectando MongoDB:', error);
        throw error;
      });
    } catch (err) {
      clientPromise = null;
      console.error('❌ Error al inicializar MongoClient:', err);
      throw err;
    }
  }
  return clientPromise;
}

function getDB() {
  return db;
}

module.exports = {
  connectDB,
  getDB
};
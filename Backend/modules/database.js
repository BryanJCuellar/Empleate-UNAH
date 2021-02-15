// Modulo mongoose para facilitar la conexion a Mongo DB
var mongoose = require('mongoose');

var servidor = 'localhost:27017';
var db = 'dbEmpleate';

class Database {
    constructor() {
        mongoose.connect(process.env.MONGODB_URI || `mongodb://${servidor}/${db}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }).then(() => {
            console.log('Conexion a mongoDB exitosa');
        }).catch((error) => {
            console.log('Error en la BD: ', error);
        });
    }
}

module.exports = new Database();
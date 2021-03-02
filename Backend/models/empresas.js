var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var esquemaEmpresas = new mongoose.Schema({
    organizacion: String,
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    datosDireccion: Array, 
    telefono: String,
    imagenPerfil: String,
    descripcionPerfil: String,
    vacantes: Array,
    solicitudEnviada: Array,
    solicitudRecibida: Array
}, {
    timestamps: true,
});

module.exports = mongoose.model('empresas', esquemaEmpresas);



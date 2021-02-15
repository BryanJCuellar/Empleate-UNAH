var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var esquemaEstudiante = new mongoose.Schema({
    nombre: String,
    apellido: String,
    email: {
        type: String,
        trim: true,
        unique: true
    },
    // verifiedEmail: Boolean,
    password: {
        type: String,
        trim: true
    },
    telefono: String,
    imagenPerfil: String,
    educacion: String,
    intereses: String
}, {
    timestamps: true,
});

esquemaEstudiante.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('estudiantes', esquemaEstudiante);
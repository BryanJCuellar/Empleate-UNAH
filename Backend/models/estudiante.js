var mongoose = require('mongoose');
// var bcrypt = require('bcryptjs');

var esquemaEstudiante = new mongoose.Schema({
    nombre: String,
    apellido: String,
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    // verifiedEmail: Boolean,
    password: {
        type: String,
        trim: true,
        required: true
    },
    fechaNacimiento: String,
    numeroIdentidad: String,
    genero: String,
    datosDireccion: Array, // Nacionalidad, Pais, departamento, ciudad, codigo postal
    centro: String,
    carreras: Array,
    clasesAprobadas: Number,
    telefono: String,
    imagenPerfil: String,
    tituloCurriculum: String,
    descripcionPerfil: String,
    intereses: String
}, {
    timestamps: true,
});

module.exports = mongoose.model('estudiantes', esquemaEstudiante);
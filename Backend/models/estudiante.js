var mongoose = require('mongoose');
// var bcrypt = require('bcryptjs');

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
    fechaNacimiento: String,
    numeroIdentidad: String,
    genero: String,
    datosDireccion: Array, // Nacionalidad, Pais, departamento, ciudad, codigo postal
    centro: String,
    carreras: Array,
    telefono: String,
    imagenPerfil: String,
    tituloCurriculum: String,
    descripcionPerfil: String,
    intereses: String
}, {
    timestamps: true,
});

/*esquemaEstudiante.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}*/

module.exports = mongoose.model('estudiantes', esquemaEstudiante);
var mongoose = require('mongoose');

var esquemaEstudiante = new mongoose.Schema({

//  DATOS SIMULADOS: OBTENIDOS DE REGISTRO UNAH

    nombre: String, 
    apellido: String,
    cuenta: String,
    passwordCuenta: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    centro: String,
    imagenPerfil: String,
    clasesAprobadas: Number,
    indice: Number,
    carreras: Array,

// *******************************************************
// INFOTMACION DEL PERFIL
    
    genero: String,
    telefono: String,
    fechaNacimiento: String,
    numeroIdentidad: String,
    descripcionPerfil: String,
    intereses: String,
    datosDireccion: Array, // Nacionalidad, Pais, departamento, ciudad, codigo postal
    CurriculumAdjunto: String,
    Lenguajes: Array, // ingles, frances, aleman, japones

// *********************************************************
// CARACTERISTICAS DE TRABAJO DESEADO
    
    areaDeseada: String,
    puestoDeseado: String,
    horarioDeseado: String,
    estado: Boolean,
    solicitudEnviada: Array,
    solicitudRecibida: Array

// **********************************************************
}, {
    timestamps: true,
});

module.exports = mongoose.model('estudiantes', esquemaEstudiante);
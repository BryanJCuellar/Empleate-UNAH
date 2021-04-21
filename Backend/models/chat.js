const mongoose = require('mongoose');

var esquemaChat = new mongoose.Schema({
    id_estudiante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "estudiantes"
    },
    id_empresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "empresas"
    },
    // noReadEstudiante: Number,
    // noReadEmpresa: Number,
    mensajes: Array
}, {
    timestamps: true,
});

module.exports = mongoose.model('chats', esquemaChat);
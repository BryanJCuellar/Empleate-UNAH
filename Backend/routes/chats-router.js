var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var chat = require('../models/chat');

// Cargar chats de usuario logueado
router.get('/:tipoUsuario/misChats/:idUsuario', function (req, res){
    if(req.params.tipoUsuario == 'student'){
        chat.aggregate([
            // Join with estudiante
            {
                $lookup: {
                    from: "estudiantes",
                    localField: "id_estudiante",
                    foreignField: "_id",
                    as: "estudiante"
                }
            },
            {
                $unwind: "$estudiante"
            },
            // Join with empresa
            {
                $lookup: {
                    from: "empresas",
                    localField: "id_empresa",
                    foreignField: "_id",
                    as: "empresa"
                }
            },
            {
                $unwind: "$empresa"
            },
            {
                $match: {
                    id_estudiante: mongoose.Types.ObjectId(req.params.idUsuario)
                }
            },
            {
                $project: {
                    id_estudiante: true,
                    id_empresa: true,
                    noReadEstudiante: true,
                    "empresa.organizacion": true,
                    "empresa.imagenPerfil": true
                }
            }
        ]).exec((err, info) => {
            if (err) {
                res.send({
                    error: err,
                    mensaje: "Error de servidor en cargar chats para Estudiante"
                });
            }
            if (info) {
                res.status(200).send(info);
                res.end();
            }
        });
    };
    if (req.params.tipoUsuario == 'company') {
        chat.aggregate([
            // Join with estudiante
            {
                $lookup: {
                    from: "estudiantes",
                    localField: "id_estudiante",
                    foreignField: "_id",
                    as: "estudiante"
                }
            },
            {
                $unwind: "$estudiante"
            },
            // Join with empresa
            {
                $lookup: {
                    from: "empresas",
                    localField: "id_empresa",
                    foreignField: "_id",
                    as: "empresa"
                }
            },
            {
                $unwind: "$empresa"
            },
            {
                $match: {
                    id_empresa: mongoose.Types.ObjectId(req.params.idUsuario)
                }
            },
            {
                $project: {
                    id_estudiante: true,
                    id_empresa: true,
                    noReadEmpresa: true,
                    "estudiante.nombre": true,
                    "estudiante.apellido": true,
                    "estudiante.imagenPerfil": true
                }
            }
        ]).exec((err, info) => {
            if (err) {
                res.send({
                    error: err,
                    mensaje: "Error de servidor en cargar chats para Empresa"
                });
            }
            if (info) {
                res.status(200).send(info);
                res.end();
            }
        });
    };
});

// Cargar Chat (Sin Mensajes)
router.get('/:idChat/:tipoUsuario', function (req, res) {
    if (req.params.tipoUsuario == 'student') {
        chat.aggregate([
            // Join with estudiante
            {
                $lookup: {
                    from: "estudiantes",
                    localField: "id_estudiante",
                    foreignField: "_id",
                    as: "estudiante"
                }
            },
            {
                $unwind: "$estudiante"
            },
            // Join with empresa
            {
                $lookup: {
                    from: "empresas",
                    localField: "id_empresa",
                    foreignField: "_id",
                    as: "empresa"
                }
            },
            {
                $unwind: "$empresa"
            },
            {
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.idChat)
                }
            },
            {
                $project: {
                    id_estudiante: true,
                    id_empresa: true,
                    "empresa.organizacion": true,
                    "empresa.imagenPerfil": true
                }
            }
        ]).exec((err, info) => {
            if (err) {
                res.send({
                    error: err,
                    mensaje: "Error de servidor en cargar chat para Estudiante"
                });
            }
            if (info) {
                res.status(200).send(info[0]);
                res.end();
            }
        });
    };
    if (req.params.tipoUsuario == 'company') {
        chat.aggregate([
            // Join with estudiante
            {
                $lookup: {
                    from: "estudiantes",
                    localField: "id_estudiante",
                    foreignField: "_id",
                    as: "estudiante"
                }
            },
            {
                $unwind: "$estudiante"
            },
            // Join with empresa
            {
                $lookup: {
                    from: "empresas",
                    localField: "id_empresa",
                    foreignField: "_id",
                    as: "empresa"
                }
            },
            {
                $unwind: "$empresa"
            },
            {
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.idChat)
                }
            },
            {
                $project: {
                    id_estudiante: true,
                    id_empresa: true,
                    "estudiante.nombre": true,
                    "estudiante.apellido": true,
                    "estudiante.imagenPerfil": true
                }
            }
        ]).exec((err, info) => {
            if (err) {
                res.send({
                    error: err,
                    mensaje: "Error de servidor en cargar chat para Empresa"
                });
            }
            if (info) {
                res.status(200).send(info[0]);
                res.end();
            }
        });
    };
});

// Crear chat
router.post('/', verificarChat, function (req, res) {
    // Si chat no ha sido creado, se procede a crear chat
    const nuevo_chat = new chat({
        id_estudiante: req.body.id_estudiante,
        id_empresa: req.body.id_empresa,
        mensajes: []
    });

    nuevo_chat.save()
        .then(result => {
            res.status(200).send({
                mensaje: 'Chat creado',
                data: result
            });
            res.end();
        }).catch(error => {
            res.send({
                error: error,
                mensaje: 'Error al crear chat'
            });
            res.end();
        })
});

// Borrar chat
router.delete('/:idChat', function (req, res) {
    chat.deleteOne({
            _id: mongoose.Types.ObjectId(req.params.idChat)
        })
        .then(result => {
            res.send(result);
            res.end();
        })
        .catch(error => {
            res.status(500).send(error);
            res.end();
        });
});

module.exports = router;

function verificarChat(req, res, next) {
    chat.findOne({
        id_estudiante: req.body.id_estudiante,
        id_empresa: req.body.id_empresa
    }, (err, data) => {
        if (err) return res.send('Server error');
        if (!data) {
            // Si no hay chat creado, prosigue con la peticion
            next();
        } else {
            res.status(200).send({
                mensaje: 'Chat ya creado',
                data: data
            });
            res.end();
        }
    });
}
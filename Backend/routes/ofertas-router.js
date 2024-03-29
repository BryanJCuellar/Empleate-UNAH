var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var oferta = require('../models/oferta');
// Secret Key Empresa
var SK_EMPRESA = 'B0K9VuiHThqATv0dk1iKu8INW1OQ6YqAZbcEPKhOEV8N3eTbXU5kjbsnchlXbZ0';

// Obtener todas las ofertas con estado true (Renderizar para estudiantes) (Metodo Aggregate)
router.get('/', function (req, res) {
    oferta.aggregate([{
                $lookup: {
                    from: "empresas",
                    localField: "id_empresa",
                    foreignField: "_id",
                    as: "empresa"
                }
            },
            {
                $match: {
                    estado_oferta: true
                }
            },
            {
                $project: {
                    _id: true,
                    id_empresa: true,
                    titulo_Oferta: true,
                    ubicacion: true,
                    fecha_publicacion: true,
                    descripcion: true,
                    palabras_clave: true,
                    idiomas: true,
                    edad: true,
                    indice_estudiante: true,
                    experiencia_laboral: true,
                    jornada_laboral: true,
                    tipo_contrato: true,
                    salario: true,
                    estado_oferta: true,
                    "empresa.organizacion": true,
                    "empresa.email": true,
                    "empresa.imagenPerfil": true
                }
            }
        ]).then(result => {
            res.send(result);
            res.end();
        })
        .catch(error => {
            res.send(error);
            res.end();
        });
    /*oferta.find({}, {     
    }).then(result => {
            res.send(result);
            res.end();
        })
        .catch(error => {
            res.send(error);
            res.end();
        })*/
})

// Obtener ofertas de la empresa
router.get('/empresa/:idEmpresa', verifyToken, function (req, res) {
    oferta.find({
            id_empresa: mongoose.Types.ObjectId(req.params.idEmpresa)
        }, {})
        .then(result => {
            res.send(result);
            res.end();
        })
        .catch(error => {
            res.send(error);
            res.end();
        });
});

// Guardar una oferta
router.post('/', verifyToken, function (req, res) {
    const nueva_oferta = new oferta({
        id_empresa: mongoose.Types.ObjectId(req.body.idEmpresa),
        titulo_Oferta: req.body.titulo_Oferta,
        ubicacion: {
            departamento: req.body.departamento,
            ciudad: req.body.ciudad
        },
        fecha_publicacion: {
            dia: req.body.dia,
            mes: req.body.mes,
            anio: req.body.anio
        },
        descripcion: req.body.descripcion,
        palabras_clave: req.body.palabras_clave,
        idiomas: req.body.idiomas,
        edad: req.body.edad,
        indice_estudiante: req.body.indice_estudiante,
        experiencia_laboral: req.body.experiencia_laboral,
        jornada_laboral: req.body.jornada_laboral,
        tipo_contrato: req.body.tipo_contrato,
        salario: req.body.salario,
        estado_oferta: true,
        postulaciones: []
    });

    nueva_oferta.save()
        .then(result => {
            res.status(200).send({
                mensaje: 'Oferta Publicada',
                data: result
            });
            res.end();
        }).catch(error => {
            res.send(error);
            res.end();
        })
});

// Actualizar oferta 
router.put('/:idOferta', verifyToken, function (req, res) {
    const newOferta = req.body

    oferta.updateOne({
            _id: mongoose.Types.ObjectId(req.params.idOferta)
        }, newOferta, {
            new: true
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

// Cambiar estado oferta (Oferta archivada o activa)
router.put('/:idOferta/estado', function (req, res) {
    oferta.updateOne({
            _id: mongoose.Types.ObjectId(req.params.idOferta)
        }, {
            estado_oferta: req.body.estado_oferta
        })
        .then(result => {
            res.send(result);
            res.end();
        })
        .catch(error => {
            res.status(500).send(error);
            res.end();
        });
})

// Eliminar Oferta
router.delete('/:idOferta', verifyToken, function (req, res) {
    oferta.deleteOne({
            _id: mongoose.Types.ObjectId(req.params.idOferta)
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

//Obtener una oferta
router.get('/:idOFerta', function (req, res) {
    oferta.find({
                _id: req.params.idOFerta
            },

        )
        .then(result => {
            res.send(result[0]);
            res.end();
        })
        .catch(error => {
            res.send(error);
            res.end();
        });

});
// Agregar postulados para empresas (Postulaciones en Ofertas)
router.post('/:idOferta/postulaciones', verificarPostulacion, function (req, res) {
    oferta.updateOne({
        _id: mongoose.Types.ObjectId(req.params.idOferta)
    }, {
        $push: {
            postulaciones: {
                id_estudiante: mongoose.Types.ObjectId(req.body.id_estudiante),
                fecha_postulacion: {
                    dia: req.body.dia,
                    mes: req.body.mes,
                    anio: req.body.anio
                }
            }
        }
    }).then(result => {
        res.send(result);
        res.end();
    }).catch(error => {
        res.send({
            error: error,
            mensaje: 'Ocurrio un error al postular en Ofertas'
        });
        res.end();
    });
});

// Eliminar una postulacion en ofertas
router.put('/:idOferta/postulaciones/:idEstudiante', function (req, res) {
    oferta.updateOne({
        _id: mongoose.Types.ObjectId(req.params.idOferta)
    }, {
        $pull: {
            postulaciones: {
                id_estudiante: mongoose.Types.ObjectId(req.params.idEstudiante)
            }
        }
    }).then(result => {
        res.send(result);
        res.end();
    }).catch(error => {
        res.send(error);
        res.end();
    });
});

// Obtener todas las postulaciones de ofertas de una empresa (Metodo Aggregate)
router.get('/:idOferta/postulaciones', function (req, res) {
    oferta.aggregate([
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
            // Join with estudiante
            {
                $lookup: {
                    from: "estudiantes",
                    localField: "postulaciones.id_estudiante",
                    foreignField: "_id",
                    as: "estudiante"
                }
            },
            {
                $unwind: "$estudiante"
            },
            {
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.idOferta),
                    estado_oferta: true
                }
            },
            {
                $project: {
                    titulo_Oferta: true,
                    ubicacion: true,
                    estado_oferta: true,
                    "empresa.organizacion": true,
                    "estudiante._id": true,
                    "estudiante.nombre": true,
                    "estudiante.apellido": true,
                    "postulaciones": true
                }
            }
        ]).then(result => {
            res.send(result);
            res.end();
        })
        .catch(error => {
            res.send({
                error: error,
                mensaje: 'Ocurrio un error en el aggregate de las postulaciones de ofertas de una empresa'
            });
            res.end();
        });
})

module.exports = router;

// Postulacion existente?
function verificarPostulacion(req, res, next) {
    oferta.findOne({
        _id: mongoose.Types.ObjectId(req.params.idOferta),
        "postulaciones.id_estudiante": mongoose.Types.ObjectId(req.body.id_estudiante)
    }, (err, data) => {
        if (err) return res.status(500).send('Server error');
        if (!data) {
            // Si estudiante no esta postulado, prosigue con la peticion
            next();
        } else {
            res.status(403).send({
                mensaje: 'Ya postulado para esta oferta'
            });
            res.end();
        }
    });
}

// Verificar token (para Empresa)
function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        if (bearerToken === null) {
            return res.status(401).send('No-Autorizado');
        }
        jwt.verify(bearerToken, SK_EMPRESA, (err, decoded) => {
            if (err) {
                if (err.message == "jwt expired" || err.message == "invalid token") {
                    res.sendStatus(401);
                } else {
                    res.sendStatus(500);
                }
            }
            if (decoded) {
                if (decoded.rol !== 'Empresa') {
                    return res.status(401).send('No-Autorizado');
                }
                req._id = decoded._id;
                req.rol = decoded.rol;
                next();
            }
        });
    } else {
        res.status(401).send('No-Autorizado');
    }
}
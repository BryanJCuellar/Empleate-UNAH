var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs-extra');
var multerImages = require('../libs/multer-images');
var multerFiles = require('../libs/multer-files');
var estudiante = require('../models/estudiante');
// Auth
var jwt = require('jsonwebtoken');
var randToken = require('rand-token');
var SECRET_KEY = 'bHYFnHrZ20WQDPQnCqcZbwAXDuyWxSxsRRQQ78IkhvmykZiE6jPsZuMbAFsvXOz';
var refreshTokensEstudiante = [];
var expiresIn = 24 * 60 * 60;

// Obtener Token
router.get('/tokenID', verifyToken, function (req, res) {
    res.status(200).send({
        text: 'This is your token ID and Rol',
        id: req._id,
        rol: req.rol
    });
    res.end();
});

//Obtener la información de un estudiante
router.get('/:idEstudiante/ver_perfil', function (req, res) {
    estudiante.find({
            _id: req.params.idEstudiante
        }, )
        .then(result => {
            res.send(result[0]);
            res.end();
        })
        .catch(error => {
            res.send(error);
            res.end();
        });

});

// Obtener informacion principal de estudiante (Logueado)
router.get('/:idEstudiante/main', verifyToken, function (req, res) {
    estudiante.findOne({
            _id: mongoose.Types.ObjectId(req.params.idEstudiante)
        }, {
            _id: true,
            nombre: true,
            apellido: true,
            email: true,
            centro: true,
            imagenPerfil: true,
            carreras: true,
            estado: true,
            telefono: true,
            intereses: true,
            Lenguajes: true,
            descripcionPerfil: true,
            indice: true,
            fechaNacimiento: true,
            CurriculumAdjunto: true
        })
        .then(result => {
            res.send(result);
            res.end();
        })
        .catch(error => {
            res.send(error);
            res.end();
        });
});

// Obtener toda la informacion de un estudiante (Logueado)
router.get('/:idEstudiante', verifyToken, function (req, res) {
    estudiante.findOne({
            _id: mongoose.Types.ObjectId(req.params.idEstudiante)
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

// Login estudiante
router.post('/login', function (req, res) {
    estudiante.findOne({
            email: req.body.email
        }, {
            _id: true,
            email: true,
            passwordCuenta: true
        })
        .then(result => {
            if (result.passwordCuenta === req.body.password) {
                // Success, inicia sesion con JWT
                const user = {
                    _id: result._id,
                    rol: 'Estudiante'
                };
                const token = jwt.sign(user, SECRET_KEY, {
                    expiresIn: expiresIn
                });
                const refreshToken = randToken.uid(256);
                refreshTokensEstudiante[refreshToken] = user._id;
                const dataEnviar = {
                    jwt: token,
                    refreshToken: refreshToken,
                    rol: user.rol
                }
                res.status(200).send({
                    mensaje: 'OK',
                    data: dataEnviar
                });
                res.end();
            } else {
                res.status(400).send({
                    mensaje: 'No-Autorizado: Password incorrecta'
                });
                res.end();
            }
        })
        .catch(error => {
            res.status(400).send({
                error: error,
                mensaje: 'No-Autorizado: Email no encontrado'
            });
            res.end();
        });
});

// Logout Estudiante
router.post('/logout', function (req, res) {
    const refreshToken = req.body.refreshToken;
    if (refreshToken in refreshTokensEstudiante) {
        delete refreshTokensEstudiante[refreshToken];
    }
    res.status(200).send({
        mensaje: "logout"
    });
    res.end();
});

// Refresh Token
router.post('/refresh', function (req, res) {
    const refreshToken = req.body.refreshToken;
    if (refreshToken in refreshTokensEstudiante) {
        const user = {
            _id: refreshTokensEstudiante[refreshToken],
            rol: 'Estudiante'
        };
        const token = jwt.sign(user, SECRET_KEY, {
            expiresIn: expiresIn
        });
        res.status(200).send({
            jwt: token
        });
        res.end();
    } else {
        res.sendStatus(401);
        res.end();
    }
});

// Obtener todos los estudiantes
router.get('/', function (req, res) {
    estudiante.find({}, {
            _id: true,
            nombre: true,
            apellido: true,
            email: true,
            centro: true,
            imagenPerfil: true,
            carreras: true,
            estado: true
        })
        .then(result => {
            res.send(result);
            res.end();
        })
        .catch(error => {
            res.send(error);
            res.end();
        });
});

// Guardar o actualizar datos del estudiante
router.put('/:idEstudiante', verifyToken, function (req, res) {
    estudiante.updateOne({
            _id: mongoose.Types.ObjectId(req.params.idEstudiante)
        }, {
            telefono: req.body.telefono,
            descripcionPerfil: req.body.descripcionPerfil,
            intereses: req.body.intereses,
            datosDireccion: {
                departamento: req.body.departamento,
                ciudad: req.body.ciudad,
                direccion: req.body.direccion
            },
            Lenguajes: req.body.Lenguajes
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

// Subir o actualizar imagenPerfil
router.post('/:idEstudiante/imagenPerfil', multerImages.single('imagenPerfil'),
    deleteImageOnUpdate,
    function (req, res) {
        estudiante.updateOne({
                _id: req.params.idEstudiante
            }, {
                $set: {
                    imagenPerfil: req.file.path
                }
            })
            .then(result => {
                // console.log("Original Name", req.file.originalname);
                res.send(result);
                res.end();
            })
            .catch(error => {
                res.send(error);
                res.end();
            });
    });

// Subir o actualizar curriculum
router.post('/:idEstudiante/CV', multerFiles.single('CurriculumAdjunto'),
    deleteCVOnUpdate,
    function (req, res) {
        estudiante.updateOne({
                _id: req.params.idEstudiante
            }, {
                $set: {
                    CurriculumAdjunto: req.file.path
                }
            })
            .then(result => {
                res.send(result);
                res.end();
            })
            .catch(error => {
                res.send(error);
                res.end();
            });
    });

// postulaciones para estudiantes
router.post('/:idEstudiante/postulaciones', verificarPostulacion, function (req, res) {
    estudiante.updateOne({
        _id: mongoose.Types.ObjectId(req.params.idEstudiante)
    }, {
        $push: {
            postulaciones: {
                id_oferta: mongoose.Types.ObjectId(req.body.id_oferta),
                fecha_postulacion: {
                    dia: req.body.dia,
                    mes: req.body.mes,
                    anio: req.body.anio
                },
                estado_postulacion: "En proceso"
            }
        }
    }).then(result => {
        res.send(result);
        res.end();
    }).catch(error => {
        res.send(error);
        res.end();
    })
});

// Eliminar una postulacion en Estudiantes
router.put('/:idEstudiante/postulaciones/:idOferta', function (req, res) {
    estudiante.updateOne({
        _id: mongoose.Types.ObjectId(req.params.idEstudiante)
    }, {
        $pull: {
            postulaciones: {
                id_oferta: mongoose.Types.ObjectId(req.params.idOferta)
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

// Obtener postulaciones de Estudiante (Metodo Aggregate)
router.get('/:idEstudiante/postulaciones', function (req, res) {
    estudiante.aggregate([
            // Join with Oferta
            {
                $lookup: {
                    from: "ofertas",
                    localField: "postulaciones.id_oferta",
                    foreignField: "_id",
                    as: "oferta"
                }
            },
            {
                $unwind: "$oferta"
            },
            // Join with Empresa
            {
                $lookup: {
                    from: "empresas",
                    localField: "oferta.id_empresa",
                    foreignField: "_id",
                    as: "empresa"
                }
            },
            {
                $unwind: "$empresa"
            },
            {
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.idEstudiante)
                }
            },
            {
                $project: {
                    _id: true,
                    nombre: true,
                    apellido: true,
                    "oferta": true,
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
            res.send({
                error: error,
                mensaje: 'Ocurrio un error en el aggregate de las postulaciones de estudiantes'
            });
            res.end();
        });
});

async function deleteImageOnUpdate(req, res, next) {
    const Estudiante = await estudiante.findById(req.params.idEstudiante);
    if (Estudiante.imagenPerfil != null && fs.existsSync(path.resolve(Estudiante.imagenPerfil))) {
        await fs.unlink(path.resolve(Estudiante.imagenPerfil));
    }
    next();
}

async function deleteCVOnUpdate(req, res, next) {
    const Estudiante = await estudiante.findById(req.params.idEstudiante);
    if (Estudiante.CurriculumAdjunto != null && fs.existsSync(path.resolve(Estudiante.CurriculumAdjunto))) {
        await fs.unlink(path.resolve(Estudiante.CurriculumAdjunto));
    }
    next();
}

module.exports = router;

// Postulacion existente?
function verificarPostulacion(req, res, next) {
    estudiante.findOne({
        _id: mongoose.Types.ObjectId(req.params.idEstudiante),
        "postulaciones.id_oferta": mongoose.Types.ObjectId(req.body.id_oferta)
    }, (err, data) => {
        if (err) return res.status(500).send('Server error');
        if (!data) {
            // Si estudiante no esta postulado, prosigue con la peticion
            next();
        } else {
            res.status(200).send({
                mensaje: 'Ya postulado para esta oferta'
            });
            res.end();
        }
    });
}

// Verificar token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        if (bearerToken === null) {
            return res.status(401).send('No-Autorizado');
        }
        jwt.verify(bearerToken, SECRET_KEY, (err, decoded) => {
            if (err) {
                if (err.message == "jwt expired" || err.message == "invalid token") {
                    res.sendStatus(401);
                } else {
                    res.sendStatus(500);
                }
            }
            if (decoded) {
                if (decoded.rol !== 'Estudiante') {
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
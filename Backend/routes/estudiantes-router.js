var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multer = require('../libs/multer');
// var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var estudiante = require('../models/estudiante');
var SECRET_KEY = 'bHYFnHrZ20WQDPQnCqcZbwAXDuyWxSxsRRQQ78IkhvmykZiE6jPsZuMbAFsvXOz';

// Obtener Token
router.get('/tokenID', verifyToken, function (req, res) {
    res.send({
        text: 'This is your token ID and Rol',
        id: req._id,
        rol: req.rol
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
            Lenguajes:true,
            descripcionPerfil:true,
            indice: true,
            clasesAprobadas: true,
            fechaNacimiento: true
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

// Loguear estudiante
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
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign({
                    _id: result._id,
                    rol: 'Estudiante'
                }, SECRET_KEY, {
                    expiresIn: expiresIn
                });
                const dataEnviar = {
                    email: result.email,
                    rol: 'Estudiante',
                    accessToken: accessToken,
                    expiresIn: expiresIn
                }
                res.status(200).send({
                    mensaje: 'OK',
                    data: dataEnviar
                });
                res.end();
            } else {
                res.status(401).send({
                    mensaje: 'No-Autorizado: Password incorrecta'
                });
                res.end();
            }
        })
        .catch(error => {
            res.status(401).send({
                error: error,
                mensaje: 'No-Autorizado: Email no encontrado'
            });
            res.end();
        });
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

router.post('/:idEstudiante/imagenPerfil', multer.single('imagenPerfil'), function (req, res) {
    estudiante.updateOne({
            _id: req.params.idEstudiante
        }, {
            $set: {
                imagenPerfil: req.file.path
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

module.exports = router;

// Verificar token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        if (bearerToken === null) {
            return res.status(401).send('No-Autorizado');
        }
        const payload = jwt.verify(bearerToken, SECRET_KEY);
        if (payload.rol !== 'Estudiante') {
            return res.status(401).send('No-Autorizado');
        }
        req._id = payload._id;
        req.rol = payload.rol;
        next();
    } else {
        res.status(401).send('No-Autorizado');
    }
}
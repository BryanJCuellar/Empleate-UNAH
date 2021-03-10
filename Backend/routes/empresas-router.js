var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var empresa = require('../models/empresas');
var SECRET_KEY = 'B0K9VuiHThqATv0dk1iKu8INW1OQ6YqAZbcEPKhOEV8N3eTbXU5kjbsnchlXbZ0';

// Obtener Token
router.get('/tokenID', verifyToken, function (req, res) {
    res.send({
        text: 'This is your token ID and Rol',
        id: req._id,
        rol: req.rol
    });
});

// Obtener toda la informacion de una empresa (logueada)
router.get('/:idEmpresa', verifyToken, function (req, res) {
    empresa.findOne({
            _id: mongoose.Types.ObjectId(req.params.idEmpresa)
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

// Registrar Empresa
router.post('/signup', validateEmail, function (req, res) {
    // Hashing password
    let password_hash = bcrypt.hashSync(req.body.password, 10);
    const nueva_empresa = new empresa({
        organizacion: req.body.organizacion,
        email: req.body.email,
        password: password_hash,
        datosDireccion: {
            departamento: req.body.departamento,
            ciudad: req.body.ciudad,
            direccion: req.body.direccion
        },
        telefono: req.body.telefono,
        imagenPerfil: null,
        descripcionPerfil: null,
        ofertas: [],
        solicitudEnviada: [],
        solicitudRecibida: []
    });

    nueva_empresa.save()
        .then(result => {
            // Success, inicia sesion con JWT
            const expiresIn = 24 * 60 * 60;
            const accessToken = jwt.sign({
                _id: result.id,
                rol: 'Empresa'
            }, SECRET_KEY, {
                expiresIn: expiresIn
            });
            const dataEnviar = {
                email: result.email,
                rol: 'Empresa',
                accessToken: accessToken,
                expiresIn: expiresIn
            };
            res.status(200).send({
                mensaje: 'Registrado',
                data: dataEnviar
            });
            res.end();
        }).catch(error => {
            res.send(error);
            res.end();
        })
});

// Loguear empresa
router.post('/login', function (req, res) {
    empresa.findOne({
            email: req.body.email
        }, {
            _id: true,
            email: true,
            password: true
        })
        .then(result => {
            // Comparar hash de password
            let password_match = bcrypt.compareSync(req.body.password, result.password)
            if (password_match) {
                // Success, inicia sesion con JWT
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign({
                    _id: result._id,
                    rol: 'Empresa'
                }, SECRET_KEY, {
                    expiresIn: expiresIn
                });
                const dataEnviar = {
                    email: result.email,
                    rol: 'Empresa',
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

// Obtener todas las empresas
router.get('/', function (req, res) {
    empresa.find({}, {
            organizacion: true,
            email: true,
            datosDireccion: true,
            telefono: true,
            imagenPerfil: true,
            descripcionPerfil: true,
            ofertas: true
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

// Listar las ofertas de una empresa logueada (Metodo aggregate)
router.get('/:idEmpresa/ofertas', verifyToken, function (req, res) {
    // Code
});

// Guardar ID de ofertas en una empresa
router.post('/:idEmpresa/ofertas', verifyToken, function (req, res) {
    empresa.updateOne({
        _id: req.params.idEmpresa
    }, {
        $push: {
            ofertas: {
                _id: mongoose.Types.ObjectId(req.body.idOferta),
                titulo_Oferta: req.body.titulo_Oferta
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

module.exports = router;

// Validar email duplicado o no
function validateEmail(req, res, next) {
    empresa.findOne({
        email: req.body.email
    }, (err, email) => {
        if (err) return res.status(500).send('Server error');
        if (!email) {
            // Si email no se repite, prosigue con la peticion
            next();
        } else {
            res.status(403).send({
                mensaje: 'Email ya registrado'
            });
            res.end();
        }
    })
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
        const payload = jwt.verify(bearerToken, SECRET_KEY);
        if (payload.rol !== 'Empresa') {
            return res.status(401).send('No-Autorizado');
        }
        req._id = payload._id;
        req.rol = payload.rol;
        next();
    } else {
        res.status(401).send('No-Autorizado');
    }
}
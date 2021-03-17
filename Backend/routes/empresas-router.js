var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var empresa = require('../models/empresas');
var SECRET_KEY = 'B0K9VuiHThqATv0dk1iKu8INW1OQ6YqAZbcEPKhOEV8N3eTbXU5kjbsnchlXbZ0';
var nodemailer = require('nodemailer');

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

router.post('/signup/validateEmail', validateEmail, function (req, res){
    res.status(200).send({
        mensaje: 'Email no duplicado'
    });
    res.end();
});

// Enviar correo de confirmacion (Registro Empresa)
router.post('/signup/send-email/verify', function (req, res) {
    var rand = Math.floor((Math.random() * 100000) + 77);
    rand = rand.toString();
    let rand_hash = bcrypt.hashSync(rand, 10);
    var transporter = nodemailer.createTransport({
        // Gmail
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "empleateunah@gmail.com",
            pass: "ingenieria"
        }
    });
    var mailOptions = {
        from: "empleateunah@gmail.com",
        to: req.body.email,
        subject: "Correo de confirmación",
        text: `El código de confirmación es: ${rand}`
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            // console.log("Email enviado.");
            res.status(200).send({
                data: data,
                code_hash: rand_hash
            });
        }
    });
});

// Registrar Empresa
router.post('/signup', function (req, res) {
    // Hashing password
    let password_hash = bcrypt.hashSync(req.body.password, 10);
    let codigoCorrecto = bcrypt.compareSync(req.body.codigoConfirmacion, req.body.codigoHash)
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
        facebook: null,
        paginaWeb: null,
        solicitudEnviada: [],
        solicitudRecibida: []
    });

    if(codigoCorrecto){
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
            res.send({
                error: error,
                mensaje: "Error al guardar empresa"
            });
            res.end();
        })
    } else {
        res.status(401).send({
            mensaje: "Codigo no valido"
        });
        res.end();
    }
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
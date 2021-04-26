var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var path = require('path');
var bcrypt = require('bcryptjs');
var fs = require('fs-extra');
var multerImages = require('../libs/multer-images');
var empresa = require('../models/empresas');
var nodemailer = require('nodemailer');
// Auth
var jwt = require('jsonwebtoken');
var randToken = require('rand-token');
var SECRET_KEY = 'B0K9VuiHThqATv0dk1iKu8INW1OQ6YqAZbcEPKhOEV8N3eTbXU5kjbsnchlXbZ0';
var refreshTokensEmpresa = [];
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

router.post('/signup/validateEmail', validateEmail, function (req, res) {
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
            pass: "eaijdfqfbqtwflui"
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
        facebook: null,
        paginaWeb: null
    });

    if (codigoCorrecto) {
        nueva_empresa.save()
            .then(result => {
                // Success, inicia sesion con JWT
                const user = {
                    _id: result._id,
                    rol: 'Empresa'
                };
                const token = jwt.sign(user, SECRET_KEY, {
                    expiresIn: expiresIn
                });
                const refreshToken = randToken.uid(256);
                refreshTokensEmpresa[refreshToken] = user._id;
                const dataEnviar = {
                    jwt: token,
                    refreshToken: refreshToken,
                    rol: user.rol
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
        res.status(400).send({
            mensaje: "Codigo no valido"
        });
        res.end();
    }
});

// Login empresa
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
                const user = {
                    _id: result._id,
                    rol: 'Empresa'
                };
                const token = jwt.sign(user, SECRET_KEY, {
                    expiresIn: expiresIn
                });
                const refreshToken = randToken.uid(256);
                refreshTokensEmpresa[refreshToken] = user._id;
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

// Logout Empresa
router.post('/logout', function (req, res) {
    const refreshToken = req.body.refreshToken;
    if (refreshToken in refreshTokensEmpresa) {
        delete refreshTokensEmpresa[refreshToken];
    }
    res.status(200).send({
        mensaje: "logout"
    });
    res.end();
});

// Refresh Token
router.post('/refresh', function (req, res) {
    const refreshToken = req.body.refreshToken;
    if (refreshToken in refreshTokensEmpresa) {
        const user = {
            _id: refreshTokensEmpresa[refreshToken],
            rol: 'Empresa'
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

// Obtener todas las empresas
router.get('/', function (req, res) {
    empresa.find({}, {
            organizacion: true,
            email: true,
            datosDireccion: true,
            telefono: true,
            imagenPerfil: true,
            descripcionPerfil: true
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

// Guardar o actualizar datos de la empresa
router.put('/:idEmpresa', verifyToken, function (req, res) {
    empresa.updateOne({
            _id: mongoose.Types.ObjectId(req.params.idEmpresa)
        }, {
            organizacion: req.body.organizacion,
            telefono: req.body.telefono,
            descripcionPerfil: req.body.descripcionPerfil,
            datosDireccion: {
                departamento: req.body.departamento,
                ciudad: req.body.ciudad,
                direccion: req.body.direccion
            },
            facebook: req.body.facebook,
            paginaWeb: req.body.paginaWeb
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
router.post('/:idEmpresa/imagenPerfil', multerImages.single('imagenPerfil'),
    deleteImageOnUpdate,
    function (req, res) {
        empresa.updateOne({
                _id: req.params.idEmpresa
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

async function deleteImageOnUpdate(req, res, next) {
    const Empresa = await empresa.findById(req.params.idEmpresa);
    if (Empresa.imagenPerfil != null && fs.existsSync(path.resolve(Empresa.imagenPerfil))) {
        await fs.unlink(path.resolve(Empresa.imagenPerfil));
    }
    next();
}

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
        jwt.verify(bearerToken, SECRET_KEY, (err, decoded) => {
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
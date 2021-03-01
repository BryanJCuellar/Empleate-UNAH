var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var empresa = require('../models/empresas');
var SECRET_KEY = 'B0K9VuiHThqATv0dk1iKu8INW1OQ6YqAZbcEPKhOEV8N3eTbXU5kjbsnchlXbZ0';

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
            _id: true,
            nombre: true,
            apellido: true,
            email: true
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
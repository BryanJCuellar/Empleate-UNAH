var express = require('express');
var router = express.Router;
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var oferta = require('../models/oferta');

// Obtener todas las ofertas (Renderizar para estudiantes)
router.get('/', function (req, res) {
    oferta.find({}, {})
        .then(result => {
            res.send(result);
            res.end();
        })
        .catch(error => {
            res.send(error);
            res.end();
        })
})

// Guardar una oferta
router.post('/', verifyToken, function (req, res) {
    // Code
})

module.exports = router;






// Verificar token (para Empresa)
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
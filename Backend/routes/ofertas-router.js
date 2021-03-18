var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var oferta = require('../models/oferta');
var SECRET_KEY = 'B0K9VuiHThqATv0dk1iKu8INW1OQ6YqAZbcEPKhOEV8N3eTbXU5kjbsnchlXbZ0';

// Obtener todas las ofertas (Renderizar para estudiantes) (Metodo Aggregate)
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
router.get('/:idEmpresa', verifyToken, function (req, res) {
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
        estado_oferta: true
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
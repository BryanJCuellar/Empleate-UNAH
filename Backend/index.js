// Modulo Express
var express = require('express');
// Modulo cors para prevenir problemas de dominios cruzados
var cors = require('cors');
// Modulo body-parser para obtener datos en metodo POST (deprecated)
var bodyParser = require('body-parser');
var multer = require('multer');
var path = require('path');

// Conexion a BD
var database = require('./modules/database');

// Rutas Express
var estudiantesRouter = require('./routes/estudiantes-router');
var empresasRouter = require('./routes/empresas-router');
var ofertasRouter = require('./routes/ofertas-router');

var app = express();

// Middleware
app.use(cors()); // Para permitir peticiones de otros origenes (Server frontend a server backend)
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    res.send('Ruta principal de servidor Backend de EMPLEATE-UNAH activa');
});

// Ruta Estudiantes
app.use('/estudiantes', estudiantesRouter);
// Ruta Empresas
app.use('/empresas', empresasRouter);
// Ruta Ofertas
app.use('/ofertas', ofertasRouter);

// Uploads
app.use('/uploads', express.static(path.resolve('uploads')));

// process.env.PORT: variable de entorno para escuchar el puerto que la plataforma a subir la app nos brinde
app.set('port', process.env.PORT || 8888);

app.listen(app.get('port'), function () {
    console.log(`Servidor Backend en el puerto ${app.get('port')}`);
});
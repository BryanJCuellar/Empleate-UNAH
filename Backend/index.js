// Modulo Express
var express = require('express');
// Modulo cors para prevenir problemas de dominios cruzados
var cors = require('cors');
// Modulo body-parser para obtener datos en metodo POST
var bodyParser = require('body-parser');

var app = express();

// Middleware
app.use(cors()); // Para permitir peticiones de otros origenes (Server frontend a server backend)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    res.send('Ruta principal de servidor Backend de EMPLEATE-UNAH activa');
});
// process.env.PORT: variable de entorno para escuchar el puerto que la plataforma a subir la app nos brinde
app.set('port', process.env.PORT || 8888);

app.listen(app.get('port'), function () {
    console.log(`Servidor Backend en el puerto ${app.get('port')}`);
});
// Modulo Express
var express = require('express');
var app = express();
var http = require('http');
// Modulo cors para prevenir problemas de dominios cruzados
var cors = require('cors');
// Modulo body-parser para obtener datos en metodo POST (deprecated)
var bodyParser = require('body-parser');
var multer = require('multer');
var path = require('path');
const server = http.Server(app);
const io = require('socket.io')(server, {
    cors: {
        //origin: '*',
        origin: true,
        credentials: true,
        methods: ['GET', 'POST']
    }
});

// Conexion a BD
var database = require('./modules/database');

// Mongoose chat
const mongoose = require('mongoose');
const Chat = require('./models/chat');

// Middleware
app.use(cors()); // Para permitir peticiones de otros origenes (Server frontend a server backend)
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    res.send('Ruta principal de servidor Backend de EMPLEATE-UNAH activa');
});

// Rutas Express
var estudiantesRouter = require('./routes/estudiantes-router');
var empresasRouter = require('./routes/empresas-router');
var ofertasRouter = require('./routes/ofertas-router');
var chatsRouter = require('./routes/chats-router');

// Ruta Estudiantes
app.use('/estudiantes', estudiantesRouter);
// Ruta Empresas
app.use('/empresas', empresasRouter);
// Ruta Ofertas
app.use('/ofertas', ofertasRouter);
// Ruta Chats
app.use('/chats', chatsRouter);

// Uploads
app.use('/uploads', express.static(path.resolve('uploads')));

/*********************************Socket connection (Chat)****************************************/
io.on('connection', (socket) => {
    let mensajes;
    console.log("Nuevo usuario conectado con ID:", socket.id);
    console.log("No. conexiones:", io.engine.clientsCount);
    // Cargar mensajes de chat
    socket.on('load-messages', (data) => {
        // Unirse a rooms
        socket.join(data.idChat);
        Chat.findOne({
            _id: data.idChat
        }, {
            mensajes: true
        }).exec((err, info) => {
            if (err) console.log("Error de servidor en cargar mensajes de chat")
            if (info) {
                socket.emit('receive-messages', info.mensajes);
            }
        });
    });
    // Envio de mensajes
    socket.on('send-message', (data) => {
        mensajes = null;
        Chat.findOne({
            _id: data.idChat
        }, (err, info) => {
            if (err) console.log("Error de servidor en enviar chat")
            if (!info) {
                const nuevo_chat = new Chat({
                    _id: mongoose.Types.ObjectId(data.idChat),
                    id_estudiante: data.idEstudiante,
                    id_empresa: data.idEmpresa,
                    mensajes: [{
                        from: mongoose.Types.ObjectId(data.from),
                        text: data.text
                    }]
                });
                nuevo_chat.save();
                mensajes = [];
                mensajes.push({
                    from: mongoose.Types.ObjectId(data.from),
                    text: data.text
                });
                socket.emit('receive-messages', mensajes);
                socket.to(data.idChat).emit('receive-messages', mensajes);
            } else {
                mensajes = info.mensajes;
                mensajes.push({
                    from: mongoose.Types.ObjectId(data.from),
                    text: data.text
                });
                Chat.updateOne({
                    _id: data.idChat
                }, {
                    $push: {
                        mensajes: {
                            from: mongoose.Types.ObjectId(data.from),
                            text: data.text
                        }
                    }
                }).exec((err, info) => {
                    if (err) console.log("Error de servidor en enviar mensaje al actualizar")
                    if (info) {
                        socket.emit('receive-messages', mensajes);
                        socket.to(data.idChat).emit('receive-messages', mensajes);
                    }
                });
            }
        });
    });

    // Desconectar usuario
    socket.on('Disconnect', (data) => {
        socket.leave(data.idChat);
        console.log(`Usuario con ID ${socket.id} desconectado`);
        console.log("No. conexiones:", io.engine.clientsCount - 1);
        socket.disconnect();
    });
})

/************************************************************************************************/

// process.env.PORT: variable de entorno para escuchar el puerto que la plataforma a subir la app nos brinde
app.set('port', process.env.PORT || 8888);

server.listen(app.get('port'), function () {
    console.log(`Servidor Backend en el puerto ${app.get('port')}`);
});
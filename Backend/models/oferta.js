var mongoose = require('mongoose');

var esquemaOfertas = new mongoose.Schema({
    id_empresa: {
      type: mongoose.Schema.Types.ObjectId,
      req: "empresas"
    },
    titulo_Oferta: String, // titulo breve de la oferta
    ubicacion: Array, // Ciudad donde se necesita el personal a emplear
    fecha_publicacion: Array, // Fecha de publicacion de la oferta para filtrar por fecha
    descripcion: String, // Breve descripcion de la plaza vacante
    palabras_clave: Array, // para filtrar por carreras las publicaciones
    idiomas: String, // mostrado como dato de requisito
    edad: String, // mostrado como dato de requisito
    indice_estudiante: Number, // para el filtro por indice
  //anio_estudiantil: Number, // para el filtro de buscar por año cursado
    experiencia_laboral: String, // filtro para los graduados (años de experiencia)
    jornada_laboral: String, // para el filtro estudiante busque su horario de conveniencia
    tipo_contrato: String, // filtro por hora, medio tiempo, tiempo completo..
    salario: Number, // filtro para buscar segun el billete que va a caerle... +50,000
    estado_oferta: Boolean
}, {
    timestamps: true,
});

module.exports = mongoose.model('ofertas', esquemaOfertas);
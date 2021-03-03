var multer = require('multer');
const { v4: uuidv4 } = require('uuid');
var path = require('path');
const { modelName } = require('../models/estudiante');

const storage = multer.diskStorage({
    destination: 'uploads/files', 
    filename: (req, file, cb)=>{
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});

module.exports = multer({storage});

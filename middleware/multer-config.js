const multer = require('multer');
// stockage des fichiers uploades dans la memoire vive (RAM)
const storage = multer.memoryStorage();
// instance de multer avec la gestion d'un seul fichier,
// le fichier uploadé est accessible dans la propriété req.file (req: la requete)
module.exports = multer({storage}).single('image');
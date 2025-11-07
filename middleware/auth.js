const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // extraction du token d'authentification dans l'entete HTTP Authorization
        // au format "Bearer <token>"
        const token = req.headers.authorization.split(' ')[1];
        // verification du token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        req.auth = {userId: userId};
        next();
    } catch (error) {res.status(401).json({error});} // token invalide, expiré, ou mal formé
};

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'a3f1e5b7c8d9e0123456789abcdef0123456789abcdef0123456789abcdef0123';

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userId = decodedToken.userId;
        req.auth = {userId: userId};
        next();
    } catch (error) {res.status(401).json({error});}
};

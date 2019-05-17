const jwt = require('jsonwebtoken');
const config = require('config');
//Auth user by jwt token and give him access to the events
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');

    if(!token) {
        return res.status(401).json({msg: 'No token denied'});
    }
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch (e) {
        res.status(401).json({msg: 'Token is not valid' });
    }
};

module.exports = auth;
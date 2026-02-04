const jwt = require('jsonwebtoken');
const { config } = require('../config/secrets');

/*
3 access levels on the site:
Admin - the programmer who built the project
Owner - the owner of the store
User - external customers
 */

//Auth Admin - Access permission for the store admin
exports.authAdmin = (req, res, next) => {
    let token = req.header('x-api-key');
    if (!token) {
        return res.status(401).json({ message: 'You must send token in the header to this endpoint' })
    }
    try {
        let decodeToken = jwt.verify(token, config.token_secret);
        if (decodeToken.role != 'admin') {
            return res.status(401).json({ message: 'Just Admin can access this endpoint !' });
        }
        req.tokenData = decodeToken;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Token invalid or expired' })
    }
}

//Auth Owner - Access permission for the project manager
exports.authOwner = (req, res, next) => {
    let token = req.header('x-api-key');
    if (!token) {
        return res.status(401).json({ message: 'You must send token in the header to this endpoint' })
    }
    try {
        let decodeToken = jwt.verify(token, config.token_secret);
        if (decodeToken.role != 'owner') {
            return res.status(401).json({ message: 'Just owner can access this endpoint !' });
        }
        req.tokenData = decodeToken;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Token invalid or expired' })
    }
}

//Auth Users - Customer access permission
exports.auth = (req, res, next) => {
    let token = req.header('x-api-key');
    if (!token) {
        return res.status(401).json({ message: 'You must send token in the Header to this Endpoint' })
    }
    try {
        let decodeToken = jwt.verify(token, config.token_secret);
        req.tokenData = decodeToken;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Token invalid or expired' })
    }
}
const allowedOrigins = require('../config/allowedOrigin')

const originCredentials = (req,res,next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next()
};
 
module.exports = originCredentials
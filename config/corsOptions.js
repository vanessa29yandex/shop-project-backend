const allowOrigins = require('./allowedOrigin')

const corsOptions = {
    origin: (origin, callback) => {
        if (allowOrigins.indexOf(origin) !==-1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error ('Rejected by CORS'))
        }
    },
    optionsSuccessStatus: 200
  };

  module.exports = corsOptions
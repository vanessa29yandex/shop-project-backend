const allowOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://192.168.1.161:5173']

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
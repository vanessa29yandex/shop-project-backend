const mongoose = require('mongoose');

const connection = async() => {
    let url = process.env.MONGO_URL;
    console.log(url)

    try {
        await mongoose.connect(url)
        console.log("Connected to MongoDB")
    } 
    catch (err) {
        console.log(err)
    }
};

module.exports = connection;
const mongoose = require("mongoose")
const config = require('config')

const connectDB = async () => {
    try {
        await mongoose.connect(config.get("mongoURL"));
        console.log("CONNECTED DATABASE");
    } catch (error) {
        console.log("Error", error.message);
    }
}

module.exports = connectDB
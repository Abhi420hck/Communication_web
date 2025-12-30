const mongoose = require('mongoose');

const connectDb = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDb connneted: ${conn.connection.host}`);
    }
    catch(error){
        console.log(`error message: ${error.message}`);
        process.exit();
    }
};

module.exports = connectDb;
const userRouters = require('./Routes/userRoutes');
const express = require('express');
const dotenv = require('dotenv');
const connectDb = require('./config/db');


dotenv.config();
connectDb();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/user",userRouters);


app.get('/',(req,res) => {
    res.send("API is running..");
});


app.listen(PORT,console.log(`Server Started On PORT:${PORT}`));
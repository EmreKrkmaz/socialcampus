import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import dotenv from 'dotenv';
import path from "path";
import {fileURLToPath} from 'url';

const app = express();
dotenv.config();

app.use(bodyParser.json({limit:"30mb", extended:true}));
app.use(bodyParser.json({limit:"30mb", extended:true}));
app.use(cors());

app.use('/posts', postRoutes);
app.use('/user', userRoutes);


// const CONNECTION_URL = "mongodb+srv://emrekorkmaz:emre123@emrekorkmaz.huyh0.mongodb.net/?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    app.listen(process.env.PORT || PORT, () => { console.log(`Server is running on port: ${PORT}`)})
})
.catch((error)=>{
    console.log(error.message);
});


// heroku connection

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));

    app.get('*', (req,res) => {
            res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
}
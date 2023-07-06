import express from 'express'
import mongoose from 'mongoose';
import * as dotenv from 'dotenv'
import connectDB from './config.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path'
import jwt from 'jsonwebtoken'
import userRoute from './route/userRoute.js'
import postRoute from './route/postRoute.js'

dotenv.config()
const app = express();
const port = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// const mongoDBURL = process.env.MONGOURI;
const URL = process.env.MONGOURL;

connectDB(URL).then((res)=>{
    console.log(res)
})
app.use(express.static(path.join(__dirname, "uploads")))

app.use('user',userRoute);
app.use('post',postRoute);

app.listen(port,()=>{
    console.log(`Server started....${port}`);
})

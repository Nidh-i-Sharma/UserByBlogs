import { Timestamp } from 'mongodb';
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    profilePicture: {
        type: String,
    },
},
    {
        timestamp: true
    })

var userModel = mongoose.model('user', userSchema);
export default userModel
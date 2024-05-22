import { Schema, model } from "mongoose";

let userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        lowercase: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String,
        enum: ['female', 'male'],
        default: 'female'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'},
    age: {type: Number,
        min: 15,
        max: 100
    }
}, {timestamps:true})

let User = model('User', userSchema)

export default User
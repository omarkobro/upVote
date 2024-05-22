import User from "../../../DB/models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


// ============= Sign Up ================
export let signUp = async (req,res,next) =>{
    let {userName, email ,password, age,gender}  = req.body

    let isEmailExist = await User.findOne({email})
    if(isEmailExist){
        return next(new Error("Email Already Exists", {cause: 409}))
    }

    let hashPassword= bcrypt.hashSync(password, +process.env.SALT_ROUNDS)
    let newUser = await User.create({userName, email ,password:hashPassword, age,gender})
    return res.status(201).json({
        message: 'User created successfully', newUser 
    })
} 


// ============= Sign In ================
export let signIn = async (req,res,next) =>{
    let {email, password} = req.body

    let isEmailExist = await User.findOne({email})

    if(!isEmailExist){
        return next (new Error("invalid Login Credentials", {cause:404}))
    }

    let token = jwt.sign({id: isEmailExist._id, userEmail: isEmailExist.email},process.env.LOGIN_SIGNATURE,{
        expiresIn:"48h",
    })
    return res.status(200).json({
        message:"Logged In Successfully, you will be redirected soon", token
    })
}



// ============= Update Account ================

export let updateAccount = async (req,res,next) =>{
    let {userName, email, password} = req.body
    let {_id} = req.authUser

    if(email){
        let isEmailExist = await User.findOne({email})
        if(isEmailExist) {
            return next(new Error('Email is already exists', { cause: 409 })) 
        }
    }
    let updatedUser = await User.findByIdAndUpdate(_id, {userName, email, password},{
        new:true
    })
    if(!updatedUser){
        return next(new Error('update fail'))
    }
    res.status(200).json({message:"done", updatedUser})
}


// ============= Delete Account ================

export let deleteAccount = async (req,res,next) =>{

    let {_id} = req.authUser

    let deletedUser = await User.findByIdAndDelete(_id)
    if(!deletedUser){
        return next(new Error('deletion fail'))
    }
    res.status(200).json({message:"done", deletedUser})
}

// ============= Get User Info  ================

export const getUserProfile = async (req, res, next) => {
    res.status(200).json({ message: "User data:", data: req.authUser })
}

import User from "../../DB/models/user.model.js"
import jwt from 'jsonwebtoken'

export let auth = () =>{
    return async (req,res,next) =>{
        try {
            let {accesstoken} = req.headers
            if(!accesstoken){
                return next(new Error('please login first', { cause: 400 }))
            }
    
            if(!accesstoken.startsWith(process.env.TOKEN_PREFIX)){
                return next(new Error('invalid token prefix', { cause: 400 }))
            }
            let token = accesstoken.split(process.env.TOKEN_PREFIX)[1]
            let decodedData = jwt.verify(token, process.env.LOGIN_SIGNATURE)
    
            if(!decodedData || !decodedData.id){
                return next(new Error('invalid token payload', { cause: 400 }))
            }
            let findUser = await User.findById(decodedData.id)
            if(!findUser){
                return next(new Error('please signUp first', { cause: 404 }))
            }
            req.authUser = findUser 
            next()
        } catch (error) {
            next(new Error('catch error in auth middleware', { cause: 500 }))
        }
    }
}
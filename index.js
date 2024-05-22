import express from 'express'
import { config } from 'dotenv'
import db_connection from './DB/db_connection.js'
import { globalResponse } from './src/middlewares/globalResponse.js'
import userRouter from './src/modules/user/user.router.js'
import productRouter from './src/modules/products/product.routes.js'

config({path: './config/dev.config.env'})

let app = express()

let port = process.env.PORT

app.use(express.json())

app.use('/user', userRouter)
app.use('/product', productRouter)
app.use(globalResponse) 

db_connection()

app.listen(port, ()=> console.log("Project Is Working Fine")) 
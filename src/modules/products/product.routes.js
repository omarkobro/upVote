
import { Router } from "express";
import * as productController from './product.controller.js'
import { multerMiddleHost } from "../../middlewares/multer.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
const router = Router()




router.post('/addProduct', auth(), multerMiddleHost({extensions: allowedExtensions.image}).array('image', 3), expressAsyncHandler(productController.addProduct))
router.post('/likeProduct/:productId', auth(), expressAsyncHandler(productController.likesOrUnlikesProduct))
router.delete('/deleteProduct/:productId', auth(), expressAsyncHandler(productController.deleteProduct))
router.get('/getlikes/:productId', expressAsyncHandler(productController.getAllLikesForProduct))

export default router
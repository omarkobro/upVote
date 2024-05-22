import likesModel from "../../../DB/models/likes.model.js"
import productsModel from "../../../DB/models/products.model.js"
import cloudinaryConnection from "../../utils/cloudinary.js"
import generateUniqueString from "../../utils/generateUniqueString.js"

//========================== Add Product ============================//
export const addProduct = async (req, res, next) => {
    const { title, caption } = req.body
    const { _id } = req.authUser
    if (!req.files?.length) return next(new Error('Please upload at least one image', { cause: 400 }))
    let Images = []
    let publicIdsArr = []
    const folderId = generateUniqueString(5) 
    for (const file of req.files) {
        const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(file.path, {
            folder: `upVoteImages/products/${_id}/${folderId}`
        })
        publicIdsArr.push(public_id)
        Images.push({ secure_url, public_id, folderId })
    }

    const product = await productsModel.create({
        title,
        caption,
        Images,
        addedBy: _id
    })

    if (!product) {
        const data = await cloudinaryConnection().api.delete_resources(publicIdsArr)
        return next(new Error('Error while creating product', { cause: 500 }))
    }

    res.status(201).json({
        message: 'Product added successfully',
        data: product
    })
}

//========================== Delete Product ============================

// i did some research and found that to delete a folder in cloudinary we have to empty the folder first and then delete the folder itself 
export const deleteProduct = async (req, res, next) => {
    const { _id } = req.authUser
    const { productId } = req.params
    //here we'll delete the product from the DB
    const product = await productsModel.findOneAndDelete({ addedBy: _id, _id: productId })
    if (!product) return next(new Error('product not found', { cause: 404 }))

    //Here we'll empty the folder 
    await cloudinaryConnection().api.delete_resources_by_prefix(`upVoteImages/products/${product.addedBy}/${product.Images[0].folderId}`,async(error,result)=>{
        if(error){
            return next(new Error('error in delete', { cause: 404 }))
        }
        // here we'll delete the folder we've just emptied
        await cloudinaryConnection().api.delete_folder(`upVoteImages/products/${product.addedBy}/${product.Images[0].folderId}`)
    })
    res.status(200).json({ message: 'Deleted Done' })
}

//=========================== LikeOrUnlike API ===========================//
export const likesOrUnlikesProduct = async (req, res, next) => {
    const { productId } = req.params
    const { _id } = req.authUser
    const { onModel } = req.body

    const product = await productsModel.findById(productId)
    if (!product) return next(new Error('Product not found', { cause: 404 }))

    const isAlreadyLiked = await likesModel.findOne({ likedBy: _id, likeDoneOnId: productId })
    if (isAlreadyLiked) {
        // delete liked document
        await likesModel.findByIdAndDelete(isAlreadyLiked._id)
        // unlike
        product.numberOfLikes--;
        await product.save()
        return res.status(200).json({ message: 'Unliked successfully', product })
    }

    // create like document
    const like = await likesModel.create({ likedBy: _id, onModel, likeDoneOnId: productId })
    product.numberOfLikes++;
    await product.save()

    res.status(200).json({ message: 'Liked successfully', data: like, product })
}


export const getAllLikesForProduct = async (req, res, next) => {
    const likes = await likesModel.find({ likeDoneOnId: req.params.productId }).populate([{
        path: 'likeDoneOnId',
    }])
    res.status(200).json({ message: 'success', data: likes })
}
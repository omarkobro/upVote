import { Schema, model } from "mongoose";


let likesSchema = new Schema({

    likedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    likeDoneOnId: { type: Schema.Types.ObjectId, refPath: 'onModel' },
    onModel: {
        type: String,
        enum: ['Product', 'User', 'Comment', 'Reply']
    }
}, {
    timestamps: true
})


export default model('Likes', likesSchema) 
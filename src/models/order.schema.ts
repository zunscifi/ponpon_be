import * as mongoose from 'mongoose'

export const orderSchema = new mongoose.Schema({
    plan_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: new Date()
    },
})

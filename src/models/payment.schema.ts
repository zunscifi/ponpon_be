import * as mongoose from 'mongoose'

export const paymentSchema = new mongoose.Schema({
    payment_id: {
        type: String,
        required: true,
    },
    plan_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },

    created_at: {
        type: Date,
        default: new Date()
    },
})

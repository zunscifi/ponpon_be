import * as mongoose from 'mongoose'

export const planSchema = new mongoose.Schema({
    type: {
        type: String,
        default: ''
    },
    date: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },

    content: {
        type: String,
        default: ''
    },

    description: {
        type: String,
        default: ''
    },
})

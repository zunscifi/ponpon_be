import * as mongoose from 'mongoose'

export const logSchema = new mongoose.Schema({
    ip: String,
    method: String,
    url: String,
    body: Object,
    isWhitelisted: Boolean,
    timestamp: {
        type: Date,
        default: Date.now,
        expires: '60d',
    },
});
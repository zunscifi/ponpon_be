import * as mongoose from 'mongoose'

const logSchema = new mongoose.Schema({
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

export const LogModel = mongoose.model('Log', logSchema);
import { Document } from 'mongoose'
export interface Notification extends Document {
    user_id: string,
    app_id: string,
    text: string,
    title: string,
    time: Date,
}

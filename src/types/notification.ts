import { Document } from 'mongoose'
import { User } from './user';
export interface Notification extends Document {
    user_id: User,
    text: string,
    title: string,
    time: Date,
}

import { Document } from 'mongoose'
import { Plan } from './plan'
export interface Order extends Document {
    id: string,
    plan_id: Plan,
    user_id: string,
    status: string,
    created_at: Date,
}
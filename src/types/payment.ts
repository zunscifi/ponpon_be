import { Document } from 'mongoose'
import { Plan } from './plan'
export interface Payment extends Document {
    payment_id: string,
    plan_id: Plan,
    user_id: string,
    created_at: Date,
}

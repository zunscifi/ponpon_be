import { Document } from 'mongoose'
export interface Plan extends Document {
    type: string,
    price: number,
    content: string,
    description: string,
}

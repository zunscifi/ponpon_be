import { Document } from 'mongoose'
export interface Plan extends Document {
    id: string,
    date: number,
    type: string,
    price: number,
    content: string,
    description: string,
}

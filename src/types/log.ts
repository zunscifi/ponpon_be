
import { Document } from 'mongoose'
export interface Log extends Document {
    ip: string,
    method: string,
    url: string,
    body: any,
    isWhitelisted: boolean,
    timestamp: any,
}

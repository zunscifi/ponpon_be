import { Document } from 'mongoose'
export interface User extends Document {
  user_id: string,
  full_name: string,
  card_id: string,
  email: string,
  password: string,
  phone_number: string,
  address: string,
  role: string,
  is_locked: boolean,
  expire_date: Date,
  is_fill_info: boolean,
  invite_code: string,
  refresh_token: string,
  created_date: Date,
  updated_date: Date,
  updated_token: string
}

import * as mongoose from 'mongoose'
import { UserRole } from 'src/enums/role.enum'

export const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },

  full_name: {
    type: String,
    required: true,
  },
  card_id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  phone_number: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  },
  is_locked: {
    type: Boolean,
    default: false,
  },
  expire_date: {
    type: Date,
    default: () => {
      const today = new Date();
      today.setDate(today.getDate() + 7);
      return today;
    },
  },

  is_fill_info: {
    type: Boolean,
    default: false,
  },

  invite_code: {
    type: String,
    default: null,
  },

  refresh_token: {
    type: String,
    default: null,
  },

  created_date: {
    type: Date,
    default: Date.now,
  },

  updated_date: {
    type: Date,
    default: '',
  },

  updated_token: {
    type: String,
    default: '',
  },
})

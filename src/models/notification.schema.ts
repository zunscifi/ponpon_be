import * as mongoose from 'mongoose'

export const notificationSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },

  text: {
    type: String,
    default: ''
  },

  title: {
    type: String,
    default: ''
  },

  time: {
    type: Date,
    default: new Date(),
  },
})

import * as mongoose from 'mongoose';

export const BookingSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  name: String,
  date: Date,
  hairdresser: String,
  status: String,
});

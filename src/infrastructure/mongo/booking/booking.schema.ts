import * as mongoose from 'mongoose';

export const BookingSchema = new mongoose.Schema({
  name: String,
  date: Date,
  hairdresser: String,
  status: String,
});

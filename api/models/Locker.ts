import mongoose, { Schema, Document } from "mongoose";

export interface ILocker extends Document {
  name: string;
}

const LockerSchema: Schema = new Schema({
  name: { type: String, required: true },
});

export default mongoose.model<ILocker>("Locker", LockerSchema);

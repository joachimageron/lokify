import mongoose, { Schema, Document } from "mongoose";

export type LockerSize = "small" | "medium" | "large";
export interface ILocker extends Document<string> {
  lockerNumber: number;
  number: number;
  size: LockerSize;
  status: "available" | "reserved" | "expired";
  price: number;
  reservedBy?: mongoose.Types.ObjectId | null;
  reservationStart?: Date | null;
  reservationEnd?: Date | null;
  reminderSent?: boolean;
}

const LockerSchema = new Schema<ILocker>({
  number: { type: Number, required: true, unique: true },
  reminderSent: { type: Boolean, default: false },
  size: { type: String, enum: ["small", "medium", "large"], required: true },
  status: {
    type: String,
    enum: ["available", "reserved", "expired"],
    default: "available",
  },
  price: { type: Number, required: true },
  reservedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  reservationStart: { type: Date, default: null },
  reservationEnd: { type: Date, default: null },
});

export default mongoose.model<ILocker>("Locker", LockerSchema);

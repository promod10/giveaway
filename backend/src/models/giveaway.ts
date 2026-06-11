import mongoose, { Schema, Document } from 'mongoose';

export interface IGiveaway extends Document {
  platform: string;
  postUrl: string;
  winnersCount: number;
  winners: string[];
  createdAt: Date;
}

const GiveawaySchema: Schema = new Schema({
  platform: { type: String, required: true },
  postUrl: { type: String, required: true },
  winnersCount: { type: Number, required: true },
  winners: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IGiveaway>('Giveaway', GiveawaySchema);
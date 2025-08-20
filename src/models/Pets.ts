import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IPet extends Document {
  userId: string;
  name: string;
  breed: string;
  age: number;
  photoUrl?: string;
}

const PetSchema = new Schema<IPet>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  photoUrl: { type: String },
});

// Check if model already exists (to avoid recompilation errors in dev)
const Pet = models.Pet || model<IPet>('Pet', PetSchema);

export default Pet;

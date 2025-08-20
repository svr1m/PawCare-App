import mongoose from 'mongoose';

const BreedTipsSchema = new mongoose.Schema({
  breed: { type: String, unique: true },
  tips: [String],
}, { timestamps: true });

export default mongoose.models.BreedTips || mongoose.model('BreedTips', BreedTipsSchema);

import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    // Predefined category plus 'Other'
    category: { type: String, enum: ['Road', 'Water', 'Power', 'Waste', 'Other'], required: true },
    // When category is 'Other', allow a custom label to be saved
    customCategory: { type: String },
    urgency: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    imageUrl: { type: String },
    imagePublicId: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // AI placeholders
    predictedCategory: { type: String },
    predictedSeverity: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);



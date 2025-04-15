const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: '' },
    topic: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Blog', BlogSchema);

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: String,
  // Поле для хранения идентификатора создателя события
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['registered', 'checked-in'], default: 'registered' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);

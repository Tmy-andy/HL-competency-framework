const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  level: {
    type: String,
    enum: ['entry', 'intermediate', 'senior', 'management'],
    required: true
  },
  requiredCompetencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competency'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Position', positionSchema);

const mongoose = require('mongoose');

const competencySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  nameVi: {
    type: String,
    required: true
  },
  definition: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  level1: String,
  level2: String,
  level3: String,
  level4: String,
  evidence: String,
  trainingMethod: String,
  applicablePositions: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Competency', competencySchema);

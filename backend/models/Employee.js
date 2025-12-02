const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: String,
  position: {
    type: String,
    required: true,
    enum: ['AP', 'B', 'MB', 'SL', 'Crew Leader']
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  hireDate: {
    type: Date,
    required: true
  },
  department: String,
  status: {
    type: String,
    enum: ['active', 'inactive', 'terminated'],
    default: 'active'
  },
  currentLevel: {
    type: Number,
    min: 1,
    max: 4
  },
  lastAssessmentDate: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);

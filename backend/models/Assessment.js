const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  evaluator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessmentDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  competencyRatings: [{
    competency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competency',
      required: true
    },
    competencyId: String,
    competencyName: String,
    ratedLevel: {
      type: String,
      enum: ['Critical', 'Low', 'Medium', 'High'],
      required: true
    },
    levelNumber: {
      type: Number,
      min: 1,
      max: 4,
      required: true
    },
    comment: String
  }],
  overallScore: {
    type: Number,
    min: 1,
    max: 4
  },
  classification: {
    type: String,
    enum: ['CRITICAL', 'LOW', 'MEDIUM', 'HIGH']
  },
  status: {
    type: String,
    enum: ['draft', 'completed', 'reviewed'],
    default: 'completed'
  },
  notes: String
}, {
  timestamps: true
});

// Calculate overall score and classification before saving
assessmentSchema.pre('save', function(next) {
  if (this.competencyRatings && this.competencyRatings.length > 0) {
    // Calculate average score
    const sum = this.competencyRatings.reduce((acc, rating) => acc + rating.levelNumber, 0);
    this.overallScore = sum / this.competencyRatings.length;

    // Determine classification based on average
    if (this.overallScore >= 1.0 && this.overallScore <= 1.5) {
      this.classification = 'CRITICAL';
    } else if (this.overallScore > 1.5 && this.overallScore <= 2.5) {
      this.classification = 'LOW';
    } else if (this.overallScore > 2.5 && this.overallScore <= 3.5) {
      this.classification = 'MEDIUM';
    } else if (this.overallScore > 3.5 && this.overallScore <= 4.0) {
      this.classification = 'HIGH';
    }
  }
  next();
});

module.exports = mongoose.model('Assessment', assessmentSchema);

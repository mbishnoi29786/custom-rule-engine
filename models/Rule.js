const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
  field: { type: String, required: true },
  operator: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }, // Ensuring value is required
});

const actionSchema = new mongoose.Schema({
  actionType: { type: String, required: true },   // Use actionType for clarity
  parameters: { type: mongoose.Schema.Types.Mixed }, // Store action parameters as an object
});

const ruleSchema = new mongoose.Schema({
  ruleName: { type: String, required: true },       // Renamed for clarity
  description: { type: String },                     // Added description field
  conditions: [conditionSchema],
  logic: { type: String, default: "AND" },          // Logical operator
  actions: [actionSchema],
  isEnabled: { type: Boolean, default: true },      // Changed to isEnabled for consistency
  createdAt: { type: Date, default: Date.now },     // Timestamp
});

const Rule = mongoose.model('Rule', ruleSchema);
module.exports = Rule;

const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
  field: { type: String, required: true },
  operator: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }, // Ensuring value is required
});

const actionSchema = new mongoose.Schema({
  actionType: { type: String, required: true },   // Used actionType for clarity
  parameters: { type: mongoose.Schema.Types.Mixed }, // will store action parameters as an object
});

const ruleSchema = new mongoose.Schema({
  ruleName: { type: String, required: true },       
  description: { type: String },                    
  conditions: [conditionSchema],
  logic: { type: String, default: "AND" },          // Logical operator
  actions: [actionSchema],
  isEnabled: { type: Boolean, default: true },      
  createdAt: { type: Date, default: Date.now },     // Timestamp
});

const Rule = mongoose.model('Rule', ruleSchema);
module.exports = Rule;

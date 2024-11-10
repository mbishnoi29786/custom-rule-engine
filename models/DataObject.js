const mongoose = require('mongoose');

const dataObjectSchema = new mongoose.Schema({
    name: { type: String, required: true },  
    age: { type: Number },                   
    type: { type: String },                  
    createdAt: { type: Date, default: Date.now },
});

const DataObject = mongoose.model('DataObject', dataObjectSchema);
module.exports = DataObject;

const express = require('express');
const router = express.Router();
const DataObject = require('../models/DataObject');

// Create a new data object
router.post('/', async (req, res) => {
    try 
    {
        const dataObject = new DataObject(req.body);
        await dataObject.save();
        res.status(201).json(dataObject);
    } 
    catch (error) 
    {
        res.status(400).json({ message: error.message });
    }
    });

// Get all data objects
router.get('/', async (req, res) => {
    try 
    {
        const dataObjects = await DataObject.find();
        res.json(dataObjects);
    } 
    catch (error) 
    {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { evaluateObjectsAgainstRules } = require('../services/ruleEvaluator');
const Rule = require('../models/Rule');
const validateIdMiddleware = require('../middlewares/validateId');

// Route to evaluate objects against enabled rules
router.post('/evaluate', async (req, res, next) => {
    try {
        const { objects } = req.body;

        // Validate input
        if (!Array.isArray(objects) || objects.length === 0) {
            return res.status(400).json({ message: "Invalid input: 'objects' should be a non-empty array." });
        }

        // Retrieve all enabled rules
        const rules = await Rule.find({ isEnabled: true });
        if (rules.length === 0) {
            return res.status(404).json({ message: "No enabled rules found." });
        }

        // Evaluate objects against enabled rules
        const matchingObjects = evaluateObjectsAgainstRules(objects, rules);

        res.status(200).json({ matchingObjects });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while evaluating objects', error: error.message });
    }
});



// Create a new rule
router.post('/', async (req, res, next) => {
    try {
        const { ruleName, description, conditions, actions, isEnabled = true } = req.body;  // Default isEnabled to true if not specified

        // Basic validation for required fields
        if (!ruleName || typeof ruleName !== 'string' || !ruleName.trim()) {
            return res.status(400).json({ message: "Rule name is required and must be a non-empty string." });
        }
        if (!Array.isArray(conditions) || conditions.length === 0) {
            return res.status(400).json({ message: "Conditions must be a non-empty array." });
        }
        if (!Array.isArray(actions) || actions.length === 0) {
            return res.status(400).json({ message: "Actions must be a non-empty array." });
        }

        // Check if a rule with the same name already exists
        const existingRule = await Rule.findOne({ ruleName: ruleName.trim() });
        if (existingRule) {
            return res.status(409).json({ message: "A rule with the same name already exists." });
        }

        // Create and save the new rule
        const newRule = new Rule({
            ruleName: ruleName.trim(),
            description,
            conditions,
            actions,
            isEnabled,
        });
        await newRule.save();

        res.status(201).json({ message: "Rule created successfully", rule: newRule });
    } catch (error) {
        next(error);
    }
});

// Create multiple rules
router.post('/bulk', async (req, res, next) => {
    try {
        const rulesData = req.body.rules; // Expect an array of rule objects

        if (!Array.isArray(rulesData) || rulesData.length === 0) {
            return res.status(400).json({ message: "Rules must be provided as a non-empty array." });
        }

        const results = [];
        const errors = [];

        for (const ruleData of rulesData) {
            const { ruleName, description, conditions, actions, isEnabled = true } = ruleData;

            // Validate input fields
            if (!ruleName || typeof ruleName !== 'string' || ruleName.trim() === '') {
                errors.push({ ruleData, message: "Rule name is required and must be a non-empty string." });
                continue;
            }
            if (!Array.isArray(conditions) || conditions.length === 0) {
                errors.push({ ruleData, message: "Conditions must be a non-empty array." });
                continue;
            }
            if (!Array.isArray(actions) || actions.length === 0) {
                errors.push({ ruleData, message: "Actions must be a non-empty array." });
                continue;
            }

            // Check if a rule with the same name exists
            const existingRule = await Rule.findOne({ ruleName });
            if (existingRule) {
                errors.push({ ruleData, message: "A rule with the same name already exists." });
                continue;
            }

            const newRule = new Rule({
                ruleName,
                description,
                conditions,
                actions,
                isEnabled,
            });
            await newRule.save();
            results.push(newRule);
        }

        res.status(201).json({
            message: "Bulk rule creation completed",
            createdRules: results,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        next(error);
    }
});

// Get all enabled rules
router.get('/enabledRules', async (req, res) => {
    try {
        const enabledRules = await Rule.find({ isEnabled: true }); // Use isEnabled
        res.json(enabledRules);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching enabled rules' });
    }
});

// Read all rules with optional filtering, pagination, and selective field retrieval
router.get('/', async (req, res, next) => {
    try {
        const { ruleName, isEnabled, page = 1, limit = 10 } = req.query;

        // Build filter criteria
        const filter = {};
        if (ruleName) filter.ruleName = new RegExp(ruleName, 'i'); // Case-insensitive regex match
        if (isEnabled !== undefined) filter.isEnabled = isEnabled === 'true'; // Use isEnabled

        // Convert pagination to integers
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        // Validate pagination inputs
        if (pageNum <= 0 || limitNum <= 0) {
            return res.status(400).json({ message: "Page and limit must be positive integers." });
        }

        // Retrieve rules with filtering, pagination, and field selection
        const rules = await Rule.find(filter)
            .select('ruleName description conditions actions isEnabled') // Updated field selection
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        const totalRules = await Rule.countDocuments(filter); // Get total count for pagination

        res.status(200).json({
            total: totalRules,
            page: pageNum,
            limit: limitNum,
            rules: rules,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});


// Update a rule
router.put('/:id', validateIdMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if the rule exists
        const rule = await Rule.findById(id);
        if (!rule) {
            return res.status(404).json({ message: 'Rule not found' });
        }

        // Validate the fields before updating
        if (updateData.ruleName === "" || (updateData.ruleName && typeof updateData.ruleName !== 'string')) {
            return res.status(400).json({ message: 'Rule name cannot be empty and must be a string.' });
        }

        // Only include fields that are not empty or null
        const validUpdateData = {};
        if (updateData.ruleName) validUpdateData.ruleName = updateData.ruleName.trim();
        if (updateData.description !== undefined) validUpdateData.description = updateData.description; // Allow updating to null
        if (Array.isArray(updateData.conditions)) validUpdateData.conditions = updateData.conditions; // Ensure conditions is an array
        if (Array.isArray(updateData.actions)) validUpdateData.actions = updateData.actions; // Ensure actions is an array
        if (typeof updateData.isEnabled !== 'undefined') validUpdateData.isEnabled = updateData.isEnabled; // Use isEnabled

        // Update the rule with the valid data
        const updatedRule = await Rule.findByIdAndUpdate(id, validUpdateData, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({
            message: 'Rule updated successfully',
            data: updatedRule
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while updating the rule', error: error });
    }
});

// Delete a rule
router.delete('/:id', validateIdMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the rule exists
        const rule = await Rule.findById(id);
        if (!rule) {
            return res.status(404).json({ message: "Rule not found" });
        }
    
        // Delete the rule
        await Rule.findByIdAndDelete(id); 
        res.status(200).json({ message: "Rule deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while deleting the rule', error: error });
    }
});

module.exports = router;


// // Read all rules
// router.get('/', async (req, res, next) => {
//     try {
//         const rules = await Rule.find();
//         res.status(200).json(rules);
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// });

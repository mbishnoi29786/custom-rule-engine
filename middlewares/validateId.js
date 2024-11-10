const mongoose = require('mongoose');

const validateIdMiddleware = (req, res, next) => {
    const { id } = req.params;

    // Check if the ID is a valid ObjectID
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid ID format. Please provide a valid ObjectID.' });
    }

    next();
};

module.exports = validateIdMiddleware;
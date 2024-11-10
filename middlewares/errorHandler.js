function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err); // Pass error to default handler if response has been sent
    }

    if (err.name === 'ValidationError') {
        const errors = Object.keys(err.errors).map(key => ({
            field: key,
            message: err.errors[key].message
        }));
        return res.status(400).json({ message: 'Validation Error', errors });
    }

    console.error('Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
}

module.exports = errorHandler;

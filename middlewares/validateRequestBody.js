// validateRequestBody.js
function validateRequestBody(req, res, next) {
    try {
        // Handle cases where JSON parsing failed and req.body is undefined
        if (req.headers['content-type'] === 'application/json' && req.body === undefined) {
            return res.status(400).json({ message: 'Invalid JSON format. Ensure your request body is well-formed.' });
        }
        
        // Check if the request is GET and has a body
        if (req.method === 'GET' && req.body && Object.keys(req.body).length > 0) {
            return res.status(400).json({ message: 'GET requests should not have a body' });
        }

        // Check if POST or PUT requests have an empty body
        if ((req.method === 'POST' || req.method === 'PUT') && (!req.body || Object.keys(req.body).length === 0)) {
            return res.status(400).json({ message: 'Request body cannot be empty' });
        }

        next();
    } catch (error) {
        next(error); // Forward the error to the error handler
    }
}

module.exports = validateRequestBody;

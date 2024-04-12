const jwt = require('jsonwebtoken');
require('dotenv').config();

const fetchUser = (req, res, next) => {
    try {
        const authToken = req.header('authtoken');

        if (!authToken) {
            return res.status(401).json({ error: "Authentication token missing" });
        }

        jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({ error: "Invalid authentication token" });
            }

            // Attach the user information to the request object
            req.user = user;
            next();
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};

module.exports = fetchUser;

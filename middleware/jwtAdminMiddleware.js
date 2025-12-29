const jwt = require("jsonwebtoken");

const jwtAdminMiddleware = (req, res, next) => {
    try {
        //  Check if authorization header exists
        if (!req.headers.authorization) {
            return res.status(401).json("Authorization header missing");
        }

        //  Extract token
        const token = req.headers.authorization.split(" ")[1];

        const jwtResponse = jwt.verify(token, "secretkey");

        // Attach email to request (for controllers if needed)
        req.payload = jwtResponse.email;

        //  Check admin email
        if (jwtResponse.email !== "admin@gmail.com") {
            return res.status(403).json("Admin access denied");
        }

        //  Allow request
        next();

    } catch (err) {
        return res.status(401).json("Invalid or expired token");
    }
};

module.exports = jwtAdminMiddleware;

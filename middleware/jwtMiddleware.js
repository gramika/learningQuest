const jwt = require("jsonwebtoken");

const jwtMiddleware = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json("Authorization header missing");
    }

    const token = req.headers.authorization.split(" ")[1];

    //  handle "Bearer null"
    if (!token || token === "null") {
      return res.status(401).json("Token missing");
    }

    const jwtResponse = jwt.verify(token, "secretkey");
    req.payload = jwtResponse.email;

    next();
  } catch (err) {
    return res.status(401).json("Invalid or expired token");
  }
};

module.exports = jwtMiddleware;

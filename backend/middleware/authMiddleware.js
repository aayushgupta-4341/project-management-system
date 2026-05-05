const jwt = require("jsonwebtoken");

var SECRET = "mysecretkey123";

function checkAuth(req, res, next) {
  var authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token found." });
  }

  var token = authHeader.replace("Bearer ", "");

  try {
    var decoded = jwt.verify(token, SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
}

module.exports = checkAuth;

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (looks like "Bearer eyJhbGci...")
      token = req.headers.authorization.split(" ")[1];

      // Decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user in DB and return it without password
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Move on to the next operation
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
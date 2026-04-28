const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

/* ==========================
   ADMIN LOGIN
========================== */
router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      username === process.env.ADMIN_USER &&
      password === process.env.ADMIN_PASS
    ) {
      const token = jwt.sign(
        { username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        success: true,
        message: "Login Successful",
        token,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

module.exports = router;
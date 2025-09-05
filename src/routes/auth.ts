import express from "express";
import User from "../models/User";
const router = express.Router();

// register route
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user is already exists
    const isExistingUser = await User.findOne({ email });

    if (isExistingUser) {
      return res.status(400).json({
        message:
          "user is already exists with same email! Please try again with other email",
      });
    }


    // const hashPassword = await bcrypt
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
});

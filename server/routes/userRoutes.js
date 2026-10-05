import express from "express";

import { registerUser, loginUser, getUserData, applyForJob, getUserJobApplications, updateUserResume, updateUserProfileImage } from "../controller/userController.js";

import userAuth from "../middlewares/userAuth.js";
import upload from "../config/multer.js";

const router = express.Router();

// Employee Signup
router.post("/register", registerUser);

// Employee Login
router.post("/login", loginUser);

// Get logged-in employee data
router.get("/user", userAuth, getUserData);

// Apply for a job
router.post("/apply", userAuth, applyForJob);

// Get logged-in employee's applications
router.get("/applications", userAuth, getUserJobApplications);

// Update employee resume
router.post("/update-resume", userAuth, upload.single("resume"), updateUserResume);

// Update employee profile image
router.post("/update-profile-image", userAuth, upload.single("image"), updateUserProfileImage);

export default router;

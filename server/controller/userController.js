import Job from "../models/job.js";
import JobApplication from "../models/jobApplication.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("========== EMPLOYEE SIGNUP ==========");
        console.log("Name:", name);
        console.log("Email:", email);

        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "Name, email and password are required",
            });
        }

        // Validate password
        if (password.length < 6) {
            return res.json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Check if user already exists
        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.json({
                success: false,
                message: "User already registered. Please login.",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new employee
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            image: "",
            resume: "",
        });

        console.log("Employee created:", user._id);

        // Generate JWT
        const token = generateToken(user._id.toString());

        return res.json({
            success: true,
            message: "Account created successfully",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                resume: user.resume,
            },
        });
    } catch (error) {
        console.error("Employee signup error:", error);

        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// =====================================================
// Employee Login
// =====================================================

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("========== EMPLOYEE LOGIN ==========");
        console.log("Email:", email);

        // Validate fields
        if (!email || !password) {
            return res.json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Find user
        const user = await User.findOne({
            email: normalizedEmail,
        });

        // User doesn't exist
        if (!user) {
            return res.json({
                success: false,
                message: "User not found. Please sign up first.",
            });
        }

        // Old Clerk users don't have password
        if (!user.password) {
            return res.json({
                success: false,
                message: "Please sign up first to create your account password.",
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Generate JWT
        const token = generateToken(user._id.toString());

        console.log("Employee login successful:", user._id);

        return res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                resume: user.resume,
            },
        });
    } catch (error) {
        console.error("Employee login error:", error);

        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// =====================================================
// Get Logged-in Employee Data
// =====================================================

export const getUserData = async (req, res) => {
    try {
        // JWT middleware puts user ID here
        const userId = req.userId;

        if (!userId) {
            return res.json({
                success: false,
                message: "Login required",
            });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        return res.json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Get user data error:", error);

        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// =====================================================
// Apply For Job
// =====================================================

export const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;

        // JWT middleware puts user ID here
        const userId = req.userId;

        if (!userId) {
            return res.json({
                success: false,
                message: "Please login first",
            });
        }

        if (!jobId) {
            return res.json({
                success: false,
                message: "Job ID is required",
            });
        }

        // Check if already applied
        const isAlreadyApplied = await JobApplication.findOne({
            jobId,
            userId,
        });

        if (isAlreadyApplied) {
            return res.json({
                success: false,
                message: "Already applied",
            });
        }

        // Find job
        const jobData = await Job.findById(jobId);

        if (!jobData) {
            return res.json({
                success: false,
                message: "Job not found",
            });
        }

        // Create application
        await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now(),
        });

        return res.json({
            success: true,
            message: "Applied successfully",
        });
    } catch (error) {
        console.error("Apply job error:", error);

        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// =====================================================
// Get User Applied Jobs
// =====================================================

export const getUserJobApplications = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.json({
                success: false,
                message: "Please login first",
            });
        }

        const applications = await JobApplication.find({
            userId,
        })
            .populate("companyId", "name email image")
            .populate("jobId", "title description location category level salary")
            .exec();

        return res.json({
            success: true,
            applications,
        });
    } catch (error) {
        console.error("Get user applications error:", error);

        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// =====================================================
// Update User Resume
// =====================================================

export const updateUserResume = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.json({
                success: false,
                message: "Please login first",
            });
        }

        const resumeFile = req.file;

        if (!resumeFile) {
            return res.json({
                success: false,
                message: "Resume file is required",
            });
        }

        const userData = await User.findById(userId);

        if (!userData) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        // Upload resume to Cloudinary
        const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);

        userData.resume = resumeUpload.secure_url;

        await userData.save();

        return res.json({
            success: true,
            message: "Resume Updated",
            resume: userData.resume,
        });
    } catch (error) {
        console.error("Update resume error:", error);

        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// =====================================================
// Update User Profile Image
// =====================================================

export const updateUserProfileImage = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.json({
                success: false,
                message: "Please login first",
            });
        }

        const imageFile = req.file;

        if (!imageFile) {
            return res.json({
                success: false,
                message: "Profile image is required",
            });
        }

        const userData = await User.findById(userId);

        if (!userData) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        // Upload profile image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            folder: "insiderjobs/profile-images",
            resource_type: "image",
        });

        // Save Cloudinary URL in MongoDB
        userData.image = imageUpload.secure_url;

        await userData.save();

        return res.json({
            success: true,
            message: "Profile image updated successfully",
            image: userData.image,
        });
    } catch (error) {
        console.error("Update profile image error:", error);

        return res.json({
            success: false,
            message: error.message,
        });
    }
};

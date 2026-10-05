import express from "express";
import { ChangeJobApplicationStatus, changeVisibilty, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from "../controller/companyController.js";
import upload from "../config/multer.js";
import { protectCompany } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Register a company
router.post("/register", upload.single("image"), registerCompany);

// Company login
router.post("/login", loginCompany);

// Get company data
router.get("/company", protectCompany, getCompanyData);

// Post a job
router.post("/post-job", protectCompany, postJob);

// Get Applicants data of company
router.get("/applicants", protectCompany, getCompanyJobApplicants);

// Get company job lists
router.get("/list-jobs", protectCompany, getCompanyPostedJobs);

// Change application status
router.post("/change-status", protectCompany, ChangeJobApplicationStatus);

// Change applications visibilty
router.post("/change-visibility", protectCompany, changeVisibilty);

export default router;

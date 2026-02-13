import express from "express";
import upload from "../middleware/upload.js";
import {
    signup,
    login,
    setRole,
    saveStudentDetails,
    saveCompanyDetails,
} from "../controllers/authController.js";
import { getCompanyProfile } from "../controllers/companyController.js"; 
import { protect } from "../middleware/authMiddleware.js";

import { Company } from "../models/User.js"; 

const router = express.Router();

// ---------------- AUTH ROUTES ----------------
router.post("/signup", signup);
router.post("/login", login);
router.post("/role", setRole);

// ---------------- STUDENT ROUTE ----------------
router.post("/details/student", upload.single("resumeFile"), saveStudentDetails);

// ---------------- COMPANY ROUTE ----------------
router.post(
    "/details/company",
    upload.fields([
        { name: "companyLogo", maxCount: 1 },
        { name: "companyDocument", maxCount: 1 },
    ]),
    saveCompanyDetails
);
router.get("/profile/company", protect, getCompanyProfile);
// update company 
router.post("/details/company", protect, async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        if (!userId) return res.status(400).json({ message: "Invalid user in token" });

        let company = await Company.findOne({ user: userId });
        if (!company) return res.status(404).json({ message: "Company not found" });

        const {
            email,
            companyName,
            website,
            companyType,
            location,
            contactPerson,
            contactPhone,
            description
        } = req.body;

        if (!email) return res.status(400).json({ message: "Email is required" });

        company.email = email ?? company.email;
        company.companyName = companyName ?? company.companyName;
        company.website = website ?? company.website;
        company.companyType = companyType ?? company.companyType;
        company.location = location ?? company.location;
        company.contactPerson = contactPerson ?? company.contactPerson;
        company.contactPhone = contactPhone ?? company.contactPhone;
        company.description = description ?? company.description;

        await company.save();

        const updatedCompany = await Company.findById(company._id);

        res.json({ message: "Company updated successfully", company: updatedCompany });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});



export default router;
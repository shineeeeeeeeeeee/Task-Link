import User, { Company } from "../models/User.js";

// company profile for logged-in recruiter
export const getCompanyProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const company = await Company.findOne({ user: userId }).populate("user", "email");
    if (!company) return res.status(404).json({ message: "Company profile not found" });

    return res.json({
      company: {
        companyName: company.companyName,
        companyType: company.companyType,
        contactPerson: company.contactPerson,
        contactPhone: company.contactPhone,
        description: company.description,
        website: company.website,
        location: company.location,
        logoPath: company.logoPath,
        docPath: company.docPath,
        email: company.user.email 
      }
    });
  } catch (err) {
    console.error("getCompanyProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

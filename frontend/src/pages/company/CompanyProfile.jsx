// src/pages/company/CompanyProfile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
    Globe,
    MapPin,
    Briefcase,
    User,
    Phone,
    Mail,
    FileText,
    Edit2,
    X,
    CheckCircle,
    ExternalLink,
    Download,
    LayoutDashboard,
    Users,
    UserCheck,
    HelpCircle,
    ArrowLeft
} from "lucide-react";
import "../../pages/company/CompanyProfile.css";
import "../../pages/company/CompanyDashboard.css";
import logo from "../../assets/logo.svg";

export default function CompanyProfile() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { companyId } = useParams();
    // console.log("---->", companyId);

    const STORAGE_KEY = `tasklink_company_profile_${companyId}`;

    const DEFAULT_PROFILE = {
        companyName: "TechFlow Solutions",
        companyWebsite: "www.techflow.io",
        companyIndustry: "Software Development",
        location: "Bangalore, India",
        contactPersonName: "Siddharth Verma",
        phoneNumber: "+91 98765 43210",
        aboutCompany: "TechFlow Solutions is a leading software development company specializing in cloud-native applications and AI-driven automation tools for modern enterprises.",
        companyLogo: null,
        companyRegistrationDocument: null,
        email: "contact@techflow.io"
    };

    const [profile, setProfile] = useState(DEFAULT_PROFILE);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState(DEFAULT_PROFILE);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    // Load profile data from localStorage or state
    useEffect(() => {
        const savedProfile = localStorage.getItem(STORAGE_KEY);
        if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
        } else if (state?.companyData) {
            setProfile(state.companyData);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.companyData));
        }
    }, [state, STORAGE_KEY]);

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const handleOpenEditModal = () => {
        setFormData(profile);
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();
        setProfile(formData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        setIsEditModalOpen(false);
        showToast("Profile updated successfully!");
    };

    // Calculate completeness
    const calculateCompleteness = () => {
        const fields = [
            'companyName', 'companyWebsite', 'companyIndustry', 'location',
            'contactPersonName', 'phoneNumber', 'aboutCompany'
        ];
        const filledFields = fields.filter(field => profile[field] && profile[field].trim() !== "");
        // Just count mandatory texts for now, adding logic for files if needed
        let score = filledFields.length;
        if (profile.companyLogo) score += 1;
        if (profile.companyRegistrationDocument) score += 1;

        return Math.round((score / (fields.length + 2)) * 100);
    };

    const completeness = calculateCompleteness();

    return (
        <div className="dashboard-wrapper">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`toast-message ${toast.type}`}>
                    {toast.message}
                </div>
            )}

            {/* HEADER (Reused from Dashboard) */}
            <header className="dashboard-header">
                <div className="header-container">
                    <div className="header-brand" onClick={() => navigate(`/c/${companyId}`)} style={{ cursor: 'pointer' }}>
                        <img src={logo} alt="TaskLink" className="brand-logo" />
                        <h1 className="brand-name">Profile</h1>
                    </div>
                    <div className="header-actions">
                        <button className="btn-create" onClick={() => navigate(`/c/${companyId}`)}>
                            <ArrowLeft size={18} />
                            <span>Back to Dashboard</span>
                        </button>
                        <div className="user-profile">
                            <div className="user-avatar">
                                {profile.companyName?.charAt(0) || "C"}
                            </div>
                            <div className="user-details">
                                <span className="user-name">{profile.companyName}</span>
                                <span className="user-role">Company Admin</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="dashboard-layout">
                {/* Sidebar Nav (Reused) */}
                <aside className="dashboard-sidebar">
                    <nav className="sidebar-nav">
                        <button className="nav-item" onClick={() => navigate(`/c/${companyId}`)}>
                            <LayoutDashboard size={20} />
                            <span>My Postings</span>
                        </button>
                        <button className="nav-item">
                            <Users size={20} />
                            <span>Applicants</span>
                        </button>
                        <button className="nav-item">
                            <UserCheck size={20} />
                            <span>Shortlisted</span>
                        </button>
                        <div className="nav-divider"></div>
                        <button className="nav-item active">
                            <User size={20} />
                            <span>Company Profile</span>
                        </button>
                        <button className="nav-item">
                            <HelpCircle size={20} />
                            <span>Help Center</span>
                        </button>
                    </nav>

                    <div className="company-mini-card">
                        <div className="mini-avatar">🏢</div>
                        <div className="mini-info">
                            <h4>{profile.companyName}</h4>
                            <p>{profile.email || "admin@tasklink.com"}</p>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="dashboard-content">
                    <div className="profile-container">

                        {/* Top Profile Card */}
                        <section className="profile-hero-card">
                            <div className="hero-content">
                                <div className="profile-logo-container">
                                    {profile.companyLogo ? (
                                        <img src={URL.createObjectURL(profile.companyLogo)} alt="Logo" />
                                    ) : (
                                        <div className="logo-placeholder">
                                            {profile.companyName?.charAt(0) || "🏢"}
                                        </div>
                                    )}
                                </div>
                                <div className="hero-details">
                                    <div className="name-row">
                                        <h2>{profile.companyName}</h2>
                                        <span className="verified-badge">
                                            <CheckCircle size={14} /> Verified
                                        </span>
                                    </div>
                                    <p className="hero-industry">
                                        <Briefcase size={14} /> {profile.companyIndustry}
                                    </p>
                                    <div className="hero-meta">
                                        <span><Globe size={14} /> <a href={`https://${profile.companyWebsite}`} target="_blank" rel="noreferrer">{profile.companyWebsite}</a></span>
                                        <span><MapPin size={14} /> {profile.location}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="hero-actions">
                                <button className="btn-edit-profile" onClick={handleOpenEditModal}>
                                    <Edit2 size={16} /> Edit Profile
                                </button>
                            </div>
                        </section>

                        {/* Completeness Bar */}
                        <section className="completeness-section">
                            <div className="completeness-header">
                                <span>Profile Completeness</span>
                                <span>{completeness}%</span>
                            </div>
                            <div className="progress-bar-bg">
                                <div className="progress-bar-fill" style={{ width: `${completeness}%` }}></div>
                            </div>
                        </section>

                        <div className="profile-grid">
                            {/* Left Column: About & Basic Info */}
                            <div className="profile-col-main">
                                <div className="profile-info-card">
                                    <h3><FileText size={18} /> About Company</h3>
                                    <p className="about-text">{profile.aboutCompany}</p>
                                </div>

                                <div className="profile-info-card">
                                    <h3><Briefcase size={18} /> Company Details</h3>
                                    <div className="details-list">
                                        <div className="detail-item">
                                            <label>Industry Type</label>
                                            <span>{profile.companyIndustry}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Website</label>
                                            <span className="link">{profile.companyWebsite}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Headquarters</label>
                                            <span>{profile.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Contact & Documents */}
                            <div className="profile-col-side">
                                <div className="profile-info-card">
                                    <h3><User size={18} /> Contact Person</h3>
                                    <div className="details-list">
                                        <div className="detail-item">
                                            <label>Name</label>
                                            <span>{profile.contactPersonName}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Phone Number</label>
                                            <span>{profile.phoneNumber}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Email Address</label>
                                            <span>{profile.email || "admin@tasklink.com"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="profile-info-card">
                                    <h3><FileText size={18} /> Official Documents</h3>
                                    <div className="document-list">
                                        <div className="doc-item">
                                            <div className="doc-icon pdf">PDF</div>
                                            <div className="doc-info">
                                                <p>Registration Document</p>
                                                <span>Verified • {new Date().toLocaleDateString()}</span>
                                            </div>
                                            <button className="doc-btn" title="Download">
                                                <Download size={16} />
                                            </button>
                                        </div>
                                        <div className="doc-item">
                                            <div className="doc-icon img">PNG</div>
                                            <div className="doc-info">
                                                <p>Company Logo</p>
                                                <span>Primary Brand Asset</span>
                                            </div>
                                            <button className="doc-btn" title="View">
                                                <ExternalLink size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* EDIT PROFILE MODAL */}
            {isEditModalOpen && (
                <div className="modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
                    <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit Company Profile</h2>
                            <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form className="modern-form" onSubmit={handleSaveChanges}>
                            <div className="form-grid">
                                <div className="field-group span-2">
                                    <label>Company Name</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="field-group">
                                    <label>Website URL</label>
                                    <input
                                        type="text"
                                        name="companyWebsite"
                                        value={formData.companyWebsite}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="field-group">
                                    <label>Industry</label>
                                    <input
                                        type="text"
                                        name="companyIndustry"
                                        value={formData.companyIndustry}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="field-group">
                                    <label>Headquarters Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="field-group">
                                    <label>Contact Person Name</label>
                                    <input
                                        type="text"
                                        name="contactPersonName"
                                        value={formData.contactPersonName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="field-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="field-group span-2">
                                    <label>About Company</label>
                                    <textarea
                                        name="aboutCompany"
                                        rows="4"
                                        value={formData.aboutCompany}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-ghost" onClick={() => setIsEditModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

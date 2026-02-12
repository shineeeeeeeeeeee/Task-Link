import Job from "../models/Job.js";

export const createJob = async (req, res) => {
  try {
    const recruiterId = req.user?.id;
    if (!recruiterId) return res.status(401).json({ message: "Unauthorized" });

    const { title, location, duration, stipend, description, skills } = req.body;
    if (!title || !location || !duration || !description)
      return res.status(400).json({ message: "Missing required fields" });

    const skillsArr = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const job = await Job.create({
      title,
      location,
      duration,
      stipend,
      description,
      skills: skillsArr,
      recruiter: recruiterId,
    });

    return res.status(201).json({ message: "Job created", job });
  } catch (err) {
    console.error("createJob error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const recruiterId = req.user?.id;
    if (!recruiterId) return res.status(401).json({ message: "Unauthorized" });

    const jobs = await Job.find({ recruiter: recruiterId }).sort({ createdAt: -1 });
    return res.json({ jobs });
  } catch (err) {
    console.error("getMyJobs error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateJob = async (req, res) => {
  try {
    const recruiterId = req.user?.id;
    if (!recruiterId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const { title, location, duration, stipend, description, skills } = req.body;

    const skillsArr = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined;

    const update = { title, location, duration, stipend, description };
    if (skillsArr) update.skills = skillsArr;

    const job = await Job.findOneAndUpdate({ _id: id, recruiter: recruiterId }, { $set: update }, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });

    return res.json({ message: "Job updated", job });
  } catch (err) {
    console.error("updateJob error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const toggleStatus = async (req, res) => {
  try {
    const recruiterId = req.user?.id;
    if (!recruiterId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const job = await Job.findOne({ _id: id, recruiter: recruiterId });
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.status = job.status === "Open" ? "Closed" : "Open";
    await job.save();

    return res.json({ message: "Status updated", job });
  } catch (err) {
    console.error("toggleStatus error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const recruiterId = req.user?.id;
    if (!recruiterId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const job = await Job.findOneAndDelete({ _id: id, recruiter: recruiterId });
    if (!job) return res.status(404).json({ message: "Job not found" });

    return res.json({ message: "Job deleted" });
  } catch (err) {
    console.error("deleteJob error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "open" }); // to be check later
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOpenJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Open" })
      .populate("recruiter", "name company")
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

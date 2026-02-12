import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createJob,
  getMyJobs,
  updateJob,
  toggleStatus,
  deleteJob,
  getOpenJobs
} from "../controllers/jobController.js";

const router = express.Router();

/* ---------- PUBLIC ROUTE (STUDENTS) ---------- */
router.get("/open", getOpenJobs);

/* ---------- PROTECTED ROUTES (RECRUITERS) ---------- */
router.use(protect);

router.post("/", createJob);
router.get("/mine", getMyJobs);
router.put("/:id", updateJob);
router.patch("/:id/status", toggleStatus);
router.delete("/:id", deleteJob);

export default router;

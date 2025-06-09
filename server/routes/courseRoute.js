import express from "express";
import {
  getAllCourses,
  getCourseId,
  getDashboardStats,
  deleteCourse,
  updateCourse
} from "../controllers/courseControlle.js";
import { verifyAdmin, verifyEducatorOrAdmin } from "../middlewares/authMiddleware.js";

const courseRouter = express.Router();

// GET all courses
courseRouter.get('/all', getAllCourses);

// GET single course by ID
courseRouter.get('/:id', getCourseId);

// DELETE a course (admin only)
courseRouter.delete('/:id', verifyAdmin, deleteCourse);

// ADMIN dashboard stats
courseRouter.get('/admin/stats', verifyAdmin, getDashboardStats);

courseRouter.put('/:id', verifyEducatorOrAdmin, updateCourse);


export default courseRouter;

import express from "express"
import { getAllCourses, getCourseId } from "../controllers/courseControlle.js"
import { deleteCourse } from "../controllers/courseControlle.js"
import { verifyAdmin } from "../middlewares/authMiddleware.js"

const courseRouter = express.Router()

courseRouter.get('/all',getAllCourses)
courseRouter.get('/:id',getCourseId)



// DELETE /api/course/:id
courseRouter.delete("/course/:id", verifyAdmin, deleteCourse);

export default courseRouter
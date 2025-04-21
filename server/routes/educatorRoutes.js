// import express from 'express'
// import { addCourse, educaotorDashBoardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator } from '../controllers/educatorController.js'
// import { protectEducator } from '../middlewares/authMiddleware.js'
// import upload from '../configs/multer.js'

// const educatorRouter = express.Router()

// //Add Educator Role
// educatorRouter.get('/update-role' , updateRoleToEducator)
// educatorRouter.post('/add-course',upload.single('image'),protectEducator,addCourse)
// educatorRouter.get('/courses',protectEducator , getEducatorCourses)
// educatorRouter.get('/dashboard',protectEducator , educaotorDashBoardData)
// educatorRouter.get('/enrolled-students',protectEducator , getEnrolledStudentsData)

// export default educatorRouter



import express from 'express';
import {
  addCourse,
  educaotorDashBoardData,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateRoleToEducator,
  deleteCourse, // ✅ new import
} from '../controllers/educatorController.js';
import { protectEducator } from '../middlewares/authMiddleware.js';
import upload from '../configs/multer.js';

const educatorRouter = express.Router();

educatorRouter.get('/update-role', updateRoleToEducator);
educatorRouter.post('/add-course', upload.single('image'), protectEducator, addCourse);
educatorRouter.get('/courses', protectEducator, getEducatorCourses);
educatorRouter.get('/dashboard', protectEducator, educaotorDashBoardData);
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData);
educatorRouter.delete('/course/:courseId', protectEducator, deleteCourse); // ✅ new route

export default educatorRouter;

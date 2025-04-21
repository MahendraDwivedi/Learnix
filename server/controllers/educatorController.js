// import {clerkClient} from '@clerk/express'
// import Course from '../models/Course.js'
// import  { v2 as cloudinary}from 'cloudinary'
// import { Purchase } from '../models/Purchase.js'
// import User from '../models/User.js'
// //update tole to edcator
// export const updateRoleToEducator = async (req,res)=>{
//     try {
//         const userId = req.auth.userId

//         await clerkClient.users.updateUserMetadata(userId,{
//             publicMetadata:{
//                 role:'educator',
//             }
//         })

//         res.json({success: true,message:'you can publish a course now'})
//     } catch (error) {
//         res.json({success:false , message:error.message})
//     }
// }

// // add new course 

// export const addCourse = async (req,res)=>{
//     try{
//         const {courseData} = req.body
//         const imageFile = req.file
//         const educatorId = req.auth.userId

//         if(!imageFile){
//             return res.json({success:false,message:'Please upload a thumbnail image'})
//         }

//         const parsedCourseData = await JSON.parse(courseData)
//         parsedCourseData.educator = educatorId
//         const newCourse = await Course.create(parsedCourseData)
//         const imageUpload = await cloudinary.uploader.upload(imageFile.path)
//         newCourse.courseThumbnail = imageUpload.secure_url
//         await newCourse.save()

//         res.json({success:true,message:'course added'})
//     }
//     catch (error) {
//         res.json({success:false , message:error.message})
//     }
// }

// // get educaotor courses

// export const getEducatorCourses = async (req,res) => {
//     try {
//         const educator = req.auth.userId
//         const courses = await Course.find({educator})
//         res.json({success:true,courses})
//     } catch (error) {
//         res.json({success:false,message:error.message})
//     }
// }


// // get edudcator dashboard data (toral earning , enrolled student0s , number of courses)

// export const educaotorDashBoardData = async (req,res)=>{
//     try {
//         const educator = req.auth.userId;
//         const courses = await Course.find({educator}); 
//         const totalCourses = courses.length;
//         const courseIds = courses.map(course => course._id);

//         // calculate total earnings fro purchase
//         const purchases = await Purchase.find({
//             courseId: {$in: courseIds},
//             status: 'completed'
//         });

//         const totalEarnings = purchases.reduce((acc, purchase) => acc + purchase.amount, 0);

//         // collect unique eenrolled students ids with their course title
//         const enrolledStudentsData = [];
//         for(const course of courses){
//             const students = await User.find({
//                 _id:{$in:course.enrolledStudents}
//             },'name imageUrl');

//             students.forEach(student => {
//                 enrolledStudentsData.push({
//                     courseTitle: course.courseTitle,
//                     student
//                 });
//             });
//         } 

//         res.json({
//             success: true,
//             dashboardData: {
//                 totalEarnings,
//                 enrolledStudentsData,
//                 totalCourses
//             }
//         });
//     } catch (error) {
//         res.json({success:false,message:error.message}) 
//     }
// }


// //get enrolled students data wth pichase data

// export const getEnrolledStudentsData = async (req,res) => {
//     try {
//         const educator = req.auth.userId;
//         const courses = await Course.find({educator});
//         const courseIds = courses.map(course => course._id);

//         const purchases = await Purchase.find({
//             courseId: {$in: courseIds},
//             status: 'completed'
//         }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

//         const enrolledStudentsData = purchases.map(purchase => ({
//             student: purchase.userId,
//             courseTitle: purchase.courseId.courseTitle,
//             purchaseDate: purchase.createdAt
//         }));

//         res.json({
//             success: true,
//             enrolledStudentsData
//         });
//     } catch (error) {
//         res.json({success:false,message:error.message})   
//     }
// }




// ✅ educatorController.js

import { clerkClient } from '@clerk/express';
import Course from '../models/Course.js';
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from '../models/Purchase.js';
import User from '../models/User.js';

// Update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'educator',
      },
    });
    res.json({ success: true, message: 'You can publish a course now' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add new course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    if (!imageFile) {
      return res.json({ success: false, message: 'Please upload a thumbnail image' });
    }

    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = educatorId;
    const newCourse = await Course.create(parsedCourseData);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();

    res.json({ success: true, message: 'Course added' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get educator courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get educator dashboard data
export const educaotorDashBoardData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;
    const courseIds = courses.map(course => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed',
    });

    const totalEarnings = purchases.reduce((acc, purchase) => acc + purchase.amount, 0);

    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find({ _id: { $in: course.enrolledStudents } }, 'name imageUrl');
      students.forEach(student => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
        courses, // ✅ include courses for frontend
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get enrolled students data
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map(course => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed',
    }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

    const enrolledStudentsData = purchases.map(purchase => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.json({ success: true, enrolledStudentsData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Delete course by educator
export const deleteCourse = async (req, res) => {
  try {
    const educatorId = req.auth.userId;
    const { courseId } = req.params;

    const course = await Course.findOne({ _id: courseId, educator: educatorId });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found or unauthorized' });
    }

    await course.deleteOne();
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


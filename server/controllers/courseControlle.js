import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import { Clerk } from '@clerk/clerk-sdk-node';

//get all courses

export const  getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({isPublished: true}).select(['-courseContent','-enrolledStudents']).populate({path:'educator'});
        res.json({ success: true, courses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//get course by id

export const getCourseId = async (req, res) => { 
    const {id} = req.params;

    try {
        const courseData = await Course.findById(id).populate({path:'educator'});
        
        // remove lectureUrl if isPreviewFree is false
        courseData.courseContent.forEach((chapter) => {
            chapter.chapterConter.forEach((lecture) => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = "";
                }
            });
        });
        res.json({ success: true, courseData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const deleted = await Course.findByIdAndDelete(courseId);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// export const getDashboardStats = async (req, res) => {
//   try {
//     console.log("Fetching dashboard stats...");

//     const totalCourses = await Course.countDocuments();
//     console.log("Total courses:", totalCourses);

//     const totalStudents = await User.countDocuments({ role: "student" });
//     console.log("Total students:", totalStudents);

//     const totalEducators = await User.countDocuments({ role: "educator" });
//     console.log("Total educators:", totalEducators);

//     const totalEnrollments = await Purchase.countDocuments();
//     console.log("Total enrollments:", totalEnrollments);

//     res.status(200).json({
//       success: true,
//       stats: {
//         totalCourses,
//         totalStudents,
//         totalEducators,
//         totalEnrollments,
//       },
//     });
//   } catch (error) {
//     console.error("Error in getDashboardStats:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };



const clerk = new Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

// export const getDashboardStats = async (req, res) => {
//   try {
//     // Count students
//     const students = await clerk.users.getUserList({
//       query: '', // empty to fetch all
//       limit: 1000,
//       filter: `publicMetadata.role = ""`,
//     });
//     console.log('Students:', students);

//     // Count educators
//     const educators = await clerk.users.getUserList({
//       query: '',
//       limit: 1000,
//       filter: `publicMetadata.role = "educator"`,
//     });

//     // Count courses and enrollments from MongoDB
//     const totalCourses = await Course.countDocuments();
//     const totalEnrollments = await Purchase.countDocuments();

//     res.status(200).json({
//       success: true,
//       stats: {
//         totalCourses,
//         totalStudents: students.length,
//         totalEducators: educators.length,
//         totalEnrollments,
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching dashboard stats:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };



// Helper function to get users by role (paginated)

async function getUsersByRole(role) {
  let page = 1;
  const perPage = 100;
  let filteredUsers = [];
  while (true) {
    const users = await clerk.users.getUserList({ page, perPage });
    if (users.length === 0) break;

    let matched;
    if (role === "student") {
      matched = users.filter(user => {
        const r = user.publicMetadata?.role;
        return r === "" || r === undefined;
      });
    } else {
      matched = users.filter(user => user.publicMetadata?.role === role);
    }

    filteredUsers = filteredUsers.concat(matched);

    if (users.length < perPage) break;
    page++;
  }
  return filteredUsers;
}

export const getDashboardStats = async (req, res) => {
  try {
    const students = await getUsersByRole("student");
    const educators = await getUsersByRole("educator");

    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Purchase.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        totalStudents: students.length,
        totalEducators: educators.length,
        totalEnrollments,
        students: students.map(u => ({
          id: u.id,
          name: u.firstName + " " + u.lastName,
          email: u.emailAddresses[0]?.emailAddress || "N/A",
          imageUrl: u.profileImageUrl || "",
          role: u.publicMetadata?.role || "student",
        })),
        educators: educators.map(u => ({
          id: u.id,
          name: u.firstName + " " + u.lastName,
          email: u.emailAddresses[0]?.emailAddress || "N/A",
          imageUrl: u.profileImageUrl || "",
          role: u.publicMetadata?.role || "educator",
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const monthlyData = async (req, res) => {
  try {
    const userId = req.headers["x-clerk-user-id"];
    if (!userId) {
     return res.status(400).json({ success: false, message: "No user ID provided" });
    }

     const stats = await Purchase.aggregate([
      {
        $match: {
          status: "completed", // Only successful purchases
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 5)), // last 6 months
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalEnrollments: { $sum: 1 },
          uniqueStudents: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          month: "$_id.month",
          year: "$_id.year",
          totalEnrollments: 1,
          studentCount: { $size: "$uniqueStudents" },
          _id: 0,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    console.log(stats);
    
    res.status(200).json({ stats });
  } catch (error) {
    console.error(error);
    console.log("some error occured");
    
    res.status(500).json({ error: "Failed to fetch enrollment stats" });
  }
}

export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, message: "Course updated", course: updatedCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

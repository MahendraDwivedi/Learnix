import Course from "../models/Course.js";

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



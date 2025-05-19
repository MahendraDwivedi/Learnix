// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useUser } from "@clerk/clerk-react";
// import { toast } from 'react-toastify'

// const backendUrl = import.meta.env.VITE_BACKEND_URL; // Or your backend base URL

// export default function AdminDashboard() {
//   const { user } = useUser();
//   const [courses, setCourses] = useState([]);
//   const isAdmin = user?.publicMetadata?.role === "admin";

//   const fetchCourses = async () => {
//     try {
//       const { data } = await axios.get(`${backendUrl}/api/course/all`);
//       if (data.success) {
//         setCourses(data.courses);
//         console.log(courses)
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const deleteCourse = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this course?")) return;

//     try {
//       await axios.delete(`${backendUrl}/api/course/${id}`, {
//         headers: {
//           "x-clerk-user-id": user.id, // only if your backend uses this
//         },
//       });
//       toast.success("Course deleted");
//       fetchCourses(); // Refresh list
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//     }
//   };

//   useEffect(() => {
//     if (isAdmin) fetchCourses();
//   }, [isAdmin]);

//   if (!isAdmin) {
//     return <div className="p-4 text-red-600">You are not authorized to view this page.</div>;
//   }

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
//       {courses.length === 0 ? (
//         <p>No courses found.</p>
//       ) : (
//         courses.map((course) => (
//           <div
//             key={course._id}
//             className="border rounded-lg shadow-md p-4 mb-4 bg-white dark:bg-gray-600"
//           >
//             <div className="flex justify-between items-center mb-2">
//               <h2 className="text-xl font-semibold">{course.courseTitle}</h2>
//               <button
//                 className="bg-red-600 text-white px-3 py-1 rounded"
//                 onClick={() => deleteCourse(course._id)}
//               >
//                 Delete
//               </button>
//             </div>
//             <p className="text-gray-700 dark:text-gray-300 mb-2" dangerouslySetInnerHTML={{__html: course.courseDescription}}></p>
//             <div className="text-sm text-gray-500 dark:text-gray-400">
//                 <div>
//                      Posted by:{" "}
//                      <strong>{course.educator?.name || "Unknown"}</strong>
//                 </div>
//                 <div>
//                     Created on:{" "}
//                      <strong>{course.createdAt.substring(0,10)|| "Unknown"}</strong>
//                 </div>
//                 <div>
//                     Price:{" "}
//                      <strong>{"$"+course.coursePrice|| "Unknown"}</strong>
//                 </div>
//                 <div>
//                     Discount:{" "}
//                      <strong>{"$"+course.discount|| "Unknown"}</strong>
//                 </div>
             
              
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function AdminDashboard() {
  const { user } = useUser();
  const [courses, setCourses] = useState([]);
  const [courseToDelete, setCourseToDelete] = useState(null); // new state
  const isAdmin = user?.publicMetadata?.role === "admin";

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/all`);
      if (data.success) {
        setCourses(data.courses);
        console.log(data);
        
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const confirmDeleteCourse = async () => {
    console.log(user.id);
    try {
      await axios.delete(`${backendUrl}/api/course/${courseToDelete._id}`, {
        headers: {
          "x-clerk-user-id": user.id,
        },
      });
      toast.success("Course deleted");
      fetchCourses();
      setCourseToDelete(null); // close modal
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchCourses();
  }, [isAdmin]);

  if (!isAdmin) {
    return <div className="p-4 text-red-600">You are not authorized to view this page.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto relative">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Delete Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-200 p-6 rounded-lg shadow-md w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Confirm Delete
            </h2>
            <p className="mb-6 text-center">
              Are you sure you want to delete the course{" "}
              <strong>{courseToDelete.courseTitle}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setCourseToDelete(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCourse}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course List */}
      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        courses.map((course) => (
          <div
            key={course._id}
            className="border rounded-lg shadow-md p-4 mb-4 bg-white dark:bg-gray-600"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{course.courseTitle}</h2>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => setCourseToDelete(course)} // open modal
              >
                Delete
              </button>
            </div>
            <p
              className="text-gray-700 dark:text-gray-300 mb-2"
              dangerouslySetInnerHTML={{
                __html: course.courseDescription,
              }}
            ></p>
            <div className="text-sm text-gray-500 dark:text-gray-300">
              <div>
                Posted by: <strong>{course.educator?.name || "Unknown"}</strong>
              </div>
              <div>
                Created on:{" "}
                <strong>{course.createdAt?.substring(0, 10) || "Unknown"}</strong>
              </div>
              <div>
                LastUpdated: <strong>{course.updatedAt.substring(0,10) || "0"}</strong>
              </div>
              <div>
                Price: <strong>${course.coursePrice || "0"}</strong>
              </div>
              <div>
                Discount: <strong>${course.discount || "0"}</strong>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

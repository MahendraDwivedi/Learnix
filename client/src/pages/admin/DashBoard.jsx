

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,                                                                                                                                                                                          
  YAxis,
  Tooltip,
  CartesianGrid,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "@clerk/clerk-react";

export default function AdminDashboard() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEducators: 0,
    totalEnrollments: 0,
  });
  const [courseToDelete, setCourseToDelete] = useState(null);

  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userSortBy, setUserSortBy] = useState("createdAt");
  const [search, setSearch] = useState("");
  const [educatorFilter, setEducatorFilter] = useState("All Educator");
  const [userRoleFilter, setUserRoleFilter] = useState("student");
  const [sortBy, setSortBy] = useState("createdAt");

  const chartData = [
    { name: "Courses", value: stats.totalCourses },
    { name: "Students", value: stats.totalStudents },
    { name: "Educators", value: stats.totalEducators },
    { name: "Enrollments", value: stats.totalEnrollments },
  ];

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/all`);
      if (data.success) {
        setCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/admin/stats`, {
        headers: { "x-clerk-user-id": user.id },
      });
      if (data.success) {
        setStats(data.stats);
        setUsers([...data.stats.students, ...data.stats.educators]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const confirmDeleteCourse = async () => {
    try {
      await axios.delete(`${backendUrl}/api/course/${courseToDelete._id}`, {
        headers: { "x-clerk-user-id": user.id },
      });
      toast.success("Course deleted");
      fetchCourses();
      setCourseToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const filteredUsers = useMemo(() => {
    let list = users.filter(u => u.role === userRoleFilter);

    if (userSearch.trim()) {
      const lower = userSearch.toLowerCase();
      list = list.filter(
        u => u.name?.toLowerCase().includes(lower) || u.email?.toLowerCase().includes(lower)
      );
    }

    list.sort((a, b) => {
      if (userSortBy === "createdAt") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [users, userSearch, userRoleFilter, userSortBy]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
      fetchCourses();
    }
  }, [isAdmin]);

  const educators = useMemo(() => {
    const all = new Set(courses.map(c => c.educator?.name).filter(Boolean));
    return ["All Educator", ...Array.from(all)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    if (search.trim()) {
      result = result.filter(c =>
        c.courseTitle.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (educatorFilter !== "All Educator") {
      result = result.filter(c => c.educator?.name === educatorFilter);
    }

    result.sort((a, b) => {
      if (sortBy === "price") {
        return b.coursePrice - a.coursePrice;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return result;
  }, [courses, search, educatorFilter, sortBy]);

  if (!isAdmin) {
    return <div className="p-4 text-red-600">You are not authorized to view this page.</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-900 dark:text-white tracking-tight">Admin Dashboard</h1>

      {/* Section: Confirm Course Deletion */}
      {courseToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md dark:bg-gray-900 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 text-center">Confirm Deletion</h2>
            <p className="mb-6 text-center text-gray-700 dark:text-gray-300">
              Are you sure you want to delete <strong>{courseToDelete.courseTitle}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setCourseToDelete(null)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCourse}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section: Dashboard Statistics */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Dashboard Stats</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Section: Users Management */}
      <section className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow mb-10">
        <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Users </h2>
          <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)} className="p-2 rounded border">
            <option value="student">Students</option>
            <option value="educator">Educators</option>
          </select>
        </div>

        <input
          type="text"
          value={userSearch}
          onChange={e => setUserSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full mb-4 p-2 border rounded"
        />

        {filteredUsers.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No users found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, i) => (
                <tr key={i} className="border-b hover:bg-gray-100 dark:hover:bg-gray-600">
                  <td className="p-2">{u.name || "-"}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2 capitalize">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Section: Course Filters */}
      <hr className="p-10" />
      <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-900 dark:text-white tracking-tight">Delete Courses </h1>
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by title"
          className="p-2 border rounded w-full"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded w-full"
          value={educatorFilter}
          onChange={e => setEducatorFilter(e.target.value)}
        >
          {educators.map((name, i) => (
            <option key={i} value={name}>{name}</option>
          ))}
        </select>
        <select
          className="p-2 border rounded w-full"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="createdAt">Sort by Created Date</option>
          <option value="price">Sort by Price</option>
        </select>
      </section>

      {/* Section: Course List */}
      {filteredCourses.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">No courses found.</p>
      ) : (
        filteredCourses.map(course => (
          <div
            key={course._id}
            className="border rounded-xl shadow-md p-6 mb-6 bg-white dark:bg-gray-700 transition hover:shadow-lg"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-blue-900 dark:text-white">{course.courseTitle}</h2>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                onClick={() => setCourseToDelete(course)}
              >
                Delete
              </button>
            </div>
            <p
              className="text-gray-700 dark:text-gray-300 mb-3"
              dangerouslySetInnerHTML={{ __html: course.courseDescription }}
            />
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <div>Posted by: <strong>{course.educator?.name || "Unknown"}</strong></div>
              <div>Created on: <strong>{course.createdAt?.substring(0, 10)}</strong></div>
              <div>Updated on: <strong>{course.updatedAt?.substring(0, 10)}</strong></div>
              <div>Price: <strong>${course.coursePrice || "0"}</strong></div>
              <div>Discount: <strong>${course.discount || "0"}</strong></div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

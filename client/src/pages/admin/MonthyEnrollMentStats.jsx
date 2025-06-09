import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const MonthlyEnrollmentStats = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("/api/admin/enrollment-stats");
        const formatted = data.stats.map((item) => ({
          name: `${item.month}/${item.year}`,
          Enrollments: item.totalEnrollments,
          Students: item.studentCount,
        }));
        setStats(formatted);
      } catch (error) {
        console.error("Failed to fetch enrollment stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Monthly Enrollment Stats (Last 6 Months)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={stats} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Enrollments" fill="#8884d8" />
          <Bar dataKey="Students" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyEnrollmentStats;

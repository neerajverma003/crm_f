// import React, { useEffect, useState } from "react";
// import { CalendarIcon, Eye, Edit2, X } from "lucide-react";
// import axios from "axios";

// const SuperAdminAttendance = () => {
//   const [admins, setAdmins] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [filter, setFilter] = useState("All");
//   const [loading, setLoading] = useState(true);
//   const [editModal, setEditModal] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [formData, setFormData] = useState({
//     clockIn: "",
//     clockOut: "",
//     status: "",
//   });

//   /* -------------------------------------------------------------------------- */
//   /* 📦 Fetch All Attendance Data (Admins + Employees) */
//   /* -------------------------------------------------------------------------- */
//   const fetchAllAttendance = async () => {
//     try {
//       setLoading(true);
//       const [adminRes, employeeRes] = await Promise.all([
//         axios.get("http://localhost:4000/adminAttendance/getAllAttendance"),
//         axios.get("http://localhost:4000/attendance/getAllAttendance"),
//       ]);

//       const adminData =
//         adminRes?.data?.data ||
//         adminRes?.data?.attendance ||
//         (Array.isArray(adminRes?.data) ? adminRes.data : []);

//       const employeeData =
//         employeeRes?.data?.data ||
//         employeeRes?.data?.attendance ||
//         (Array.isArray(employeeRes?.data) ? employeeRes.data : []);

//       setAdmins(adminData);
//       setEmployees(employeeData);
//       setFilteredData([...adminData, ...employeeData]);
//     } catch (error) {
//       console.error("⚠️ Error fetching attendance:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllAttendance();
//   }, []);

//   /* -------------------------------------------------------------------------- */
//   /* 🔍 Handle Filter */
//   /* -------------------------------------------------------------------------- */
//   useEffect(() => {
//     if (filter === "All") setFilteredData([...admins, ...employees]);
//     else if (filter === "Admins") setFilteredData(admins);
//     else setFilteredData(employees);
//   }, [filter, admins, employees]);

//   /* -------------------------------------------------------------------------- */
//   /* ✏️ Edit Attendance Modal */
//   /* -------------------------------------------------------------------------- */
//   const handleEditClick = (record) => {
//     setSelectedRecord(record);
//     setFormData({
//       clockIn: record.clockIn || "",
//       clockOut: record.clockOut || "",
//       status: record.status || "",
//     });
//     setEditModal(true);
//   };

//   /* -------------------------------------------------------------------------- */
//   /* 💾 Save Attendance Changes */
//   /* -------------------------------------------------------------------------- */
//   const handleSaveEdit = async () => {
//     if (!selectedRecord) return;

//     try {
//       const isAdmin = !!selectedRecord?.admin;
//       const endpoint = isAdmin
//         ? `http://localhost:4000/adminAttendance/editAttendance/${selectedRecord._id}`
//         : `http://localhost:4000/attendance/edit/${selectedRecord._id}`;

//       const method = isAdmin ? "put" : "patch";

//       // ✅ Convert time strings safely if backend expects Date
//       const toDate = (time) =>
//         time ? new Date(`1970-01-01T${time}:00Z`) : null;

//       const updatedForm = {
//         clockIn: formData.clockIn ? toDate(formData.clockIn) : null,
//         clockOut: formData.clockOut ? toDate(formData.clockOut) : null,
//         status: formData.status,
//       };

//       await axios[method](endpoint, updatedForm);
//       alert("✅ Attendance updated successfully!");
//       setEditModal(false);
//       fetchAllAttendance();
//     } catch (error) {
//       console.error("❌ Error updating attendance:", error);
//       alert("Failed to update attendance.");
//     }
//   };

//   /* -------------------------------------------------------------------------- */
//   /* 🧾 Render */
//   /* -------------------------------------------------------------------------- */
//   return (
//     <div className="p-6">
//       {/* Header + Filter */}
//       <div className="mb-6 flex items-center justify-between">
//         <h2 className="text-xl font-semibold text-gray-800">
//           Super Admin Attendance
//         </h2>

//         <div className="flex items-center gap-2">
//           <label className="text-sm font-medium text-gray-600">Filter:</label>
//           <select
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="rounded-lg border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
//           >
//             <option value="All">All</option>
//             <option value="Admins">Admins</option>
//             <option value="Employees">Employees</option>
//           </select>
//         </div>
//       </div>

//       {/* Table */}
//       {loading ? (
//         <p className="text-center text-gray-500">Loading attendance data...</p>
//       ) : filteredData.length === 0 ? (
//         <p className="text-center text-gray-500">No attendance records found.</p>
//       ) : (
//         <div className="overflow-x-auto rounded-xl bg-white shadow-md">
//           <table className="min-w-full text-sm text-gray-700">
//             <thead className="bg-gray-100 text-xs font-semibold uppercase text-gray-600">
//               <tr>
//                 <th className="px-4 py-2 text-left">#</th>
//                 <th className="px-4 py-2 text-left">Name</th>
//                 <th className="px-4 py-2 text-left">Email</th>
//                 <th className="px-4 py-2 text-left">Role</th>
//                 <th className="px-4 py-2 text-left">Date</th>
//                 <th className="px-4 py-2 text-left">Clock In</th>
//                 <th className="px-4 py-2 text-left">Clock Out</th>
//                 <th className="px-4 py-2 text-left">Status</th>
//                 <th className="px-4 py-2 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.map((record, index) => {
//                 const name =
//                   record?.employee?.fullName ||
//                   record?.admin?.fullName ||
//                   "N/A";
//                 const email =
//                   record?.employee?.email ||
//                   record?.admin?.email ||
//                   "N/A";
//                 const role = record?.employee
//                   ? "Employee"
//                   : record?.admin
//                   ? "Admin"
//                   : "-";
//                 const date = record?.date
//                   ? new Date(record.date).toLocaleDateString("en-IN")
//                   : "-";
//                 const statusClass =
//                   record?.status === "Present"
//                     ? "bg-green-100 text-green-700"
//                     : record?.status === "Absent"
//                     ? "bg-red-100 text-red-700"
//                     : "bg-yellow-100 text-yellow-700";

//                 return (
//                   <tr
//                     key={record._id || index}
//                     className="border-b hover:bg-gray-50"
//                   >
//                     <td className="px-4 py-2">{index + 1}</td>
//                     <td className="px-4 py-2">{name}</td>
//                     <td className="px-4 py-2">{email}</td>
//                     <td className="px-4 py-2 capitalize">{role}</td>
//                     <td className="flex items-center gap-1 px-4 py-2">
//                       <CalendarIcon size={14} />
//                       {date}
//                     </td>
//                     <td className="px-4 py-2">{record.clockIn || "-"}</td>
//                     <td className="px-4 py-2">{record.clockOut || "-"}</td>
//                     <td className="px-4 py-2">
//                       <span
//                         className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass}`}
//                       >
//                         {record.status || "N/A"}
//                       </span>
//                     </td>
//                     <td className="flex gap-2 px-4 py-2">
//                       <button className="p-1 text-blue-600 hover:text-blue-800">
//                         <Eye size={16} />
//                       </button>
//                       <button
//                         onClick={() => handleEditClick(record)}
//                         className="p-1 text-yellow-600 hover:text-yellow-800"
//                       >
//                         <Edit2 size={16} />
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {editModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-700 bg-opacity-80">
//           <div className="relative w-96 rounded-lg bg-white p-6 shadow-2xl">
//             <button
//               className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
//               onClick={() => setEditModal(false)}
//             >
//               <X size={18} />
//             </button>

//             <h3 className="mb-4 text-lg font-semibold text-gray-800">
//               Edit Attendance
//             </h3>

//             <div className="flex flex-col gap-3">
//               <label className="text-sm font-medium">Clock In</label>
//               <input
//                 type="text"
//                 placeholder="e.g. 09:45"
//                 value={formData.clockIn}
//                 onChange={(e) =>
//                   setFormData({ ...formData, clockIn: e.target.value })
//                 }
//                 className="rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
//               />

//               <label className="text-sm font-medium">Clock Out</label>
//               <input
//                 type="text"
//                 placeholder="e.g. 18:00"
//                 value={formData.clockOut}
//                 onChange={(e) =>
//                   setFormData({ ...formData, clockOut: e.target.value })
//                 }
//                 className="rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
//               />

//               <label className="text-sm font-medium">Status</label>
//               <select
//                 value={formData.status}
//                 onChange={(e) =>
//                   setFormData({ ...formData, status: e.target.value })
//                 }
//                 className="rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
//               >
//                 <option value="">Select Status</option>
//                 <option value="Present">Present</option>
//                 <option value="Absent">Absent</option>
//                 <option value="Late">Late</option>
//                 <option value="Grace Present">Grace Present</option>
//                 <option value="Half Day">Half Day</option>
//               </select>

//               <button
//                 onClick={handleSaveEdit}
//                 className="mt-4 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SuperAdminAttendance;





import React, { useEffect, useState } from "react";
import { CalendarIcon, Eye, Edit2, X } from "lucide-react";
import axios from "axios";

const SuperAdminAttendance = () => {
  const [admins, setAdmins] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({
    clockIn: "",
    clockOut: "",
    status: "",
  });

  /* -------------------------------------------------------------------------- */
  /* 📦 Fetch All Attendance Data (Admins + Employees) */
  /* -------------------------------------------------------------------------- */
  const fetchAllAttendance = async () => {
    try {
      setLoading(true);
      const [adminRes, employeeRes] = await Promise.all([
        axios.get("http://localhost:4000/adminAttendance/getAllAttendance"),
        axios.get("http://localhost:4000/attendance/getAllAttendance"),
      ]);

      const adminData =
        adminRes?.data?.data ||
        adminRes?.data?.attendance ||
        (Array.isArray(adminRes?.data) ? adminRes.data : []);

      const employeeData =
        employeeRes?.data?.data ||
        employeeRes?.data?.attendance ||
        (Array.isArray(employeeRes?.data) ? employeeRes.data : []);

      setAdmins(adminData);
      setEmployees(employeeData);
      setFilteredData([...adminData, ...employeeData]);
    } catch (error) {
      console.error("⚠️ Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAttendance();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* 🔍 Handle Filter */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (filter === "All") setFilteredData([...admins, ...employees]);
    else if (filter === "Admins") setFilteredData(admins);
    else setFilteredData(employees);
  }, [filter, admins, employees]);

  /* -------------------------------------------------------------------------- */
  /* ✏️ Edit Attendance Modal */
  /* -------------------------------------------------------------------------- */
  const handleEditClick = (record) => {
    setSelectedRecord(record);

    // Convert ISO timestamp to HH:mm for input fields
    const formatTime = (isoString) => {
      if (!isoString) return "";
      const date = new Date(isoString);
      const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    setFormData({
      clockIn: formatTime(record.clockIn),
      clockOut: formatTime(record.clockOut),
      status: record.status || "",
    });
    setEditModal(true);
  };

  /* -------------------------------------------------------------------------- */
  /* 💾 Save Attendance Changes */
  /* -------------------------------------------------------------------------- */
  const handleSaveEdit = async () => {
    if (!selectedRecord) return;

    try {
      const isAdmin = !!selectedRecord?.admin;
      const endpoint = isAdmin
        ? `http://localhost:4000/adminAttendance/editAttendance/${selectedRecord._id}`
        : `http://localhost:4000/attendance/edit/${selectedRecord._id}`;

      const method = isAdmin ? "put" : "patch";

      // Convert HH:mm back to full ISO timestamp in UTC
      const toISO = (time) => {
        if (!time) return null;
        const [hours, minutes] = time.split(":").map(Number);
        const date = new Date(selectedRecord.date || new Date());
        date.setUTCHours(hours, minutes, 0, 0);
        return date.toISOString();
      };

      const updatedForm = {
        clockIn: toISO(formData.clockIn),
        clockOut: toISO(formData.clockOut),
        status: formData.status,
      };

      await axios[method](endpoint, updatedForm);
      alert("✅ Attendance updated successfully!");
      setEditModal(false);
      fetchAllAttendance();
    } catch (error) {
      console.error("❌ Error updating attendance:", error);
      alert("Failed to update attendance.");
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🧾 Render */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="p-6">
      {/* Header + Filter */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Super Admin Attendance
        </h2>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="All">All</option>
            <option value="Admins">Admins</option>
            <option value="Employees">Employees</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-500">Loading attendance data...</p>
      ) : filteredData.length === 0 ? (
        <p className="text-center text-gray-500">No attendance records found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-md">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs font-semibold uppercase text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Clock In</th>
                <th className="px-4 py-2 text-left">Clock Out</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record, index) => {
                const name =
                  record?.employee?.fullName ||
                  record?.admin?.fullName ||
                  "N/A";
                const email =
                  record?.employee?.email ||
                  record?.admin?.email ||
                  "N/A";
                const role = record?.employee
                  ? "Employee"
                  : record?.admin
                  ? "Admin"
                  : "-";
                const date = record?.date
                  ? new Date(record.date).toLocaleDateString("en-IN")
                  : "-";

                const clockIn = record?.clockIn || "-";
                const clockOut = record?.clockOut || "-";

                const statusClass =
                  record?.status === "Present"
                    ? "bg-green-100 text-green-700"
                    : record?.status === "Absent"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700";

                return (
                  <tr
                    key={record._id || index}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{name}</td>
                    <td className="px-4 py-2">{email}</td>
                    <td className="px-4 py-2 capitalize">{role}</td>
                    <td className="flex items-center gap-1 px-4 py-2">
                      <CalendarIcon size={14} />
                      {date}
                    </td>
                    <td className="px-4 py-2">{clockIn}</td>
                    <td className="px-4 py-2">{clockOut}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass}`}
                      >
                        {record.status || "N/A"}
                      </span>
                    </td>
                    <td className="flex gap-2 px-4 py-2">
                      <button className="p-1 text-blue-600 hover:text-blue-800">
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditClick(record)}
                        className="p-1 text-yellow-600 hover:text-yellow-800"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-700 bg-opacity-80">
          <div className="relative w-96 rounded-lg bg-white p-6 shadow-2xl">
            <button
              className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
              onClick={() => setEditModal(false)}
            >
              <X size={18} />
            </button>

            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Edit Attendance
            </h3>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">Clock In</label>
              <input
                type="text"
                placeholder="e.g. 03:53"
                value={formData.clockIn}
                onChange={(e) =>
                  setFormData({ ...formData, clockIn: e.target.value })
                }
                className="rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />

              <label className="text-sm font-medium">Clock Out</label>
              <input
                type="text"
                placeholder="e.g. 18:00"
                value={formData.clockOut}
                onChange={(e) =>
                  setFormData({ ...formData, clockOut: e.target.value })
                }
                className="rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />

              <label className="text-sm font-medium">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Select Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
                <option value="Grace Present">Grace Present</option>
                <option value="Half Day">Half Day</option>
              </select>

              <button
                onClick={handleSaveEdit}
                className="mt-4 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminAttendance;

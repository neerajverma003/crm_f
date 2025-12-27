

import { useEffect, useState, useRef } from "react";
import { CalendarIcon, LogIn, LogOut, Edit2, Eye } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

/* -------------------------------------------------------------------------- */
/*  DROPDOWN COMPONENTS */
/* -------------------------------------------------------------------------- */

const roles = ["All Status", "Present", "Absent", "Late", "Grace Present", "Half Day"];

const AllStatus = ({ onSelect }) => {
  const [selected, setSelected] = useState("All Status");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (value) => {
    setSelected(value);
    setOpen(false);
    onSelect(value);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-52" ref={dropdownRef}>
      <div
        className="flex items-center justify-between bg-[#f3f3f5] rounded-md px-3 py-2 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2 text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-funnel text-gray-500"
          >
            <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
          </svg>
          <span>{selected}</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`lucide lucide-chevron-down text-gray-600 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      {open && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
          {roles.map((r) => (
            <div
              key={r}
              onClick={() => handleSelect(r)}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
            >
              {r}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

//  Admin Toggle Dropdown
const AdminViewSelect = ({ selectedView, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const views = ["Employee Attendance", "Personal Attendance"];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-60" ref={ref}>
      <div
        className="flex items-center justify-between bg-[#f3f3f5] rounded-md px-3 py-2 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <span className="text-black font-medium">{selectedView}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`lucide lucide-chevron-down text-gray-600 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      {open && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md z-10">
          {views.map((view) => (
            <div
              key={view}
              onClick={() => {
                onChange(view);
                setOpen(false);
              }}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
            >
              {view}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  EDIT MODAL COMPONENT */
/* -------------------------------------------------------------------------- */

const EditModal = ({ attendance, onClose, onSave }) => {
  const statusOptions = ["Present", "Absent", "Late", "Grace Present", "Half Day","Sunday" ,"Holiday"];

  const formatLocalDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 16);
  };

  const [clockIn, setClockIn] = useState(formatLocalDateTime(attendance.clockIn));
  const [clockOut, setClockOut] = useState(formatLocalDateTime(attendance.clockOut));
  const [status, setStatus] = useState(attendance.status || "Present");

  const handleSubmit = () => {
    const toServerFormat = (localString) => {
      if (!localString) return null;
      return new Date(localString);
    };

    const updatedData = {
      clockIn: toServerFormat(clockIn),
      clockOut: clockOut ? toServerFormat(clockOut) : null,
      status,
    };

    onSave(updatedData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-center">Edit Attendance</h2>

        <div className="space-y-4">
          {/* Clock In */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clock In Time
            </label>
            <input
              type="datetime-local"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={clockIn}
              onChange={(e) => setClockIn(e.target.value)}
            />
          </div>

          {/* Clock Out */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clock Out Time
            </label>
            <input
              type="datetime-local"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={clockOut}
              onChange={(e) => setClockOut(e.target.value)}
              placeholder="Select clock out time"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  EMPLOYEE TABLE COMPONENT */
/* -------------------------------------------------------------------------- */

const EmployeeTable = ({ searchText = "" }) => {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [viewAttendance, setViewAttendance] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [adminView, setAdminView] = useState("Employee Attendance");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [dateRangeStart, setDateRangeStart] = useState(
    role?.toLowerCase() === "admin" && adminView === "Employee Attendance"
      ? new Date().toISOString().split("T")[0]
      : ""
  );
  const [dateRangeEnd, setDateRangeEnd] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        let url = "";

        if (role?.toLowerCase() === "admin") {
          if (adminView === "Personal Attendance") {
            url = `http://localhost:4000/adminAttendance/${userId}`;
          } else {
            url = "http://localhost:4000/attendance/getAllAttendance";
          }
        } else {
          url = `http://localhost:4000/attendance/${userId}`;
        }

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        const allData = Array.isArray(data) ? data : data.data || [];

        allData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEmployeeData(allData);
      } catch (err) {
        console.error("Error fetching attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [userId, role, token, adminView]);

  //  Set default date filter to today for admin Employee Attendance view
  useEffect(() => {
    if (role?.toLowerCase() === "admin" && adminView === "Employee Attendance" && !dateRangeStart) {
      setDateRangeStart(new Date().toISOString().split("T")[0]);
    }
  }, [adminView, role]);

  const handleSave = async (updatedData) => {
    try {
      const res = await fetch(
        `http://localhost:4000/attendance/${editingAttendance._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!res.ok) throw new Error("Failed to update");
      const updatedAttendance = await res.json();

      setEmployeeData((prev) =>
        prev.map((att) =>
          att._id === updatedAttendance.attendance._id
            ? updatedAttendance.attendance
            : att
        )
      );

      setEditingAttendance(null);
    } catch (err) {
      console.error("Error updating attendance:", err);
    }
  };

  const formatTime = (time) =>
    time
      ? new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "-";

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString([], {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

  const calculateWorkingHours = (clockIn, clockOut, status) => {
    if (clockIn && clockOut)
      return ((new Date(clockOut) - new Date(clockIn)) / 36e5).toFixed(2);
    if (status === "Absent") return "0.00";
    return "-";
  };

  const filteredData = (() => {
    let data = employeeData;

    //  For admin: apply date filter (single date or range)
    if (role?.toLowerCase() === "admin" && adminView === "Employee Attendance") {
      if (dateRangeStart) {
        // If both dates are set, filter as range; if only start date is set, filter as single date
        const endDate = dateRangeEnd || dateRangeStart;
        data = data.filter((u) => {
          const recordDate = new Date(u.date).toISOString().split("T")[0];
          return recordDate >= dateRangeStart && recordDate <= endDate;
        });
      }
    }

    // Filter by status
    if (selectedStatus !== "All Status") {
      data = data.filter((u) => u.status === selectedStatus);
    }

    // Filter by search text (name)
    if (searchText.trim()) {
      const lowerSearchText = searchText.toLowerCase().trim();
      data = data.filter((u) => {
        const employeeName = (u.employee?.fullName || u.admin?.fullName || "").toLowerCase();
        const email = (u.employee?.email || u.admin?.email || "").toLowerCase();
        return employeeName.includes(lowerSearchText) || email.includes(lowerSearchText);
      });
    }

    return data;
  })();

  //  Pagination logic - Only apply when no date filter
  const shouldPaginate = !dateRangeStart;
  const totalPages = shouldPaginate ? Math.ceil(filteredData.length / itemsPerPage) : 1;
  const startIndex = shouldPaginate ? (currentPage - 1) * itemsPerPage : 0;
  const endIndex = shouldPaginate ? startIndex + itemsPerPage : filteredData.length;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, searchText, dateRangeStart, dateRangeEnd]);

  return (
    <div className="border border-gray-200 rounded-md bg-white overflow-x-auto">
      {/*  Filter + View Selector */}
      {["admin", "superadmin"].includes(role?.toLowerCase()) && (
        <div className="flex flex-col gap-4 p-4 border-b border-gray-200">
          {/* Row 1: Status Filter + View Selector */}
          <div className="flex justify-between items-center flex-wrap gap-3">
            <AllStatus onSelect={(status) => setSelectedStatus(status)} />
            <AdminViewSelect
              selectedView={adminView}
              onChange={(view) => setAdminView(view)}
            />
          </div>

          {/* Row 2: Date Range Filter (only for admin Employee Attendance view) */}
          {role?.toLowerCase() === "admin" && adminView === "Employee Attendance" && (
            <div className="flex items-center gap-2 flex-wrap">
              <label className="text-sm font-medium text-gray-700 min-w-fit">
                Date Filter:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  placeholder="From"
                  value={dateRangeStart}
                  onChange={(e) => setDateRangeStart(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                {dateRangeStart && (
                  <>
                    <span className="text-gray-500 text-sm font-medium">to</span>
                    <input
                      type="date"
                      placeholder="To"
                      value={dateRangeEnd}
                      onChange={(e) => setDateRangeEnd(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </>
                )}
              </div>
              {dateRangeStart && (
                <button
                  onClick={() => {
                    setDateRangeStart("");
                    setDateRangeEnd("");
                  }}
                  className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 rounded text-red-700 font-medium"
                >
                  Clear
                </button>
              )}
              {dateRangeStart && dateRangeEnd && (
                <span className="text-xs text-gray-500">
                  ({dateRangeStart} {dateRangeEnd && `to ${dateRangeEnd}`})
                </span>
              )}
            </div>
          )}
        </div>
      )}

      <table className="w-full rounded-md overflow-hidden shadow-md border-gray-200 whitespace-nowrap">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr className="text-left">
            <th className="p-3 text-sm font-semibold text-gray-700">Employee</th>
            <th className="p-3 text-sm font-semibold text-gray-700">Department</th>
            <th className="p-3 text-sm font-semibold text-gray-700">Date</th>
            <th className="p-3 text-sm font-semibold text-gray-700">Check In</th>
            <th className="p-3 text-sm font-semibold text-gray-700">Check Out</th>
            <th className="p-3 text-sm font-semibold text-gray-700">Status</th>
            <th className="p-3 text-sm font-semibold text-gray-700">Working Hours</th>
            {role?.toLowerCase() === "admin" && adminView === "Employee Attendance" && (
              <th className="p-3 text-sm font-semibold text-gray-700">Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="p-4 text-center text-gray-500">
                Loading...
              </td>
            </tr>
          ) : filteredData.length === 0 ? (
            <tr>
              <td colSpan="8" className="p-4 text-center text-gray-500">
                No attendance records found.
              </td>
            </tr>
          ) : (
            paginatedData.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-800">
                      {u.employee?.fullName?.charAt(0)?.toUpperCase() ||
                        u.admin?.fullName?.charAt(0)?.toUpperCase() ||
                        "?"}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-900">
                        {u.employee?.fullName || u.admin?.fullName || "Unknown"}
                      </div>
                      {(u.employee?.email || u.admin?.email) && (
                        <div className="text-xs text-gray-400">
                          {u.employee?.email || u.admin?.email}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-3 text-sm text-gray-700">
                  {u.employee?.department || u.admin?.department || "N/A"}
                </td>
                <td className="p-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{formatDate(u.date)}</span>
                  </div>
                </td>
                <td className="p-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4 text-green-600" />
                    <span>{formatTime(u.clockIn)}</span>
                  </div>
                </td>
                <td className="p-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span>{formatTime(u.clockOut)}</span>
                  </div>
                </td>
                <td className="p-3">
                  <StatusBadge status={u.status} />
                </td>
                <td className="p-3 text-sm font-medium text-gray-800">
                  {calculateWorkingHours(u.clockIn, u.clockOut, u.status) !== "-"
                    ? `${calculateWorkingHours(u.clockIn, u.clockOut, u.status)} hrs`
                    : "-"}
                </td>

                {role?.toLowerCase() === "admin" &&
                  adminView === "Employee Attendance" && (
                    <td className="p-3 text-sm text-gray-700 flex gap-2">
                      <button
                        onClick={() => setEditingAttendance(u)}
                        className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setViewAttendance(u)}
                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/*  Pagination Controls - Only show when no date filter is applied */}
      {filteredData.length > 0 && !dateRangeStart && (
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
            <span className="font-semibold">{Math.min(endIndex, filteredData.length)}</span> of{" "}
            <span className="font-semibold">{filteredData.length}</span> records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded text-sm font-medium ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}
      {editingAttendance && (
        <EditModal
          attendance={editingAttendance}
          onClose={() => setEditingAttendance(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default EmployeeTable;




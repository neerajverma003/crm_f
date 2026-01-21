import { BarChart3, Clock4, UserCheck, Users, TrendingUp, TrendingDown, UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SuperAdminDashboard = () => {
    const navigate = useNavigate();

    const [lead, setLead] = useState([]);
    const [loadingLeads, setLoadingLeads] = useState(true);

    const [attendanceData, setAttendanceData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loadingAttendance, setLoadingAttendance] = useState(true);

    const [companies, setCompanies] = useState([]);
    const [loadingCompanies, setLoadingCompanies] = useState(true);
    const [errorCompanies, setErrorCompanies] = useState("");

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

    const role = localStorage.getItem("role"); // Super admin | admin | employee

    // 🕒 Check Token Expiry
    const checkTokenExpiry = () => {
        const token = localStorage.getItem("token");
        const expiry = localStorage.getItem("tokenExpiry");

        if (!token || !expiry) return false;

        if (new Date().getTime() > Number(expiry)) {
            // Remove expired session data
            localStorage.removeItem("token");
            localStorage.removeItem("tokenExpiry");
            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            localStorage.removeItem("role");
            localStorage.removeItem("companyId");
            return false;
        }
        return true;
    };

    // 🧩 Session Timeout Watcher
    useEffect(() => {
        if (!checkTokenExpiry()) {
            alert("Session expired. Please login again.");
            navigate("/");
        }

        const interval = setInterval(() => {
            if (!checkTokenExpiry()) {
                alert("Session expired. Please login again.");
                navigate("/");
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [navigate]);

    // 📊 Fetch Attendance
    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await fetch("http://localhost:4000/attendance/getAllAttendance");
                const data = await res.json();
                console.log("Fetched attendance data:", data);

                const attendance = Array.isArray(data) ? data : data.data || [];
                const userId = localStorage.getItem("userId");

                // Filter by logged-in user
                const userAttendance = attendance.filter((item) => item.employee?._id === userId);

                setAttendanceData(userAttendance);
            } catch (err) {
                console.error("Error fetching attendance:", err);
            } finally {
                setLoadingAttendance(false);
            }
        };

        fetchAttendance();
    }, []);

    // 📈 Fetch Leads
    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await fetch("http://localhost:4000/leads/");
                const data = await res.json();
                const leadData = Array.isArray(data) ? data : data.data || [];
                setLead(leadData);
            } catch (err) {
                console.error("Error fetching leads:", err);
            } finally {
                setLoadingLeads(false);
            }
        };
        fetchLeads();
    }, []);

    // 🏢 Fetch Companies
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get("http://localhost:4000/company/all");
                let allCompanies = response.data?.companies || [];

                // Filter by admin role
                if (role === "admin") {
                    const userId = localStorage.getItem("userId");
                    allCompanies = allCompanies.filter((company) => company.adminId === userId);
                }

                setCompanies(allCompanies);
            } catch (err) {
                console.error("Error fetching companies:", err);
                setErrorCompanies("Failed to load companies");
            } finally {
                setLoadingCompanies(false);
            }
        };
        fetchCompanies();
    }, [role]);

    // 🏢 Fetch Assigned Company for Admin
    useEffect(() => {
        const fetchAdminCompany = async () => {
            if (role === "admin") {
                try {
                    const adminId = localStorage.getItem("userId");
                    if (!adminId) return;

                    const res = await axios.get(`http://localhost:4000/getCompanyByAdminId/${adminId}`);
                    const data = res.data;
                    console.log(data)
                    if (data?.assignedCompanies?.length > 0) {
                        setCompanies(data.assignedCompanies);
                    } else {
                        setCompanies([]);
                    }
                } catch (err) {
                    console.error("Error fetching admin company:", err);
                    setErrorCompanies("Failed to load assigned company");
                } finally {
                    setLoadingCompanies(false);
                }
            }
        };

        fetchAdminCompany();
    }, [role]);


    // 📅 Filter Attendance by Selected Date
    useEffect(() => {
        const target = new Date(selectedDate);
        const filtered = attendanceData.filter((item) => {
            if (!item.date) return false;
            const itemDate = new Date(item.date);
            return (
                itemDate.getFullYear() === target.getFullYear() &&
                itemDate.getMonth() === target.getMonth() &&
                itemDate.getDate() === target.getDate()
            );
        });
        setFilteredData(filtered);
    }, [selectedDate, attendanceData]);

    // 🎨 Helper: Status Colors
    const getStatusColor = (status) => {
        if (!status) return "bg-gray-400";
        switch (status.toLowerCase()) {
            case "present":
            case "active":
                return "bg-green-500 hover:bg-green-600";
            case "absent":
                return "bg-red-500 hover:bg-red-600";
            case "late":
            case "warm":
                return "bg-yellow-500 hover:bg-yellow-600";
            case "hot":
                return "bg-red-500 hover:bg-red-600";
            case "cold":
            case "inactive":
                return "bg-gray-500 hover:bg-gray-600";
            default:
                return "bg-gray-500 hover:bg-gray-600";
        }
    };

    // 🕒 Helper: Format Time
    const formatTime = (isoString) => {
        if (!isoString) return "—";
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    // 📊 Dashboard Cards
    // const cards = [
    //     {
    //         title: "Total Leads",
    //         value: lead.length.toString(),
    //         percentage: "+12% from last month",
    //         icon: <Users className="h-5 w-5" />,
    //         trend: "up",
    //         color: "text-blue-600",
    //     },
    //     {
    //         title: "Total Users",
    //         value: "4",
    //         percentage: "+8% from last month",
    //         icon: <UserCheck className="h-5 w-5" />,
    //         trend: "up",
    //         color: "text-green-600",
    //     },
    //     {
    //         title: "Avg Time",
    //         value: "00:45",
    //         percentage: "-2% from last month",
    //         icon: <Clock4 className="h-5 w-5" />,
    //         trend: "down",
    //         color: "text-orange-600",
    //     },
    //     {
    //         title: "Conversions",
    //         value: "76",
    //         percentage: "+5% from last month",
    //         icon: <BarChart3 className="h-5 w-5" />,
    //         trend: "up",
    //         color: "text-purple-600",
    //     },
    // ];

    return (
  <div className="flex-1 bg-[#f8fafc] px-4 py-6 md:px-8">

    {/* Dashboard Overview */}
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-500">
        Dashboard Overview
      </h2>
    </div>

    {/* Welcome Section */}
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
        Welcome back!
      </h1>
      <p className="mt-1 text-gray-500">
        Here's an overview of your productivity today.
      </p>
    </div>

    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Recent Leads */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            Recent Leads
          </h3>
          <button
            onClick={() => navigate("/lead-management")}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View All
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[320px] overflow-y-auto">
  {loadingLeads ? (
    <p className="text-center text-sm text-gray-500">Loading leads...</p>
  ) : lead.length === 0 ? (
    <p className="text-center text-sm text-gray-500">No leads found</p>
  ) : (
    lead.map((item) => (
      <div
        key={item._id}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-semibold text-white">
            {item.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{item.name}</p>
            <p className="text-xs text-gray-500">
              {item.leadType || "Lead"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm font-semibold text-gray-900">
            ₹ {item.value || "0"}
          </p>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              item.leadStatus === "Hot"
                ? "bg-red-100 text-red-600"
                : item.leadStatus === "Warm"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {item.leadStatus}
          </span>
        </div>
      </div>
    ))
  )}
</div>

      </div>

      {/* Attendance */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-green-600" />
              Attendance
            </h3>
            <p className="text-xs text-gray-500">
              Record for {selectedDate}
            </p>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-sm border rounded-md px-2 py-1"
          />
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="h-28 w-28 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <UserCheck className="h-10 w-10 text-green-600" />
          </div>

          <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-6">
            PRESENT
          </span>

          {filteredData.length > 0 && (
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-xs text-gray-500">TIME IN</p>
                <p className="font-semibold text-gray-900">
                  {formatTime(filteredData[0]?.clockIn)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">TIME OUT</p>
                <p className="font-semibold text-gray-900">
                  {formatTime(filteredData[0]?.clockOut)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="mt-10">
      <h3 className="mb-4 font-semibold text-gray-900 flex items-center gap-2">
        ⚡ Quick Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={() => navigate("/lead-management")}
          className="h-24 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-col items-center justify-center shadow hover:scale-105 transition"
        >
          <UserPlus className="mb-2" />
          Add New Lead
        </button>
        {/* Clock In/Out */}
                            <button
                                onClick={() => navigate("/attendance")}
                                className="flex h-24 transform flex-col items-center justify-center rounded-lg border-2 border-gray-200 transition-all duration-200 hover:scale-105 hover:border-green-300 hover:bg-green-50"
                            >
                                <Clock4 className="mb-2 h-6 w-6 text-gray-600" />
                                <span className="font-semibold text-gray-700">Clock In/Out</span>
                            </button>

                            {/* Add User (Admin Only) */}
                            {(role === "admin" || role === "superAdmin") && (
                                <button
                                    onClick={() => navigate("/user-management")}
                                    className="flex h-24 transform flex-col items-center justify-center rounded-lg border-2 border-gray-200 transition-all duration-200 hover:scale-105 hover:border-indigo-300 hover:bg-indigo-50"
                                >
                                    <UserPlus className="mb-2 h-6 w-6 text-gray-600" />
                                    <span className="font-semibold text-gray-700">Add User</span>
                                </button>
                            )}

      </div>
    </div>
  </div>
);

};

export default SuperAdminDashboard;
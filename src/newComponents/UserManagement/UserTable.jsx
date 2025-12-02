import { useState, useEffect } from "react";
import { Eye, Edit2, Trash2, X } from "lucide-react";
import EditUser from "./EditUser";

const API_URL = "http://localhost:4000";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  const userRole = localStorage.getItem("role");

  // Fetch Companies
  const fetchCompanies = async () => {
    const res = await fetch(`${API_URL}/company/all`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch companies");
    return data.companies || [];
  };

  // Fetch all data together
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const role = localStorage.getItem("role");
      let combined = [];

      if (role === "superAdmin") {
        const [adminRes, employeeRes] = await Promise.all([
          fetch(`${API_URL}/getAdmins`),
          fetch(`${API_URL}/employee/allEmployee`),
        ]);

        const adminData = await adminRes.json();
        const employeeData = await employeeRes.json();
        if (!adminRes.ok) throw new Error(adminData.message || "Failed to fetch admins");
        if (!employeeRes.ok) throw new Error(employeeData.message || "Failed to fetch employees");

        const admins = adminData.admins || adminData || [];
        const employees = employeeData.employees || employeeData || [];

        combined = [...admins, ...employees];
      } else if (role === "admin") {
        const employeeRes = await fetch(`${API_URL}/employee/allEmployee`);
        const employeeData = await employeeRes.json();
        if (!employeeRes.ok) throw new Error(employeeData.message || "Failed to fetch employees");

        const employees = employeeData.employees || employeeData || [];
        combined = [...employees];
      } else {
        combined = [];
      }

      // Attach company names
      const usersWithCompanies = await Promise.all(
        combined.map(async (user) => {
          let companyName = user.companyName || "—";

          if (user.company && Array.isArray(user.company) && user.company.length > 0) {
            try {
              const firstCompanyRes = await fetch(`${API_URL}/company/${user.company[0]}`);
              const firstCompanyData = await firstCompanyRes.json();
              companyName =
                user.company.length > 1
                  ? `${firstCompanyData.company?.companyName || "Unknown"} +${user.company.length - 1}`
                  : firstCompanyData.company?.companyName || "Unknown";
            } catch {
              companyName = "Unknown";
            }
          } else if (user.company && typeof user.company === "object" && user.company._id) {
            try {
              const companyRes = await fetch(`${API_URL}/company/${user.company._id}`);
              const companyData = await companyRes.json();
              companyName = companyData.company?.companyName || "Unknown";
            } catch {
              companyName = "Unknown";
            }
          } else if (user.company && typeof user.company === "string") {
            try {
              const companyRes = await fetch(`${API_URL}/company/${user.company}`);
              const companyData = await companyRes.json();
              companyName = companyData.company?.companyName || "Unknown";
            } catch {
              companyName = "Unknown";
            }
          }

          return { ...user, displayCompanyName: companyName };
        })
      );

      usersWithCompanies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setUsers(usersWithCompanies);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch users or admins. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete User
  const deleteUser = async (id, role) => {
    const userRole = localStorage.getItem("role")?.toLowerCase();
    if (userRole !== "superadmin") {
      alert("Only superAdmin can delete users.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete this ${role}?`)) return;

    try {
      let endpoint;
      if (role === "admin") endpoint = `${API_URL}/deleteAdmin/${id}`;
      else if (role === "employee") endpoint = `${API_URL}/employee/deleteEmployee/${id}`;
      else if (role === "superadmin") {
        alert("You cannot delete another superAdmin.");
        return;
      } else throw new Error("Invalid role specified.");

      const res = await fetch(endpoint, { method: "DELETE", headers: { "Content-Type": "application/json" } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Failed to delete ${role}`);

      alert(`${role} deleted successfully`);
      fetchData();
    } catch (error) {
      console.error(`❌ Error deleting:`, error);
      alert(error.message);
    }
  };

  // Edit
  const handleEditClick = (user) => {
    if (user.role === "Admin" && userRole !== "superAdmin") {
      alert("You don't have permission to edit admins.");
      return;
    }
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  // View
  const handleViewClick = async (user) => {
    try {
      let companyNames = [];

      if (user.company && Array.isArray(user.company) && user.company.length > 0) {
        const companyPromises = user.company.map(async (companyId) => {
          try {
            const res = await fetch(`${API_URL}/company/${companyId}`);
            if (!res.ok) return "Unknown";
            const data = await res.json();
            return data.company?.companyName || "Unknown";
          } catch {
            return "Unknown";
          }
        });
        companyNames = await Promise.all(companyPromises);
      } else if (user.companyName) companyNames = [user.companyName];
      else if (user.company && typeof user.company === "object" && user.company._id) {
        try {
          const res = await fetch(`${API_URL}/company/${user.company._id}`);
          if (!res.ok) throw new Error("Failed to fetch company");
          const data = await res.json();
          companyNames = [data.company?.companyName || "Unknown"];
        } catch {
          companyNames = ["Unknown"];
        }
      } else if (user.company && typeof user.company === "string") {
        try {
          const res = await fetch(`${API_URL}/company/${user.company}`);
          const data = await res.json();
          companyNames = [data.company?.companyName || "Unknown"];
        } catch {
          companyNames = ["Unknown"];
        }
      }

      setViewingUser({ ...user, companyNames });
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setViewingUser({ ...user, companyNames: ["Unknown"] });
      setIsViewModalOpen(true);
    }
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingUser(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = (updatedUser) => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
    fetchCompanies().then(setCompanies);
  }, []);

  const getRoleBadge = (role) => {
    const colors = {
      Admin: "bg-[#ad46ff]",
      Manager: "bg-[#2b7fff]",
      "Sales Rep": "bg-[#00c951]",
      Employee: "bg-[#6a7282]",
    };
    return (
      <span className={`px-2 py-1 rounded-md text-white text-xs font-medium ${colors[role] || "bg-gray-400"}`}>
        {role}
      </span>
    );
  };

  const getStatusBadge = (status) => (
    <span className={`px-2 py-1 rounded-md text-white text-xs font-medium ${status === "Active" ? "bg-green-500" : "bg-red-500"}`}>
      {status}
    </span>
  );

  return (
    <>
      <div className="w-full min-w-0">
        <div className="overflow-x-auto rounded-md shadow-sm bg-white border border-gray-200">
          <div className="px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">
              {userRole === "superAdmin" ? "Admin & Employee List" : "Employee List"}
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-6 text-gray-600">Loading data...</div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">{error}</div>
          ) : users.length === 0 ? (
            <div className="text-center py-6 text-gray-500">No records found.</div>
          ) : (
            <table className="w-full min-w-[900px]">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr className="text-left text-sm text-gray-700">
                  <th className="p-3">User</th>
                  <th className="p-3 hidden sm:table-cell">Contact</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 hidden md:table-cell">Department</th>
                  <th className="p-3 hidden lg:table-cell">Company</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 hidden md:table-cell">Join Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700 flex-shrink-0">
                          {u.fullName?.[0]?.toUpperCase() || "?"}
                        </div>
                        <span className="font-medium text-sm truncate max-w-[150px]">{u.fullName || "Unnamed"}</span>
                      </div>
                    </td>

                    <td className="p-3 text-sm text-gray-600 hidden sm:table-cell">
                      <div className="truncate max-w-[180px]">{u.email || "—"}</div>
                      <div className="truncate">{u.phone || "—"}</div>
                    </td>

                    <td className="p-3">{getRoleBadge(u.role || "Employee")}</td>

                    <td className="p-3 hidden md:table-cell">
                      <span className="truncate block max-w-[120px]">
                        {typeof u.department === "string" ? u.department : u.department?.dep || "—"}
                      </span>
                    </td>

                    <td className="p-3 hidden lg:table-cell">
                      <span className="truncate block max-w-[150px]">
                        {(() => {
                          if (u.displayCompanyName) return u.displayCompanyName;
                          if (u.company && typeof u.company === "object" && u.company._id) {
                            const company = companies.find((c) => String(c._id) === String(u.company._id));
                            return company ? company.companyName : "—";
                          }
                          if (typeof u.company === "string") {
                            const company = companies.find((c) => String(c._id) === String(u.company));
                            return company ? company.companyName : "—";
                          }
                          if (Array.isArray(u.company) && u.company.length > 0) {
                            const first = companies.find((c) => String(c._id) === String(u.company[0]));
                            if (first) return u.company.length > 1 ? `${first.companyName} +${u.company.length - 1}` : first.companyName;
                          }
                          return "—";
                        })()}
                      </span>
                    </td>

                    <td className="p-3">{getStatusBadge(u.accountActive ? "Active" : "Inactive")}</td>

                    <td className="p-3 text-sm text-gray-600 hidden md:table-cell whitespace-nowrap">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </td>

                    <td className="p-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleViewClick(u)} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="View">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleEditClick(u)} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => deleteUser(u._id, u.role)} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isViewModalOpen && viewingUser && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-gray-200">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">User Details</h2>
              <button onClick={handleCloseViewModal} className="text-gray-500 hover:text-gray-700">
                <X size={22} />
              </button>
            </div>
            <div className="p-6 space-y-3 text-gray-700">
              <p><strong>Name:</strong> {viewingUser.fullName}</p>
              <p><strong>Email:</strong> {viewingUser.email}</p>
              <p><strong>Phone:</strong> {viewingUser.phone}</p>
              <p><strong>Department:</strong> {typeof viewingUser.department === "string" ? viewingUser.department : viewingUser.department?.dep || "—"}</p>
              <p>
                <strong>Company:</strong>{" "}
                {viewingUser.companyNames && viewingUser.companyNames.length > 0
                  ? viewingUser.companyNames.length > 1
                    ? <ul className="list-disc list-inside ml-2 mt-1">{viewingUser.companyNames.map((company, index) => <li key={index}>{company}</li>)}</ul>
                    : viewingUser.companyNames[0]
                  : "—"
                }
              </p>
              <p><strong>Role:</strong> {viewingUser.role}</p>
              <p><strong>Status:</strong> {viewingUser.accountActive ? "Active" : "Inactive"}</p>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && editingUser && (
        <EditUser
          user={editingUser}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveUser}
        />
      )}
    </>
  );
};

export default UserTable;

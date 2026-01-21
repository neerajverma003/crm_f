// import { useState, useEffect } from "react";
// import { Eye, Edit2, Trash2, X } from "lucide-react";
// import EditUser from "./EditUser";
// import EditAdmin from "./EditAdmin";

// const API_URL = "http://localhost:4000";

// const UserTable = ({ onlyAdmins = false }) => {
//   const [users, setUsers] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isAdminEditOpen, setIsAdminEditOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [viewingUser, setViewingUser] = useState(null);

//   const userRole = localStorage.getItem("role");

//   // Fetch Companies
//   const fetchCompanies = async () => {
//     const res = await fetch(`${API_URL}/company/all`);
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || "Failed to fetch companies");
//     return data.companies || [];
//   };

//   // Fetch all data together
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const role = localStorage.getItem("role");
//       let combined = [];

//       if (onlyAdmins) {
//         const adminRes = await fetch(`${API_URL}/getAdmins`);
//         const adminData = await adminRes.json();
//         if (!adminRes.ok) throw new Error(adminData.message || "Failed to fetch admins");
//         // adminData may be an array or an object
//         combined = adminData.admins || adminData || [];
//       } else if (role === "superAdmin") {
//         const [adminRes, employeeRes] = await Promise.all([
//           fetch(`${API_URL}/getAdmins`),
//           fetch(`${API_URL}/employee/allEmployee`),
//         ]);

//         const adminData = await adminRes.json();
//         const employeeData = await employeeRes.json();
//         if (!adminRes.ok) throw new Error(adminData.message || "Failed to fetch admins");
//         if (!employeeRes.ok) throw new Error(employeeData.message || "Failed to fetch employees");

//         const admins = adminData.admins || adminData || [];
//         const employees = employeeData.employees || employeeData || [];

//         combined = [...admins, ...employees];
//       } else if (role === "admin") {
//         const employeeRes = await fetch(`${API_URL}/employee/allEmployee`);
//         const employeeData = await employeeRes.json();
//         if (!employeeRes.ok) throw new Error(employeeData.message || "Failed to fetch employees");

//         const employees = employeeData.employees || employeeData || [];
//         combined = [...employees];
//       } else {
//         combined = [];
//       }

//       // Attach company names
//       const usersWithCompanies = await Promise.all(
//         combined.map(async (user) => {
//           let companyName = user.companyName || "—";

//           if (user.company && Array.isArray(user.company) && user.company.length > 0) {
//             try {
//               const firstCompanyRes = await fetch(`${API_URL}/company/${user.company[0]}`);
//               const firstCompanyData = await firstCompanyRes.json();
//               companyName =
//                 user.company.length > 1
//                   ? `${firstCompanyData.company?.companyName || "Unknown"} +${user.company.length - 1}`
//                   : firstCompanyData.company?.companyName || "Unknown";
//             } catch {
//               companyName = "Unknown";
//             }
//           } else if (user.company && typeof user.company === "object" && user.company._id) {
//             try {
//               const companyRes = await fetch(`${API_URL}/company/${user.company._id}`);
//               const companyData = await companyRes.json();
//               companyName = companyData.company?.companyName || "Unknown";
//             } catch {
//               companyName = "Unknown";
//             }
//           } else if (user.company && typeof user.company === "string") {
//             try {
//               const companyRes = await fetch(`${API_URL}/company/${user.company}`);
//               const companyData = await companyRes.json();
//               companyName = companyData.company?.companyName || "Unknown";
//             } catch {
//               companyName = "Unknown";
//             }
//           }

//           return { ...user, displayCompanyName: companyName };
//         })
//       );

//       usersWithCompanies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//       setUsers(usersWithCompanies);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setError("Failed to fetch users or admins. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete User
//   const deleteUser = async (id, role) => {
//     const userRole = localStorage.getItem("role")?.toLowerCase();
//     if (userRole !== "superadmin") {
//       alert("Only superAdmin can delete users.");
//       return;
//     }
//     if (!window.confirm(`Are you sure you want to delete this ${role}?`)) return;

//     try {
//       let endpoint;
//       if (role === "admin") endpoint = `${API_URL}/deleteAdmin/${id}`;
//       else if (role === "employee") endpoint = `${API_URL}/employee/deleteEmployee/${id}`;
//       else if (role === "superadmin") {
//         alert("You cannot delete another superAdmin.");
//         return;
//       } else throw new Error("Invalid role specified.");

//       const res = await fetch(endpoint, { method: "DELETE", headers: { "Content-Type": "application/json" } });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || `Failed to delete ${role}`);

//       alert(`${role} deleted successfully`);
//       fetchData();
//     } catch (error) {
//       console.error(`❌ Error deleting:`, error);
//       alert(error.message);
//     }
//   };

//   // Edit
//   const handleEditClick = (user) => {
//     if (user.role === "Admin" && userRole !== "superAdmin") {
//       alert("You don't have permission to edit admins.");
//       return;
//     }
//     setEditingUser(user);
//     if (user.role === "Admin") setIsAdminEditOpen(true);
//     else setIsEditModalOpen(true);
//   };

//   // View
//   const handleViewClick = async (user) => {
//     try {
//       let companyNames = [];

//       if (user.company && Array.isArray(user.company) && user.company.length > 0) {
//         const companyPromises = user.company.map(async (companyId) => {
//           try {
//             const res = await fetch(`${API_URL}/company/${companyId}`);
//             if (!res.ok) return "Unknown";
//             const data = await res.json();
//             return data.company?.companyName || "Unknown";
//           } catch {
//             return "Unknown";
//           }
//         });
//         companyNames = await Promise.all(companyPromises);
//       } else if (user.companyName) companyNames = [user.companyName];
//       else if (user.company && typeof user.company === "object" && user.company._id) {
//         try {
//           const res = await fetch(`${API_URL}/company/${user.company._id}`);
//           if (!res.ok) throw new Error("Failed to fetch company");
//           const data = await res.json();
//           companyNames = [data.company?.companyName || "Unknown"];
//         } catch {
//           companyNames = ["Unknown"];
//         }
//       } else if (user.company && typeof user.company === "string") {
//         try {
//           const res = await fetch(`${API_URL}/company/${user.company}`);
//           const data = await res.json();
//           companyNames = [data.company?.companyName || "Unknown"];
//         } catch {
//           companyNames = ["Unknown"];
//         }
//       }

//       setViewingUser({ ...user, companyNames });
//       setIsViewModalOpen(true);
//     } catch (error) {
//       console.error("Error fetching companies:", error);
//       setViewingUser({ ...user, companyNames: ["Unknown"] });
//       setIsViewModalOpen(true);
//     }
//   };

//   const handleCloseViewModal = () => {
//     setIsViewModalOpen(false);
//     setViewingUser(null);
//   };

//   const handleCloseEditModal = () => {
//     setIsEditModalOpen(false);
//     setEditingUser(null);
//   };

//   const handleSaveUser = (updatedUser) => {
//     fetchData();
//   };

//   useEffect(() => {
//     fetchData();
//     fetchCompanies().then(setCompanies);
//   }, []);

//   const getRoleBadge = (role) => {
//     const colors = {
//       Admin: "bg-[#ad46ff]",
//       Manager: "bg-[#2b7fff]",
//       "Sales Rep": "bg-[#00c951]",
//       Employee: "bg-[#6a7282]",
//     };
//     return (
//       <span className={`px-2 py-1 rounded-md text-white text-xs font-medium ${colors[role] || "bg-gray-400"}`}>
//         {role}
//       </span>
//     );
//   };

//   const getStatusBadge = (status) => (
//     <span className={`px-2 py-1 rounded-md text-white text-xs font-medium ${status === "Active" ? "bg-green-500" : "bg-red-500"}`}>
//       {status}
//     </span>
//   );

//   return (
//     <>
//       <div className="w-full min-w-0">
//         <div className="overflow-x-auto rounded-md shadow-sm bg-white border border-gray-200">
//           <div className="px-4 py-3 border-b">
//             <h2 className="text-lg font-semibold">
//               {userRole === "superAdmin" ? "Admin & Employee List" : "Employee List"}
//             </h2>
//           </div>

//           {loading ? (
//             <div className="text-center py-6 text-gray-600">Loading data...</div>
//           ) : error ? (
//             <div className="text-center py-6 text-red-500">{error}</div>
//           ) : users.length === 0 ? (
//             <div className="text-center py-6 text-gray-500">No records found.</div>
//           ) : (
//             <table className="w-full min-w-[900px]">
//               <thead className="border-b border-gray-200 bg-gray-50">
//                 <tr className="text-left text-sm text-gray-700">
//                   <th className="p-3">User</th>
//                   <th className="p-3 hidden sm:table-cell">Contact</th>
//                   <th className="p-3">Role</th>
//                   <th className="p-3 hidden md:table-cell">Department</th>
//                   <th className="p-3 hidden lg:table-cell">Company</th>
//                   <th className="p-3">Status</th>
//                   <th className="p-3 hidden md:table-cell">Join Date</th>
//                   <th className="p-3">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((u) => (
//                   <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                     <td className="p-3">
//                       <div className="flex items-center gap-2">
//                         <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700 flex-shrink-0">
//                           {u.fullName?.[0]?.toUpperCase() || "?"}
//                         </div>
//                         <span className="font-medium text-sm truncate max-w-[150px]">{u.fullName || "Unnamed"}</span>
//                       </div>
//                     </td>

//                     <td className="p-3 text-sm text-gray-600 hidden sm:table-cell">
//                       <div className="truncate max-w-[180px]">{u.email || "—"}</div>
//                       <div className="truncate">{u.phone || "—"}</div>
//                     </td>

//                     <td className="p-3">{getRoleBadge(u.role || "Employee")}</td>

//                     <td className="p-3 hidden md:table-cell">
//                       <span className="truncate block max-w-[120px]">
//                         {typeof u.department === "string" ? u.department : u.department?.dep || "—"}
//                       </span>
//                     </td>

//                     <td className="p-3 hidden lg:table-cell">
//                       <span className="truncate block max-w-[150px]">
//                         {(() => {
//                           if (u.displayCompanyName) return u.displayCompanyName;
//                           if (u.company && typeof u.company === "object" && u.company._id) {
//                             const company = companies.find((c) => String(c._id) === String(u.company._id));
//                             return company ? company.companyName : "—";
//                           }
//                           if (typeof u.company === "string") {
//                             const company = companies.find((c) => String(c._id) === String(u.company));
//                             return company ? company.companyName : "—";
//                           }
//                           if (Array.isArray(u.company) && u.company.length > 0) {
//                             const first = companies.find((c) => String(c._id) === String(u.company[0]));
//                             if (first) return u.company.length > 1 ? `${first.companyName} +${u.company.length - 1}` : first.companyName;
//                           }
//                           return "—";
//                         })()}
//                       </span>
//                     </td>

//                     <td className="p-3">{getStatusBadge(u.accountActive ? "Active" : "Inactive")}</td>

//                     <td className="p-3 text-sm text-gray-600 hidden md:table-cell whitespace-nowrap">
//                       {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
//                     </td>

//                     <td className="p-3">
//                       <div className="flex gap-2">
//                         <button onClick={() => handleViewClick(u)} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors" title="View">
//                           <Eye size={16} />
//                         </button>
//                         <button onClick={() => handleEditClick(u)} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors" title="Edit">
//                           <Edit2 size={16} />
//                         </button>
//                         <button onClick={() => deleteUser(u._id, u.role)} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors" title="Delete">
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {isViewModalOpen && viewingUser && (
//         <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-gray-200">
//             <div className="flex justify-between items-center p-6 border-b">
//               <h2 className="text-xl font-semibold">User Details</h2>
//               <button onClick={handleCloseViewModal} className="text-gray-500 hover:text-gray-700">
//                 <X size={22} />
//               </button>
//             </div>
//             <div className="p-6 space-y-3 text-gray-700">
//               <p><strong>Name:</strong> {viewingUser.fullName}</p>
//               <p><strong>Email:</strong> {viewingUser.email}</p>
//               <p><strong>Phone:</strong> {viewingUser.phone}</p>
//               <p><strong>Department:</strong> {typeof viewingUser.department === "string" ? viewingUser.department : viewingUser.department?.dep || "—"}</p>
//               <p>
//                 <strong>Company:</strong>{" "}
//                 {viewingUser.companyNames && viewingUser.companyNames.length > 0
//                   ? viewingUser.companyNames.length > 1
//                     ? <ul className="list-disc list-inside ml-2 mt-1">{viewingUser.companyNames.map((company, index) => <li key={index}>{company}</li>)}</ul>
//                     : viewingUser.companyNames[0]
//                   : "—"
//                 }
//               </p>
//               <p><strong>Role:</strong> {viewingUser.role}</p>
//               <p><strong>Status:</strong> {viewingUser.accountActive ? "Active" : "Inactive"}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {isEditModalOpen && editingUser && (
//         <EditUser
//           user={editingUser}
//           isOpen={isEditModalOpen}
//           onClose={handleCloseEditModal}
//           onSave={handleSaveUser}
//         />
//       )}

//       {isAdminEditOpen && editingUser && (
//         <EditAdmin
//           user={editingUser}
//           isOpen={isAdminEditOpen}
//           onClose={() => { setIsAdminEditOpen(false); setEditingUser(null); }}
//           onSave={(updated) => { setIsAdminEditOpen(false); setEditingUser(null); handleSaveUser(updated); }}
//         />
//       )}
//     </>
//   );
// };

// export default UserTable;

// import { useState, useEffect } from "react";
// import { Eye, Edit2, Trash2, X } from "lucide-react";
// import EditUser from "./EditUser";
// import EditAdmin from "./EditAdmin";

// const API_URL = "http://localhost:4000";

// const UserTable = ({ onlyAdmins = false }) => {
//   const [users, setUsers] = useState([]);
//     const [companies, setCompanies] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [editingUser, setEditingUser] = useState(null);
//   const [viewingUser, setViewingUser] = useState(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isAdminEditOpen, setIsAdminEditOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);

//   const userRole = localStorage.getItem("role");

//   const fetchCompanies = async () => {
//     const res = await fetch(`${API_URL}/company/all`);
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || "Failed to fetch companies");
//     return data.companies || [];
//   };

//   /* ---------------- FETCH DATA (UNCHANGED) ---------------- */
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       let combined = [];

//       if (onlyAdmins) {
//         const res = await fetch(`${API_URL}/getAdmins`);
//         const data = await res.json();
//         combined = data.admins || data || [];
//       } else if (userRole === "superAdmin") {
//         const [a, e] = await Promise.all([
//           fetch(`${API_URL}/getAdmins`),
//           fetch(`${API_URL}/employee/allEmployee`),
//         ]);
//         const ad = await a.json();
//         const em = await e.json();
//         combined = [...(ad.admins || []), ...(em.employees || [])];
//       } else {
//         const res = await fetch(`${API_URL}/employee/allEmployee`);
//         const data = await res.json();
//         combined = data.employees || [];
//       }

//       setUsers(combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
//     } catch {
//       setError("Failed to load users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchCompanies().then(setCompanies);
//   }, []);

//   // const badge = (text, bg) => (
//   //   <span className={`px-3 py-1 rounded-full text-xs font-medium ${bg}`}>
//   //     {text}
//   //   </span>
//   // );
// const badge = (text) => {
//   const bgMap = {
//     Employee: "bg-green-100 text-green-700",
//     Admin: "bg-yellow-100 text-yellow-700",
//     Active:"bg-green-100 text-green-700",
//     Inactive:"bg-yellow-100 text-yellow-700",
//     // SuperAdmin: "bg-red-100 text-red-700",
//   };
//   const handleViewClick = async (user) => {
//     try {
//       let companyNames = [];

//       if (user.company && Array.isArray(user.company) && user.company.length > 0) {
//         const companyPromises = user.company.map(async (companyId) => {
//           try {
//             const res = await fetch(`${API_URL}/company/${companyId}`);
//             if (!res.ok) return "Unknown";
//             const data = await res.json();
//             return data.company?.companyName || "Unknown";
//           } catch {
//             return "Unknown";
//           }
//         });
//         companyNames = await Promise.all(companyPromises);
//       } else if (user.companyName) companyNames = [user.companyName];
//       else if (user.company && typeof user.company === "object" && user.company._id) {
//         try {
//           const res = await fetch(`${API_URL}/company/${user.company._id}`);
//           if (!res.ok) throw new Error("Failed to fetch company");
//           const data = await res.json();
//           companyNames = [data.company?.companyName || "Unknown"];
//         } catch {
//           companyNames = ["Unknown"];
//         }
//       } else if (user.company && typeof user.company === "string") {
//         try {
//           const res = await fetch(`${API_URL}/company/${user.company}`);
//           const data = await res.json();
//           companyNames = [data.company?.companyName || "Unknown"];
//         } catch {
//           companyNames = ["Unknown"];
//         }
//       }

//       setViewingUser({ ...user, companyNames });
//       setIsViewModalOpen(true);
//     } catch (error) {
//       console.error("Error fetching companies:", error);
//       setViewingUser(user);
//       setIsViewModalOpen(true);
//     }
//   };

//   const defaultBg = "bg-gray-100 text-gray-700";

//   const bg = bgMap[text] || defaultBg;

//   return (
//     <span className={`px-3 py-1 rounded-full text-xs font-medium ${bg}`}>
//       {text}
//     </span>
//   );
// };

//   /* ---------------- UI ---------------- */
//   return (
//     <>
//       <div className="bg-[#F8F9FB] rounded-2xl border border-[#EDEDED] shadow-sm">
//         <div className="p-6 border-b">
//           <h2 className="text-xl font-semibold text-gray-800">
//             Users Overview
//           </h2>
//           <p className="text-sm text-gray-500">Manage admins & employees</p>
//         </div>

//         {/* ---------- DESKTOP TABLE ---------- */}
//         <div className="hidden lg:block overflow-x-auto">
//           <table className="w-full">
//             <thead className="text-sm text-gray-500">
//               <tr>
//                 <th className="p-4 text-left">User</th>
//                   <th className="p-3 hidden sm:table-cell">Contact</th>
//                 <th className="p-4">Role</th>
//                 <th className="p-3 hidden md:table-cell">Department</th>
//                   <th className="p-3 hidden lg:table-cell">Company</th>
//                 <th className="p-4">Status</th>
//                 <th className="p-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((u) => (
//                 <tr key={u._id} className="border-t hover:bg-white transition">
//                   <td className="p-4 flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-full bg-[#F6A5B6] text-white flex items-center justify-center font-semibold">
//                       {u.fullName?.[0]}
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-800">{u.fullName}</p>
//                       <p className="text-xs text-gray-400">{u.email}</p>
//                     </div>
//                   </td>
//                   <td className="p-3 text-sm text-gray-600 hidden sm:table-cell">
//                       {/* <div className="truncate max-w-[180px]">{u.email || "—"}</div> */}
//                       <div className="truncate">{u.phone || "—"}</div>
//                     </td>

//                   <td className="p-4">
//                     {badge(u.role, "bg-[#E9E6FF] text-[#5B5BD6]")}
//                   </td>
//                   <td className="p-3 hidden md:table-cell">
//                       <span className="truncate block max-w-[120px]">
//                         {typeof u.department === "string" ? u.department : u.department?.dep || "—"}
//                       </span>
//                     </td>
//                     <td className="p-3 hidden lg:table-cell">
//                       <span className="truncate block max-w-[150px]">
//                         {(() => {
//                           if (u.displayCompanyName) return u.displayCompanyName;
//                           if (u.company && typeof u.company === "object" && u.company._id) {
//                             const company = companies.find((c) => String(c._id) === String(u.company._id));
//                             return company ? company.companyName : "—";
//                           }
//                           if (typeof u.company === "string") {
//                             const company = companies.find((c) => String(c._id) === String(u.company));
//                             return company ? company.companyName : "—";
//                           }
//                           if (Array.isArray(u.company) && u.company.length > 0) {
//                             const first = companies.find((c) => String(c._id) === String(u.company[0]));
//                             if (first) return u.company.length > 1 ? `${first.companyName} +${u.company.length - 1}` : first.companyName;
//                           }
//                           return "—";
//                         })()}
//                       </span>
//                     </td>

//                   <td className="p-4">
//                     {badge(u.accountActive ? "Active" : "Inactive")}
//                   </td>

//                   <td className="p-4 text-right">
//                     <div className="flex justify-end gap-2">
//                       <button onClick={() => handleViewClick(u)}
//                         className="p-2 rounded-full bg-[#E9E6FF] text-[#5B5BD6]">
//                         <Eye size={16} />
//                       </button>
//                       <button onClick={() => { setEditingUser(u); setIsEditModalOpen(true); }}
//                         className="p-2 rounded-full bg-[#DFF5EA] text-[#1F8B5C]">
//                         <Edit2 size={16} />
//                       </button>
//                       <button
//                         className="p-2 rounded-full bg-[#FDE2E7] text-[#D1435B]">
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* ---------- MOBILE CARDS ---------- */}
//         <div className="lg:hidden p-4 space-y-4">
//           {users.map((u) => (
//             <div key={u._id} className="bg-white rounded-xl p-4 shadow-sm border">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-[#F6A5B6] text-white flex items-center justify-center">
//                   {u.fullName?.[0]}
//                 </div>
//                 <div>
//                   <p className="font-medium">{u.fullName}</p>
//                   <p className="text-xs text-gray-500">{u.email}</p>
//                 </div>
//               </div>

//               <div className="mt-3 flex gap-2">
//                 {badge(u.role, "bg-[#E9E6FF] text-[#5B5BD6]")}
//                 {u.accountActive
//                   ? badge("Active", "bg-[#DFF5EA] text-[#1F8B5C]")
//                   : badge("Inactive", "bg-red-100 text-red-500")}
//               </div>

//               <div className="mt-4 flex gap-2">
//                 <button className="flex-1 bg-[#E9E6FF] text-[#5B5BD6] py-2 rounded-lg">
//                   View
//                 </button>
//                 <button className="flex-1 bg-[#DFF5EA] text-[#1F8B5C] py-2 rounded-lg">
//                   Edit
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* View Modal */}
//       {isViewModalOpen && viewingUser && (
//         <div className="fixed inset-0 bg-white/40 backdrop-blur flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-semibold text-lg">User Details</h3>
//               <button onClick={() => setIsViewModalOpen(false)}><X /></button>
//             </div>
//             <p><strong>Name:</strong> {viewingUser.fullName}</p>
//             <p><strong>Email:</strong> {viewingUser.email}</p>
//           </div>
//         </div>
//       )}

//       {isEditModalOpen && editingUser && (
//         <EditUser user={editingUser} isOpen onClose={() => setIsEditModalOpen(false)} onSave={fetchData} />
//       )}

//       {isAdminEditOpen && editingUser && (
//         <EditAdmin user={editingUser} isOpen onClose={() => setIsAdminEditOpen(false)} onSave={fetchData} />
//       )}
//     </>
//   );
// };

// export default UserTable;

// import { useState, useEffect } from "react";
// import { Eye, Edit2, Trash2, X } from "lucide-react";
// import EditUser from "./EditUser";
// import EditAdmin from "./EditAdmin";

// const API_URL = "http://localhost:4000";

// const UserTable = ({ onlyAdmins = false }) => {
//   const [users, setUsers] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isAdminEditOpen, setIsAdminEditOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [viewingUser, setViewingUser] = useState(null);

//   const userRole = localStorage.getItem("role");

//   /* ================= LOGIC (UNCHANGED) ================= */
//   const fetchCompanies = async () => {
//     const res = await fetch(`${API_URL}/company/all`);
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || "Failed to fetch companies");
//     return data.companies || [];
//   };

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const role = localStorage.getItem("role");
//       let combined = [];

//       if (onlyAdmins) {
//         const adminRes = await fetch(`${API_URL}/getAdmins`);
//         const adminData = await adminRes.json();
//         combined = adminData.admins || adminData || [];
//       } else if (role === "superAdmin") {
//         const [adminRes, employeeRes] = await Promise.all([
//           fetch(`${API_URL}/getAdmins`),
//           fetch(`${API_URL}/employee/allEmployee`),
//         ]);

//         const adminData = await adminRes.json();
//         const employeeData = await employeeRes.json();

//         combined = [
//           ...(adminData.admins || adminData || []),
//           ...(employeeData.employees || employeeData || []),
//         ];
//       } else if (role === "admin") {
//         const employeeRes = await fetch(`${API_URL}/employee/allEmployee`);
//         const employeeData = await employeeRes.json();
//         combined = employeeData.employees || employeeData || [];
//       }

//       const usersWithCompanies = await Promise.all(
//         combined.map(async (user) => {
//           let companyName = user.companyName || "—";

//           if (Array.isArray(user.company) && user.company.length > 0) {
//             try {
//               const res = await fetch(`${API_URL}/company/${user.company[0]}`);
//               const data = await res.json();
//               companyName =
//                 user.company.length > 1
//                   ? `${data.company?.companyName || "Unknown"} +${user.company.length - 1}`
//                   : data.company?.companyName || "Unknown";
//             } catch {
//               companyName = "Unknown";
//             }
//           }

//           return { ...user, displayCompanyName: companyName };
//         })
//       );

//       usersWithCompanies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//       setUsers(usersWithCompanies);
//     } catch {
//       setError("Failed to fetch users.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchCompanies().then(setCompanies);
//   }, []);

//   const getRoleBadge = (role) => {
//     const colors = {
//       Admin: "bg-purple-100 text-purple-700",
//       Manager: "bg-blue-600",
//       "Sales Rep": "bg-green-600",
//       Employee: "bg-blue-100 text-blue-700",
//     };
//     return (
//       <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[role] || "bg-gray-400"}`}>
//         {role}
//       </span>
//     );
//   };

//   const getStatusBadge = (status) => (
//     <span className={`px-2 py-1 rounded text-xs text-white ${status === "Active" ? "bg-green-500" : "bg-red-500"}`}>
//       {status}
//     </span>
//   );

//    const handleViewClick = async (user) => {
//     try {
//       let companyNames = [];

//       if (user.company && Array.isArray(user.company) && user.company.length > 0) {
//         const companyPromises = user.company.map(async (companyId) => {
//           try {
//             const res = await fetch(`${API_URL}/company/${companyId}`);
//             if (!res.ok) return "Unknown";
//             const data = await res.json();
//             return data.company?.companyName || "Unknown";
//           } catch {
//             return "Unknown";
//           }
//         });
//         companyNames = await Promise.all(companyPromises);
//       } else if (user.companyName) companyNames = [user.companyName];
//       else if (user.company && typeof user.company === "object" && user.company._id) {
//         try {
//           const res = await fetch(`${API_URL}/company/${user.company._id}`);
//           if (!res.ok) throw new Error("Failed to fetch company");
//           const data = await res.json();
//           companyNames = [data.company?.companyName || "Unknown"];
//         } catch {
//           companyNames = ["Unknown"];
//         }
//       } else if (user.company && typeof user.company === "string") {
//         try {
//           const res = await fetch(`${API_URL}/company/${user.company}`);
//           const data = await res.json();
//           companyNames = [data.company?.companyName || "Unknown"];
//         } catch {
//           companyNames = ["Unknown"];
//         }
//       }

//       setViewingUser({ ...user, companyNames });
//       setIsViewModalOpen(true);
//     } catch (error) {
//       console.error("Error fetching companies:", error);
//       setViewingUser({ ...user, companyNames: ["Unknown"] });
//       setIsViewModalOpen(true);
//     }
//   };

//   const handleCloseViewModal = () => {
//     setIsViewModalOpen(false);
//     setViewingUser(null);
//   };

//   const handleCloseEditModal = () => {
//     setIsEditModalOpen(false);
//     setEditingUser(null);
//   };

//   const handleSaveUser = (updatedUser) => {
//     fetchData();
//   };

//   // Edit
//   const handleEditClick = (user) => {
//     if (user.role === "Admin" && userRole !== "superAdmin") {
//       alert("You don't have permission to edit admins.");
//       return;
//     }
//     setEditingUser(user);
//     if (user.role === "Admin") setIsAdminEditOpen(true);
//     else setIsEditModalOpen(true);
//   };

//   useEffect(() => {
//     fetchData();
//     fetchCompanies().then(setCompanies);
//   }, []);

//   /* ================= UI ================= */
//   return (
//     <>
//       <div className="bg-white rounded-lg border shadow-sm">
//         <div className="p-4 border-b">
//           <h2 className="font-semibold text-lg">
//             {userRole === "superAdmin" ? "Admin & Employee List" : "Employee List"}
//           </h2>
//         </div>

//         {loading ? (
//           <div className="p-6 text-center">Loading...</div>
//         ) : error ? (
//           <div className="p-6 text-center text-red-500">{error}</div>
//         ) : users.length === 0 ? (
//           <div className="p-6 text-center text-gray-500">No records found</div>
//         ) : (
//           <>
//             {/* ================= DESKTOP TABLE ================= */}
//             <div className="hidden lg:block overflow-x-auto">
//               <table className="w-full min-w-[1000px]">
//                 <thead className="bg-gray-50 text-sm">
//                   <tr>
//                     <th className="p-3 text-left">User</th>
//                     <th className="p-3">Contact</th>
//                     <th className="p-3">Role</th>
//                     <th className="p-3">Company</th>
//                     <th className="p-3">Status</th>
//                     <th className="p-3">Join Date</th>
//                     <th className="p-3">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map((u) => (
//                     <tr key={u._id} className="border-b hover:bg-gray-50">
//                       <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
//               {u.fullName.charAt(0).toUpperCase()}
//             </div>
//             <div>
//               <p className="font-semibold text-gray-800 text-sm">{u.fullName}</p>
//               <p className="text-xs text-gray-500">{u.email}</p>
//             </div>
//           </div>
//                       <td className="p-3 text-sm">{u.phone}</td>
//                       <td className="p-3">{getRoleBadge(u.role)}</td>
//                       <td className="p-3">{u.displayCompanyName}</td>
//                       <td className="p-3">{getStatusBadge(u.accountActive ? "Active" : "Inactive")}</td>
//                       <td className="p-3 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
//                       <td className="p-3 flex gap-2">
//                         <button onClick={() => handleViewClick(u)} className="p-2 bg-blue-100 rounded">
//                           <Eye size={16} />
//                         </button>
//                         <button onClick={() =>{ setEditingUser(u); setIsEditModalOpen(true); }} className="p-2 bg-green-100 rounded">
//                           <Edit2 size={16} />
//                         </button>
//                         <button className="p-2 bg-red-100 rounded">
//                           <Trash2 size={16} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* ================= MOBILE CARDS ================= */}
//             <div className="lg:hidden p-4 space-y-4">
//               {users.map((u) => (
//                 <div key={u._id} className="border rounded-lg p-4 shadow-sm">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//                       {u.fullName?.[0]}
//                     </div>
//                     <div>
//                       <p className="font-medium">{u.fullName}</p>
//                       <p className="text-xs text-gray-500">{u.email}</p>
//                     </div>
//                   </div>

//                   <div className="mt-3 flex flex-wrap gap-2">
//                     {getRoleBadge(u.role)}
//                     {getStatusBadge(u.accountActive ? "Active" : "Inactive")}
//                   </div>

//                   <p className="mt-2 text-sm">
//                     <strong>Company:</strong> {u.displayCompanyName}
//                   </p>

//                   <div className="mt-4 flex gap-2">
//                     <button onClick={() => handleViewClick(u)} className="flex-1 py-2 bg-blue-100 rounded">
//                       View
//                     </button>
//                     <button onClick={() => handleEditClick(u)} className="flex-1 py-2 bg-green-100 rounded">
//                       Edit
//                     </button>
//                     <button onClick={() => deleteUser(u._id, u.role)} className="flex-1 py-2 bg-red-100 rounded">
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>

//       {/* ================= MODALS (UNCHANGED) ================= */}
//       {isViewModalOpen && viewingUser && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg max-w-md w-full">
//             <div className="flex justify-between mb-4">
//               <h2 className="font-semibold text-lg">User Details</h2>
//               <button onClick={() => setIsViewModalOpen(false)}>
//                 <X />
//               </button>
//             </div>
//             <p><strong>Name:</strong> {viewingUser.fullName}</p>
//             <p><strong>Email:</strong> {viewingUser.email}</p>
//             <p><strong>Company:</strong> {viewingUser.displayCompanyName}</p>
//           </div>
//         </div>
//       )}

//       {isEditModalOpen && editingUser && (
//         <EditUser user={editingUser} isOpen onClose={() => setIsEditModalOpen(false)} onSave={fetchData} />
//       )}

//       {isAdminEditOpen && editingUser && (
//         <EditAdmin user={editingUser} isOpen onClose={() => setIsAdminEditOpen(false)} onSave={fetchData} />
//       )}
//     </>
//   );
// };

// export default UserTable;

import { useState, useEffect } from "react";
import { Eye, Edit2, Trash2, X } from "lucide-react";
import EditUser from "./EditUser";
import EditAdmin from "./EditAdmin";

const API_URL = "http://localhost:4000";

const UserTable = ({ onlyAdmins = false }) => {
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAdminEditOpen, setIsAdminEditOpen] = useState(false);
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

            if (onlyAdmins) {
                const adminRes = await fetch(`${API_URL}/getAdmins`);
                const adminData = await adminRes.json();
                if (!adminRes.ok) throw new Error(adminData.message || "Failed to fetch admins");
                // adminData may be an array or an object
                combined = adminData.admins || adminData || [];
            } else if (role === "superAdmin") {
                const [adminRes, employeeRes] = await Promise.all([fetch(`${API_URL}/getAdmins`), fetch(`${API_URL}/employee/allEmployee`)]);

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
                }),
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
        if (user.role === "Admin") setIsAdminEditOpen(true);
        else setIsEditModalOpen(true);
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
            Admin: "bg-purple-100 text-purple-700",
            Manager: "bg-[#2b7fff]",
            "Sales Rep": "bg-[#00c951]",
            Employee: "bg-blue-100 text-blue-700",
        };
        return <span className={`rounded-md px-2 py-1 text-xs font-medium ${colors[role]}`}>{role}</span>;
    };

    const getStatusBadge = (status) => (
        <span className={`rounded-md px-2 py-1 text-xs font-medium text-white ${status === "Active" ? "bg-green-500" : "bg-red-500"}`}>{status}</span>
    );

    return (
        <>
            <div className="w-full min-w-0 px-2 sm:px-4 lg:px-6">
                <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-md">
                    <div className="border-b bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-4">
                        <h2 className="text-lg font-semibold text-blue-900">
                            {userRole === "superAdmin" ? "Admin & Employee List" : "Employee List"}
                        </h2>
                    </div>

                    {/* ================= MOBILE VIEW ================= */}
                    {!loading && !error && users.length > 0 && (
                        <div className="space-y-4 p-3 sm:hidden">
                            {users.map((u) => (
                                <div
                                    key={u._id}
                                    className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm"
                                >
                                    {/* Header */}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex min-w-0 items-center gap-3">
                                            {/* BLUE ICON */}
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                                                {u.fullName?.[0]?.toUpperCase() || "?"}
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate font-semibold text-gray-800">{u.fullName}</p>
                                                <p className="max-w-[220px] truncate text-xs text-gray-500">{u.email}</p>
                                            </div>
                                        </div>

                                        {/* Status on new line to prevent overlap */}
                                        <div className="flex justify-start">{getStatusBadge(u.accountActive ? "Active" : "Inactive")}</div>
                                    </div>

                                    {/* Details */}
                                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                                        <div>
                                            <span className="font-medium">Role:</span> {u.role}
                                        </div>
                                        <div>
                                            <span className="font-medium">Dept:</span>{" "}
                                            {typeof u.department === "string" ? u.department : u.department?.dep || "—"}
                                        </div>
                                        <div className="col-span-2">
                                            <span className="font-medium">Company:</span> {u.displayCompanyName || "—"}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 flex justify-end gap-2">
                                        <button
                                            onClick={() => handleViewClick(u)}
                                            className="rounded-full bg-blue-100 p-2 text-blue-600"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleEditClick(u)}
                                            className="rounded-full bg-blue-100 p-2 text-blue-600"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteUser(u._id, u.role)}
                                            className="rounded-full bg-red-100 p-2 text-red-600"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ================= DESKTOP VIEW ================= */}
                    <div className="hidden overflow-x-auto sm:block">
                        {loading ? (
                            <div className="py-8 text-center font-medium text-blue-600">Loading data...</div>
                        ) : error ? (
                            <div className="py-8 text-center text-red-500">{error}</div>
                        ) : users.length === 0 ? (
                            <div className="py-8 text-center text-gray-500">No records found.</div>
                        ) : (
                            <table className="w-full min-w-[900px] text-sm">
                                <thead className="border-b border-blue-200 bg-blue-50">
                                    <tr className="text-left font-semibold text-blue-800">
                                        <th className="p-3">User</th>
                                        <th className="hidden p-3 sm:table-cell">Contact</th>
                                        <th className="p-3">Role</th>
                                        <th className="hidden p-3 md:table-cell">Department</th>
                                        <th className="hidden p-3 lg:table-cell">Company</th>
                                        <th className="p-3">Status</th>
                                        <th className="hidden p-3 md:table-cell">Join Date</th>
                                        <th className="p-3">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map((u) => (
                                        <tr
                                            key={u._id}
                                            className="border-b border-gray-100 transition-colors hover:bg-blue-50"
                                        >
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-sm font-semibold text-white">
                                                        {u.fullName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800">{u.fullName}</p>
                                                        <p className="text-xs text-gray-500">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="hidden p-3 text-gray-600 sm:table-cell">
                                                {/* <div className="max-w-[180px] truncate">{u.email || "—"}</div> */}
                                                <div className="truncate">{u.phone || "—"}</div>
                                            </td>

                                            <td className="p-3">{getRoleBadge(u.role || "Employee")}</td>

                                            <td className="hidden p-3 text-gray-700 md:table-cell">
                                                {typeof u.department === "string" ? u.department : u.department?.dep || "—"}
                                            </td>

                                            <td className="hidden p-3 text-gray-700 lg:table-cell">{u.displayCompanyName || "—"}</td>

                                            <td className="p-3">{getStatusBadge(u.accountActive ? "Active" : "Inactive")}</td>

                                            <td className="hidden whitespace-nowrap p-3 text-gray-600 md:table-cell">
                                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                                            </td>

                                            <td className="p-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleViewClick(u)}
                                                        className="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditClick(u)}
                                                        className="rounded-full bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteUser(u._id, u.role)}
                                                        className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200"
                                                    >
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
            </div>

            {/* ================= VIEW MODAL ================= */}
            {isViewModalOpen && viewingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/20 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl border border-blue-100 bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b bg-blue-50 p-6">
                            <h2 className="text-lg font-semibold text-blue-900">User Details</h2>
                            <button
                                onClick={handleCloseViewModal}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <div className="space-y-2 p-6 text-sm text-gray-700">
                            <p>
                                <strong>Name:</strong> {viewingUser.fullName}
                            </p>
                            <p>
                                <strong>Email:</strong> {viewingUser.email}
                            </p>
                            <p>
                                <strong>Phone:</strong> {viewingUser.phone}
                            </p>
                            <p>
                                <strong>Department:</strong>{" "}
                                {typeof viewingUser.department === "string" ? viewingUser.department : viewingUser.department?.dep || "—"}
                            </p>
                            <p>
                                <strong>Company:</strong> {viewingUser.companyNames?.join(", ") || "—"}
                            </p>
                            <p>
                                <strong>Role:</strong> {viewingUser.role}
                            </p>
                            <p>
                                <strong>Status:</strong> {viewingUser.accountActive ? "Active" : "Inactive"}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= EDIT MODALS ================= */}
            {isEditModalOpen && editingUser && (
                <EditUser
                    user={editingUser}
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    onSave={handleSaveUser}
                />
            )}

            {isAdminEditOpen && editingUser && (
                <EditAdmin
                    user={editingUser}
                    isOpen={isAdminEditOpen}
                    onClose={() => {
                        setIsAdminEditOpen(false);
                        setEditingUser(null);
                    }}
                    onSave={(updated) => {
                        setIsAdminEditOpen(false);
                        setEditingUser(null);
                        handleSaveUser(updated);
                    }}
                />
            )}
        </>
    );
};

export default UserTable;

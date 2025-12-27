// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { FiChevronDown, FiChevronUp, FiUser, FiMenu, FiX } from "react-icons/fi";

// function EmployeeSidebar() {
//   const location = useLocation();
//   const [openDropdowns, setOpenDropdowns] = useState({});
//   const [roles, setRoles] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const userId = localStorage.getItem("userId");
//   const userRole = localStorage.getItem("role")?.trim()?.toLowerCase();

//   useEffect(() => {
//     const storedEmployee = localStorage.getItem("selectedEmployee");
//     if (storedEmployee) setSelectedEmployee(JSON.parse(storedEmployee));
//   }, []);

//   // 🔹 Helper: Fetch subRole name by ID
//   const fetchSubRoleName = async (subRoleId) => {
//     try {
//       const response = await fetch(
//         `http://localhost:4000/employee/getSubRoleName/${subRoleId}`
//       );
//       const data = await response.json();
//       return data.success ? data.subRoleName : subRoleId; // fallback to ID
//     } catch (error) {
//       console.error("Error fetching subRole name:", error);
//       return subRoleId;
//     }
//   };

//   // 🔹 Fetch assigned roles and resolve subrole names
//   useEffect(() => {
//     if (!userId) return;

//     const fetchAssignedRoles = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `http://localhost:4000/employee/getAssignedRoles/${userId}`
//         );
//         const data = await response.json();

//         if (data.success && Array.isArray(data.assignedRoles)) {
//           const formatted = await Promise.all(
//             data.assignedRoles.map(async (roleItem) => {
//               const subRolesWithNames = await Promise.all(
//                 (roleItem.subRoles || []).map(async (subId) => {
//                   const name = await fetchSubRoleName(subId);
//                   return {
//                     _id: subId,
//                     subRoleName: name,
//                     points: roleItem.points || [],
//                   };
//                 })
//               );

//               return {
//                 _id: roleItem._id,
//                 roleName: roleItem.roleName || "Role",
//                 subRoles: subRolesWithNames,
//               };
//             })
//           );

//           setRoles(formatted);
//         } else {
//           setRoles([]);
//         }
//       } catch (error) {
//         console.error("Error fetching roles:", error);
//         setRoles([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssignedRoles();
//   }, [userId]);

//   const toggleDropdown = (key) =>
//     setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));

//   useEffect(() => setIsMobileMenuOpen(false), [location.pathname]);

//   if (userRole !== "employee") return null;

//   return (
//     <>
//       {/* Mobile toggle */}
//       <button
//         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg hover:bg-gray-800"
//       >
//         {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//       </button>

//       {/* Overlay */}
//       {isMobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed lg:relative w-64 bg-white h-screen border-r border-gray-200 shadow-lg overflow-y-auto transition-all duration-300 z-40
//         ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
//       >
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200 bg-black text-white flex items-center gap-3">
//           <div className="flex size-12 items-center justify-center rounded-lg bg-white text-black text-xl font-bold shadow-md">
//             {selectedEmployee?.name?.[0]?.toUpperCase() || "E"}
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold">
//               {selectedEmployee?.name || "Employee Dashboard"}
//             </h2>
//             <p className="text-gray-300 text-xs mt-1">Employee Panel</p>
//           </div>
//         </div>

//         {/* Sidebar Content */}
//         <div className="p-4">
//           {loading ? (
//             <p className="text-gray-400 text-sm text-center mt-10">
//               Loading roles...
//             </p>
//           ) : roles.length > 0 ? (
//             <ul className="space-y-3">
//               {roles.map((role, index) => {
//   const roleKey = `role-${index}`;
//   const roleOpen = openDropdowns[roleKey];

//   return (
//     <li key={roleKey}>
//       <button
//         onClick={() => toggleDropdown(roleKey)}
//         className={`flex justify-between items-center w-full px-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
//           roleOpen
//             ? "bg-black text-white border-black"
//             : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100"
//         }`}
//       >
//         <div className="flex items-center gap-2">
//           <FiUser />
//           {role.roleName}
//         </div>
//         <span>{roleOpen ? <FiChevronUp /> : <FiChevronDown />}</span>
//       </button>

//       {/* ✅ Always render subroles if they exist */}
//       {roleOpen && role.subRoles?.length > 0 && (
//         <ul className="ml-4 mt-2 space-y-1 border-l border-gray-300 pl-3">
//           {role.subRoles.map((sub) => (
//             <li
//               key={sub._id}
//               className="px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
//             >
//               {sub.subRoleName || "Unnamed SubRole"}
//             </li>
//           ))}
//         </ul>
//       )}
//     </li>
//   );
// })}

//             </ul>
//           ) : (
//             <div className="text-center py-10 text-gray-400">
//               <p className="text-sm">No roles assigned yet.</p>
//             </div>
//           )}
//         </div>
//       </aside>
//     </>
//   );
// }

// export default EmployeeSidebar;




// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { FiChevronDown, FiChevronUp, FiUser, FiMenu, FiX, FiHome } from "react-icons/fi";

// function EmployeeSidebar() {
//   const location = useLocation();
//   const [openDropdowns, setOpenDropdowns] = useState({});
//   const [roles, setRoles] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const userId = localStorage.getItem("userId");
//   const userRole = localStorage.getItem("role")?.trim()?.toLowerCase();

//   // Load selected employee
//   useEffect(() => {
//     const storedEmployee = localStorage.getItem("selectedEmployee");
//     if (storedEmployee) setSelectedEmployee(JSON.parse(storedEmployee));
//   }, []);

//   // Fetch subrole name
//   const fetchSubRoleName = async (subRoleId) => {
//     try {
//       const res = await fetch(`http://localhost:4000/employee/getSubRoleName/${subRoleId}`);
//       const data = await res.json();
//       return data.success ? data.subRoleName : subRoleId;
//     } catch (err) {
//       console.error(err);
//       return subRoleId;
//     }
//   };

//   // Fetch assigned roles
//   useEffect(() => {
//     if (!userId) return;

//     const fetchRoles = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`http://localhost:4000/employee/getAssignedRoles/${userId}`);
//         const data = await res.json();
//         if (data.success && Array.isArray(data.assignedRoles)) {
//           const formatted = await Promise.all(
//             data.assignedRoles.map(async (roleItem) => {
//               const subRoles = await Promise.all(
//                 (roleItem.subRoles || []).map(async (subId) => {
//                   const name = await fetchSubRoleName(subId);
//                   return { _id: subId, subRoleName: name };
//                 })
//               );
//               return { _id: roleItem._id, roleName: roleItem.roleName || "Role", subRoles };
//             })
//           );
//           setRoles(formatted);
//         } else {
//           setRoles([]);
//         }
//       } catch (err) {
//         console.error(err);
//         setRoles([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRoles();
//   }, [userId]);

//   // Toggle dropdown
//   const toggleDropdown = (key) => setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }));

//   // Close mobile menu on route change
//   useEffect(() => setIsMobileMenuOpen(false), [location.pathname]);

//   // Map subrole names to route
//   const getSubRoleRoute = (name) => {
//     if (!name) return "/";
//     const normalized = name.toLowerCase();
//     if (normalized.includes("lead")) return "/lead-management"; // all leads go here
//     return `/${normalized.replace(/\s+/g, "-")}`;
//   };

//   if (userRole !== "employee") return null;

//   return (
//     <>
//       {/* Mobile toggle */}
//       <button
//         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg"
//       >
//         {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//       </button>

//       {/* Overlay */}
//       {isMobileMenuOpen && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsMobileMenuOpen(false)} />}

//       {/* Sidebar */}
//       <aside className={`fixed lg:relative w-64 h-screen bg-white border-r border-gray-200 shadow-lg overflow-y-auto transition-transform z-40 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200 bg-black text-white flex items-center gap-3">
//           <div className="flex items-center justify-center rounded-lg bg-white text-black text-xl font-bold w-10 h-10">
//             {selectedEmployee?.name?.[0]?.toUpperCase() || "E"}
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold">{selectedEmployee?.name || "Employee Dashboard"}</h2>
//             <p className="text-gray-300 text-xs mt-1">Employee Panel</p>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-4">
//           <ul className="space-y-2">
//             <li>
//               <Link to="/dashboard" className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${location.pathname === "/dashboard" ? "bg-black text-white" : "hover:bg-gray-100 text-gray-800"}`}>
//                 <FiHome /> Dashboard
//               </Link>
//             </li>
//           </ul>

//           {loading ? (
//             <p className="text-gray-400 text-sm mt-4 text-center">Loading roles...</p>
//           ) : roles.length > 0 ? (
//             <ul className="mt-4 space-y-2">
//               {roles.map((role, idx) => {
//                 const key = `role-${idx}`;
//                 const isOpen = openDropdowns[key];
//                 return (
//                   <li key={key}>
//                     <button onClick={() => toggleDropdown(key)} className={`flex justify-between items-center w-full px-4 py-2 rounded-lg font-semibold border transition-colors ${isOpen ? "bg-black text-white border-black" : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100"}`}>
//                       <div className="flex items-center gap-2"><FiUser /> {role.roleName}</div>
//                       {isOpen ? <FiChevronUp /> : <FiChevronDown />}
//                     </button>

//                     {isOpen && role.subRoles?.length > 0 && (
//                       <ul className="ml-4 mt-1 space-y-1 border-l border-gray-300 pl-3">
//                         {role.subRoles.map(sub => {
//                           const route = getSubRoleRoute(sub.subRoleName);
//                           const active = location.pathname === route;
//                           return (
//                             <li key={sub._id}>
//                               <Link to={route} className={`block px-3 py-2 rounded-md text-sm ${active ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"}`}>
//                                 {sub.subRoleName}
//                               </Link>
//                             </li>
//                           );
//                         })}
//                       </ul>
//                     )}
//                   </li>
//                 );
//               })}
//             </ul>
//           ) : (
//             <p className="text-gray-400 text-center mt-4">No roles assigned yet.</p>
//           )}
//         </div>
//       </aside>
//     </>
//   );
// }

// export default EmployeeSidebar;




// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   FiChevronDown,
//   FiChevronUp,
//   FiUser,
//   FiMenu,
//   FiX,
//   FiHome,
// } from "react-icons/fi";

// function EmployeeSidebar() {
//   const location = useLocation();
//   const [openDropdowns, setOpenDropdowns] = useState({});
//   const [roles, setRoles] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const userId = localStorage.getItem("userId");
//   const userRole = localStorage.getItem("role")?.trim()?.toLowerCase();

//   // Fetch employee details using stored id
//   useEffect(() => {
//     const fetchEmployee = async () => {
//       const storedEmployee = localStorage.getItem("selectedEmployee");
//       if (!storedEmployee) return;

//       const { id } = JSON.parse(storedEmployee); // expecting { id: "..." }
//       if (!id) return;

//       try {
//         const res = await fetch(`http://localhost:4000/employee/${id}`);
//         const data = await res.json();
//         if (data.success && data.employee) {
//           setSelectedEmployee(data.employee);
//         } else {
//           setSelectedEmployee({ id }); // fallback
//         }
//       } catch (err) {
//         console.error(err);
//         setSelectedEmployee({ id }); // fallback
//       }
//     };

//     fetchEmployee();
//   }, []);

//   // Fetch subrole name
//   const fetchSubRoleName = async (subRoleId) => {
//     try {
//       const res = await fetch(
//         `http://localhost:4000/employee/getSubRoleName/${subRoleId}`
//       );
//       const data = await res.json();
//       return data.success ? data.subRoleName : subRoleId;
//     } catch (err) {
//       console.error(err);
//       return subRoleId;
//     }
//   };

//   // Fetch assigned roles
//   useEffect(() => {
//     if (!userId) return;

//     const fetchRoles = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(
//           `http://localhost:4000/employee/getAssignedRoles/${userId}`
//         );
//         const data = await res.json();
//         if (data.success && Array.isArray(data.assignedRoles)) {
//           const formatted = await Promise.all(
//             data.assignedRoles.map(async (roleItem) => {
//               const subRoles = await Promise.all(
//                 (roleItem.subRoles || []).map(async (subId) => {
//                   const name = await fetchSubRoleName(subId);
//                   return { _id: subId, subRoleName: name };
//                 })
//               );
//               return {
//                 _id: roleItem._id,
//                 roleName: roleItem.roleName || "Role",
//                 subRoles,
//               };
//             })
//           );
//           setRoles(formatted);
//         } else {
//           setRoles([]);
//         }
//       } catch (err) {
//         console.error(err);
//         setRoles([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRoles();
//   }, [userId]);

//   // Toggle dropdown
//   const toggleDropdown = (key) =>
//     setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));

//   // Close mobile menu on route change
//   useEffect(() => setIsMobileMenuOpen(false), [location.pathname]);

//   // Map subrole names to route
//   const getSubRoleRoute = (name) => {
//     if (!name) return "/";
//     const normalized = name.toLowerCase();
//     if (normalized.includes("lead")) return "/lead-management"; // all leads go here
//     return `/${normalized.replace(/\s+/g, "-")}`;
//   };

//   if (userRole !== "employee") return null;

//   return (
//     <>
//       {/* Mobile toggle */}
//       <button
//         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg"
//       >
//         {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//       </button>

//       {/* Overlay */}
//       {isMobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed lg:relative w-64 h-screen bg-white border-r border-gray-200 shadow-lg overflow-y-auto transition-transform z-40 ${
//           isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//         }`}
//       >
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200 bg-black text-white flex items-center gap-3">
//           <div className="flex items-center justify-center rounded-lg bg-white text-black text-xl font-bold w-10 h-10">
//             {selectedEmployee?.name?.[0]?.toUpperCase() ||
//               selectedEmployee?.id?.[0] ||
//               "E"}
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold">
//               {selectedEmployee?.name || "Employee Dashboard"}
//             </h2>
//             <p className="text-gray-300 text-xs mt-1">Employee Panel</p>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-4">
//           <ul className="space-y-2">
//             <li>
//               <Link
//                 to="/dashboard"
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
//                   location.pathname === "/dashboard"
//                     ? "bg-black text-white"
//                     : "hover:bg-gray-100 text-gray-800"
//                 }`}
//               >
//                 <FiHome /> Dashboard
//               </Link>
//             </li>
//           </ul>

//           {loading ? (
//             <p className="text-gray-400 text-sm mt-4 text-center">
//               Loading roles...
//             </p>
//           ) : roles.length > 0 ? (
//             <ul className="mt-4 space-y-2">
//               {roles.map((role, idx) => {
//                 const key = `role-${idx}`;
//                 const isOpen = openDropdowns[key];
//                 return (
//                   <li key={key}>
//                     <button
//                       onClick={() => toggleDropdown(key)}
//                       className={`flex justify-between items-center w-full px-4 py-2 rounded-lg font-semibold border transition-colors ${
//                         isOpen
//                           ? "bg-black text-white border-black"
//                           : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100"
//                       }`}
//                     >
//                       <div className="flex items-center gap-2">
//                         <FiUser /> {role.roleName}
//                       </div>
//                       {isOpen ? <FiChevronUp /> : <FiChevronDown />}
//                     </button>

//                     {isOpen && role.subRoles?.length > 0 && (
//                       <ul className="ml-4 mt-1 space-y-1 border-l border-gray-300 pl-3">
//                         {role.subRoles.map((sub) => {
//                           const route = getSubRoleRoute(sub.subRoleName);
//                           const active = location.pathname === route;
//                           return (
//                             <li key={sub._id}>
//                               <Link
//                                 to={route}
//                                 className={`block px-3 py-2 rounded-md text-sm ${
//                                   active
//                                     ? "bg-black text-white"
//                                     : "text-gray-700 hover:bg-gray-100"
//                                 }`}
//                               >
//                                 {sub.subRoleName}
//                               </Link>
//                             </li>
//                           );
//                         })}
//                       </ul>
//                     )}
//                   </li>
//                 );
//               })}
//             </ul>
//           ) : (
//             <p className="text-gray-400 text-center mt-4">
//               No roles assigned yet.
//             </p>
//           )}
//         </div>
//       </aside>
//     </>
//   );
// }

// export default EmployeeSidebar;





// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   FiChevronDown,
//   FiChevronUp,
//   FiUser,
//   FiMenu,
//   FiX,
//   FiHome,
// } from "react-icons/fi";

// function EmployeeSidebar() {
//   const location = useLocation();
//   const [openDropdowns, setOpenDropdowns] = useState({});
//   const [roles, setRoles] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const userId = localStorage.getItem("userId");
//   const userRole = localStorage.getItem("role")?.trim()?.toLowerCase();

//   // Fetch employee details using stored id
//   useEffect(() => {
//     const fetchEmployee = async () => {
//       const storedEmployee = localStorage.getItem("selectedEmployee");
//       if (!storedEmployee) return;

//       const { id } = JSON.parse(storedEmployee); // expecting { id: "..." }
//       if (!id) return;

//       try {
//         const res = await fetch(`http://localhost:4000/employee/${id}`);
//         const data = await res.json();
//         if (data.success && data.employee) {
//           setSelectedEmployee(data.employee);
//         } else {
//           setSelectedEmployee({ id }); // fallback
//         }
//       } catch (err) {
//         console.error(err);
//         setSelectedEmployee({ id }); // fallback
//       }
//     };

//     fetchEmployee();
//   }, []);

//   // Fetch subrole name
//   const fetchSubRoleName = async (subRoleId) => {
//     try {
//       const res = await fetch(
//         `http://localhost:4000/employee/getSubRoleName/${subRoleId}`
//       );
//       const data = await res.json();
//       return data.success ? data.subRoleName : subRoleId;
//     } catch (err) {
//       console.error(err);
//       return subRoleId;
//     }
//   };

//   // Fetch assigned roles
//   useEffect(() => {
//     if (!userId) return;

//     const fetchRoles = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(
//           `http://localhost:4000/employee/getAssignedRoles/${userId}`
//         );
//         const data = await res.json();
//         if (data.success && Array.isArray(data.assignedRoles)) {
//           const formatted = await Promise.all(
//             data.assignedRoles.map(async (roleItem) => {
//               const subRoles = await Promise.all(
//                 (roleItem.subRoles || []).map(async (subId) => {
//                   const name = await fetchSubRoleName(subId);
//                   return { _id: subId, subRoleName: name };
//                 })
//               );
//               return {
//                 _id: roleItem._id,
//                 roleName: roleItem.roleName || "Role",
//                 subRoles,
//               };
//             })
//           );
//           setRoles(formatted);
//         } else {
//           setRoles([]);
//         }
//       } catch (err) {
//         console.error(err);
//         setRoles([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRoles();
//   }, [userId]);

//   // Toggle dropdown
//   const toggleDropdown = (key) =>
//     setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));

//   // Close mobile menu on route change
//   useEffect(() => setIsMobileMenuOpen(false), [location.pathname]);

//   // Map subrole names to route
//   const getSubRoleRoute = (name) => {
//     if (!name) return "/";
//     const normalized = name.trim().toLowerCase();

//     // Custom mapping for "My Leads"
//     if (normalized === "my leads") return "/addmylead";

//     // Default lead mapping
//     if (normalized.includes("lead")) return "/lead-management";

//     // Fallback for other subroles
//     return `/${normalized.replace(/\s+/g, "-")}`;
//   };

//   if (userRole !== "employee") return null;

//   return (
//     <>
//       {/* Mobile toggle */}
//       <button
//         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg"
//       >
//         {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//       </button>

//       {/* Overlay */}
//       {isMobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed lg:relative w-64 h-screen bg-white border-r border-gray-200 shadow-lg overflow-y-auto transition-transform z-40 ${
//           isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//         }`}
//       >
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200 bg-black text-white flex items-center gap-3">
//           <div className="flex items-center justify-center rounded-lg bg-white text-black text-xl font-bold w-10 h-10">
//             {selectedEmployee?.name?.[0]?.toUpperCase() ||
//               selectedEmployee?.id?.[0] ||
//               "E"}
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold">
//               {selectedEmployee?.name || "Employee Dashboard"}
//             </h2>
//             <p className="text-gray-300 text-xs mt-1">Employee Panel</p>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-4">
//           <ul className="space-y-2">
//             <li>
//               <Link
//                 to="/dashboard"
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
//                   location.pathname === "/dashboard"
//                     ? "bg-black text-white"
//                     : "hover:bg-gray-100 text-gray-800"
//                 }`}
//               >
//                 <FiHome /> Dashboard
//               </Link>
//             </li>
//           </ul>

//           {loading ? (
//             <p className="text-gray-400 text-sm mt-4 text-center">
//               Loading roles...
//             </p>
//           ) : roles.length > 0 ? (
//             <ul className="mt-4 space-y-2">
//               {roles.map((role, idx) => {
//                 const key = `role-${idx}`;
//                 const isOpen =
//                   openDropdowns[key] ||
//                   role.subRoles?.some(
//                     (sub) => getSubRoleRoute(sub.subRoleName) === location.pathname
//                   ); // auto-expand if route matches

//                 return (
//                   <li key={key}>
//                     <button
//                       onClick={() => toggleDropdown(key)}
//                       className={`flex justify-between items-center w-full px-4 py-2 rounded-lg font-semibold border transition-colors ${
//                         isOpen
//                           ? "bg-black text-white border-black"
//                           : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100"
//                       }`}
//                     >
//                       <div className="flex items-center gap-2">
//                         <FiUser /> {role.roleName}
//                       </div>
//                       {isOpen ? <FiChevronUp /> : <FiChevronDown />}
//                     </button>

//                     {isOpen && role.subRoles?.length > 0 && (
//                       <ul className="ml-4 mt-1 space-y-1 border-l border-gray-300 pl-3">
//                         {role.subRoles.map((sub) => {
//                           const route = getSubRoleRoute(sub.subRoleName);
//                           const active = location.pathname === route;
//                           return (
//                             <li key={sub._id}>
//                               <Link
//                                 to={route}
//                                 className={`block px-3 py-2 rounded-md text-sm ${
//                                   active
//                                     ? "bg-black text-white"
//                                     : "text-gray-700 hover:bg-gray-100"
//                                 }`}
//                               >
//                                 {sub.subRoleName}
//                               </Link>
//                             </li>
//                           );
//                         })}
//                       </ul>
//                     )}
//                   </li>
//                 );
//               })}
//             </ul>
//           ) : (
//             <p className="text-gray-400 text-center mt-4">
//               No roles assigned yet.
//             </p>
//           )}
//         </div>
//       </aside>
//     </>
//   );
// }

// export default EmployeeSidebar;





// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";

// function EmployeeSidebar() {
//   const location = useLocation();
//   const [roles, setRoles] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const userId = localStorage.getItem("userId");
//   const userRole = localStorage.getItem("role")?.trim()?.toLowerCase();

//   useEffect(() => {
//     const fetchEmployee = async () => {
//       const storedEmployee = localStorage.getItem("selectedEmployee");
//       if (!storedEmployee) return;

//       const { id } = JSON.parse(storedEmployee);
//       if (!id) return;

//       try {
//         const res = await fetch(`http://localhost:4000/employee/${id}`);
//         const data = await res.json();
//         if (data.success && data.employee) {
//           setSelectedEmployee(data.employee);
//         } else {
//           setSelectedEmployee({ id });
//         }
//       } catch (err) {
//         console.error(err);
//         setSelectedEmployee({ id });
//       }
//     };

//     fetchEmployee();
//   }, []);

//   const fetchSubRoleName = async (subRoleId) => {
//     try {
//       const res = await fetch(
//         `http://localhost:4000/employee/getSubRoleName/${subRoleId}`
//       );
//       const data = await res.json();
//       return data.success ? data.subRoleName : subRoleId;
//     } catch (err) {
//       console.error(err);
//       return subRoleId;
//     }
//   };

//   useEffect(() => {
//     if (!userId) return;

//     const fetchRoles = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(
//           `http://localhost:4000/employee/getAssignedRoles/${userId}`
//         );
//         const data = await res.json();
//         if (data.success && Array.isArray(data.assignedRoles)) {
//           const allSubRoles = [];

//           for (const roleItem of data.assignedRoles) {
//             if (roleItem.subRoles && roleItem.subRoles.length > 0) {
//               for (const subId of roleItem.subRoles) {
//                 const name = await fetchSubRoleName(subId);
//                 allSubRoles.push({ _id: subId, subRoleName: name });
//               }
//             }
//           }

//           setRoles(allSubRoles);
//         } else {
//           setRoles([]);
//         }
//       } catch (err) {
//         console.error(err);
//         setRoles([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRoles();
//   }, [userId]);

//   useEffect(() => setIsMobileMenuOpen(false), [location.pathname]);

//   const getSubRoleRoute = (name) => {
//     if (!name) return "/";
//     const normalized = name.toLowerCase();
//     if (normalized === "my lead" || normalized === "mylead") return "/addmylead";
//     if (normalized.includes("lead")) return "/lead-management";
//     return `/${normalized.replace(/\s+/g, "-")}`;
//   };

//   if (userRole !== "employee") return null;

//   return (
//     <>
//       {/* Mobile toggle */}
//       <button
//         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg"
//       >
//         {isMobileMenuOpen ? "Close" : "Menu"}
//       </button>

//       {/* Overlay */}
//       {isMobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed lg:relative w-64 h-screen bg-white border-r border-gray-200 shadow-lg overflow-y-auto transition-transform z-40 ${
//           isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//         }`}
//       >
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200 bg-black text-white flex items-center gap-3">
//           <div className="flex items-center justify-center rounded-lg bg-white text-black text-xl font-bold w-10 h-10">
//             {selectedEmployee?.name?.[0]?.toUpperCase() ||
//               selectedEmployee?.id?.[0] ||
//               "E"}
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold">
//               {selectedEmployee?.name || "Employee Dashboard"}
//             </h2>
//             <p className="text-gray-300 text-xs mt-1">Employee Panel</p>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-4">
//           <div className="space-y-2">
//             <Link
//               to="/dashboard"
//               className={`block px-4 py-2 rounded-lg font-medium ${
//                 location.pathname === "/dashboard"
//                   ? "bg-black text-white"
//                   : "hover:bg-gray-100 text-gray-800"
//               }`}
//             >
//               Dashboard
//             </Link>

//             {loading ? (
//               <p className="text-gray-400 text-sm mt-4 text-center">Loading...</p>
//             ) : roles.length > 0 ? (
//               roles.map((sub) => {
//                 const route = getSubRoleRoute(sub.subRoleName);
//                 const active = location.pathname === route;
//                 return (
//                   <Link
//                     key={sub._id}
//                     to={route}
//                     className={`block px-4 py-2 rounded-lg font-medium ${
//                       active ? "bg-black text-white" : "hover:bg-gray-100 text-gray-800"
//                     }`}
//                   >
//                     {sub.subRoleName}
//                   </Link>
//                 );
//               })
//             ) : (
//               <p className="text-gray-400 text-center mt-4">No roles assigned yet.</p>
//             )}
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }

// export default EmployeeSidebar;





// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";

// function EmployeeSidebar() {
//   const location = useLocation();
//   const [roles, setRoles] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const userId = localStorage.getItem("userId");
//   const userRole = localStorage.getItem("role")?.trim()?.toLowerCase();

//   useEffect(() => {
//     const fetchEmployee = async () => {
//       const storedEmployee = localStorage.getItem("selectedEmployee");
//       if (!storedEmployee) return;

//       const { id } = JSON.parse(storedEmployee);
//       if (!id) return;

//       try {
//         const res = await fetch(`http://localhost:4000/employee/${id}`);
//         const data = await res.json();
//         if (data.success && data.employee) {
//           setSelectedEmployee(data.employee);
//         } else {
//           setSelectedEmployee({ id });
//         }
//       } catch (err) {
//         console.error(err);
//         setSelectedEmployee({ id });
//       }
//     };

//     fetchEmployee();
//   }, []);

//   const fetchSubRoleName = async (subRoleId) => {
//     try {
//       const res = await fetch(
//         `http://localhost:4000/employee/getSubRoleName/${subRoleId}`
//       );
//       const data = await res.json();
//       return data.success ? data.subRoleName : subRoleId;
//     } catch (err) {
//       console.error(err);
//       return subRoleId;
//     }
//   };

//   useEffect(() => {
//     if (!userId) return;

//     const fetchRoles = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(
//           `http://localhost:4000/employee/getAssignedRoles/${userId}`
//         );
//         const data = await res.json();
//         if (data.success && Array.isArray(data.assignedRoles)) {
//           const allSubRoles = [];

//           for (const roleItem of data.assignedRoles) {
//             if (roleItem.subRoles && roleItem.subRoles.length > 0) {
//               for (const subId of roleItem.subRoles) {
//                 const name = await fetchSubRoleName(subId);
//                 allSubRoles.push({ _id: subId, subRoleName: name });
//               }
//             }
//           }

//           setRoles(allSubRoles);
//         } else {
//           setRoles([]);
//         }
//       } catch (err) {
//         console.error(err);
//         setRoles([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRoles();
//   }, [userId]);

//   useEffect(() => setIsMobileMenuOpen(false), [location.pathname]);

//   const getSubRoleRoute = (name) => {
//     if (!name) return "/";

//     const normalized = name.toLowerCase();

//     // Explicit mapping for B2B routes
//     if (normalized === "create destination" || normalized === "destination") {
//       return "/b2b-destination";  // Correct route for Create Destination
//     }

//     if (normalized === "add company" || normalized === "b2b add company") {
//       return "/b2b-addcompany";  // Correct route for Add Company
//     }

//     if (normalized === "my lead" || normalized === "mylead") return "/addmylead";
//     if (normalized.includes("lead")) return "/lead-management";
    
//     return `/${normalized.replace(/\s+/g, "-")}`;
//   };

//   if (userRole !== "employee") return null;

//   return (
//     <>
//       {/* Mobile toggle */}
//       <button
//         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg"
//       >
//         {isMobileMenuOpen ? "Close" : "Menu"}
//       </button>

//       {/* Overlay */}
//       {isMobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed lg:relative w-64 h-screen bg-white border-r border-gray-200 shadow-lg overflow-y-auto transition-transform z-40 ${
//           isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//         }`}
//       >
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200 bg-black text-white flex items-center gap-3">
//           <div className="flex items-center justify-center rounded-lg bg-white text-black text-xl font-bold w-10 h-10">
//             {selectedEmployee?.name?.[0]?.toUpperCase() ||
//               selectedEmployee?.id?.[0] ||
//               "E"}
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold">
//               {selectedEmployee?.name || "Employee Dashboard"}
//             </h2>
//             <p className="text-gray-300 text-xs mt-1">Employee Panel</p>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-4">
//           <div className="space-y-2">
//             <Link
//               to="/dashboard"
//               className={`block px-4 py-2 rounded-lg font-medium ${
//                 location.pathname === "/dashboard"
//                   ? "bg-black text-white"
//                   : "hover:bg-gray-100 text-gray-800"
//               }`}
//             >
//               Dashboard
//             </Link>

//             {loading ? (
//               <p className="text-gray-400 text-sm mt-4 text-center">Loading...</p>
//             ) : roles.length > 0 ? (
//               roles.map((sub) => {
//                 const route = getSubRoleRoute(sub.subRoleName);
//                 const active = location.pathname === route;
//                 return (
//                   <Link
//                     key={sub._id}
//                     to={route}
//                     className={`block px-4 py-2 rounded-lg font-medium ${
//                       active ? "bg-black text-white" : "hover:bg-gray-100 text-gray-800"
//                     }`}
//                   >
//                     {sub.subRoleName}
//                   </Link>
//                 );
//               })
//             ) : (
//               <p className="text-gray-400 text-center mt-4">No roles assigned yet.</p>
//             )}
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }

// export default EmployeeSidebar;



import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiLock } from "react-icons/fi";

function EmployeeSidebar() {
  const location = useLocation();
  const [roles, setRoles] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role")?.trim()?.toLowerCase();

  useEffect(() => {
    const fetchEmployee = async () => {
      const storedEmployee = localStorage.getItem("selectedEmployee");
      if (!storedEmployee) return;

      const { id } = JSON.parse(storedEmployee);
      if (!id) return;

      try {
        const res = await fetch(`http://localhost:4000/employee/${id}`);
        const data = await res.json();
        if (data.success && data.employee) {
          setSelectedEmployee(data.employee);
        } else {
          setSelectedEmployee({ id });
        }
      } catch (err) {
        console.error(err);
        setSelectedEmployee({ id });
      }
    };

    fetchEmployee();
  }, []);

  const fetchSubRoleName = async (subRoleId) => {
    try {
      const res = await fetch(
        `http://localhost:4000/employee/getSubRoleName/${subRoleId}`
      );
      const data = await res.json();
      return data.success ? data.subRoleName : subRoleId;
    } catch (err) {
      console.error(err);
      return subRoleId;
    }
  };

  useEffect(() => {
    if (!userId) return;

    const fetchRoles = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:4000/employee/getAssignedRoles/${userId}`
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.assignedRoles)) {
          const allSubRoles = [];

          for (const roleItem of data.assignedRoles) {
            if (roleItem.subRoles && roleItem.subRoles.length > 0) {
              for (const sub of roleItem.subRoles) {
                // `sub` may be a string id or an object { _id, name | subRoleName }
                if (!sub) continue;
                if (typeof sub === "string") {
                  const name = await fetchSubRoleName(sub);
                  allSubRoles.push({ _id: sub, subRoleName: name });
                } else if (typeof sub === "object") {
                  const id = sub._id || sub.id || sub.subRoleId || "";
                  const name = sub.name || sub.subRoleName || (id ? await fetchSubRoleName(id) : id);
                  allSubRoles.push({ _id: id, subRoleName: name });
                } else {
                  const sid = String(sub);
                  const name = await fetchSubRoleName(sid);
                  allSubRoles.push({ _id: sid, subRoleName: name });
                }
              }
            }
          }

          // Ensure any items still missing a readable name are resolved
          const resolved = await Promise.all(
            allSubRoles.map(async (item) => {
              if (!item.subRoleName || item.subRoleName === item._id) {
                try {
                  const name = await fetchSubRoleName(item._id);
                  return { ...item, subRoleName: name };
                } catch (e) {
                  return item;
                }
              }
              return item;
            })
          );

          setRoles(resolved);
        } else {
          setRoles([]);
        }
      } catch (err) {
        console.error(err);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [userId]);

  useEffect(() => setIsMobileMenuOpen(false), [location.pathname]);

  const getSubRoleRoute = (name) => {
    if (!name) return "/";

    // Accept either a string or an object (e.g. { subRoleName, name })
    const text = typeof name === "string" ? name : (name?.subRoleName || name?.name || String(name));
    const normalized = String(text).toLowerCase();

    // B2B routes
    if (normalized === "create destination") return "/b2b-destination";
    if (normalized === "add company" || normalized === "b2b add company") return "/b2b-addcompany";

    // New fixed routes
    if (normalized === "add state") return "/createstate";
    if (normalized === "add destination") return "/createdestination";
    if (normalized === "add hotel") return "/createhotel";
    if (normalized === "add transport") return "/createtransport";

    // Lead routes
    if (normalized === "my lead" || normalized === "mylead") return "/addmylead";
    if (normalized.includes("lead")) return "/lead-management";

    // Fallback: generate slug from name
    return `/${normalized.replace(/\s+/g, "-")}`;
  };

  if (userRole !== "employee") return null;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg"
      >
        {isMobileMenuOpen ? "Close" : "Menu"}
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative w-64 h-screen bg-white border-r border-gray-200 shadow-lg overflow-y-auto transition-transform z-40 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-black text-white flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg bg-white text-black text-xl font-bold w-10 h-10">
            {selectedEmployee?.name?.[0]?.toUpperCase() ||
              selectedEmployee?.id?.[0] ||
              "E"}
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {selectedEmployee?.name || "Employee Dashboard"}
            </h2>
            <p className="text-gray-300 text-xs mt-1">Employee Panel</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="space-y-2">
            <Link
              to="/dashboard"
              className={`block px-4 py-2 rounded-lg font-medium ${
                location.pathname === "/dashboard"
                  ? "bg-black text-white"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
            >
              Dashboard
            </Link>

            {loading ? (
              <p className="text-gray-400 text-sm mt-4 text-center">Loading...</p>
            ) : roles.length > 0 ? (
              roles.map((sub) => {
                const route = getSubRoleRoute(sub.subRoleName);
                const active = location.pathname === route;
                const label = sub?.subRoleName || sub?.name || sub?.roleName || sub?._id || String(sub);
                const key = sub?._id || label;
                return (
                  <Link
                    key={key}
                    to={getSubRoleRoute(label)}
                    className={`block px-4 py-2 rounded-lg font-medium ${
                      active ? "bg-black text-white" : "hover:bg-gray-100 text-gray-800"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })
            ) : (
              <p className="text-gray-400 text-center mt-4">No roles assigned yet.</p>
            )}
          </div>

          <div className="mt-8 border-t border-gray-200 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Account</p>
            <Link
              to="/change-password"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium ${
                location.pathname === "/change-password"
                  ? "bg-black text-white"
                  : "text-gray-800 hover:bg-gray-100"
              }`}
            >
              <FiLock className="text-lg" />
              Change Password
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

export default EmployeeSidebar;


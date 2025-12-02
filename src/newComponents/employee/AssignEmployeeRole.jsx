// import React, { useEffect, useState } from "react";

// const AssignEmployeeRole = () => {
//   const [employees, setEmployees] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const [formData, setFormData] = useState({
//     selectedEmployee: "",
//     selectedCompany: "",
//     selectedRoles: [],
//     selectedSubRoles: [],
//     selectedPoints: [],
//   });

//   /* ==============================
//         FETCHING FUNCTIONS
//   ============================== */

//   const getAllEmployees = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/employee/allEmployee");
//       const data = await res.json();
//       if (res.ok) setEmployees(data.employees || []);
//     } catch (err) {
//       console.error("❌ Error fetching employees:", err);
//     }
//   };

//   const getAllRoles = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/role/getrole");
//       const data = await res.json();
//       if (res.ok) setRoles(data.data || []);
//     } catch (err) {
//       console.error("❌ Error fetching roles:", err);
//     }
//   };

//   const getAllCompanies = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/company/all");
//       const data = await res.json();
//       if (res.ok) setCompanies(data.companies || []);
//     } catch (err) {
//       console.error("❌ Error fetching companies:", err);
//     }
//   };

//   const getCompaniesByEmployee = async (employeeId) => {
//     try {
//       const res = await fetch(
//         `http://localhost:4000/employee/getCompanyByEmployeeId/${employeeId}`
//       );
//       const data = await res.json();
//       if (res.ok && data.success) setCompanies(data.assignedCompanies || []);
//       else await getAllCompanies();
//     } catch (err) {
//       console.error("❌ Error fetching employee companies:", err);
//       await getAllCompanies();
//     }
//   };

//   /* ==============================
//         USE EFFECT HOOKS
//   ============================== */
//   useEffect(() => {
//     getAllEmployees();
//     getAllRoles();
//   }, []);

//   useEffect(() => {
//     if (formData.selectedEmployee) getCompaniesByEmployee(formData.selectedEmployee);
//     else setCompanies([]);
//     setFormData((prev) => ({ ...prev, selectedCompany: "" }));
//   }, [formData.selectedEmployee]);

//   /* ==============================
//         TOGGLE HELPERS
//   ============================== */
//   const toggleSelection = (array, item) =>
//     array.includes(item) ? array.filter((i) => i !== item) : [...array, item];

//   const handleRoleToggle = (roleId) => {
//     setFormData((prev) => {
//       const updatedRoles = toggleSelection(prev.selectedRoles, roleId);

//       // Remove subRoles and points if parent role is unchecked
//       let updatedSubRoles = prev.selectedSubRoles;
//       let updatedPoints = prev.selectedPoints;
//       if (!updatedRoles.includes(roleId)) {
//         const role = roles.find((r) => r._id === roleId);
//         if (role && role.subRole) {
//           const subRoleIds = role.subRole.map((s) => s._id);
//           updatedSubRoles = prev.selectedSubRoles.filter((sr) => !subRoleIds.includes(sr));

//           const rolePoints = role.subRole.flatMap((s) => s.points || []);
//           updatedPoints = prev.selectedPoints.filter((p) => !rolePoints.includes(p));
//         }
//       }

//       return {
//         ...prev,
//         selectedRoles: updatedRoles,
//         selectedSubRoles: updatedSubRoles,
//         selectedPoints: updatedPoints,
//       };
//     });
//   };

//   const handleSubRoleToggle = (subRoleId) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedSubRoles: toggleSelection(prev.selectedSubRoles, subRoleId),
//     }));
//   };

//   const handlePointToggle = (point) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedPoints: toggleSelection(prev.selectedPoints, point),
//     }));
//   };

//   /* ==============================
//         ASSIGN ROLE HANDLER
//   ============================== */
//   const handleAssign = async () => {
//     const { selectedEmployee, selectedCompany, selectedRoles, selectedSubRoles, selectedPoints } = formData;

//     if (!selectedEmployee) return alert("Please select an employee.");
//     if (!selectedCompany) return alert("Please select a company.");
//     if (!selectedRoles.length) return alert("Please select at least one role.");

//     setLoading(true);
//     setMessage("");

//     try {
//       const payload = {
//         employeeId: selectedEmployee,
//         companyIds: [selectedCompany],
//         workRoles: selectedRoles,
//         subRoles: selectedSubRoles,
//         points: selectedPoints,
//       };

//       console.log("📤 Sending Payload:", payload);

//       const res = await fetch("http://localhost:4000/employee/assignRole", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const result = await res.json();
//       console.log("📥 Response:", result);

//       if (res.ok) {
//         setMessage("✅ Work role assigned successfully!");
//         // Reset form
//         setFormData({
//           selectedEmployee: "",
//           selectedCompany: "",
//           selectedRoles: [],
//           selectedSubRoles: [],
//           selectedPoints: [],
//         });
//         setCompanies([]);
//         await getAllEmployees();
//         await getAllRoles();
//       } else {
//         setMessage(`❌ ${result.message || "Failed to assign work role"}`);
//       }
//     } catch (error) {
//       console.error("❌ Error assigning work role:", error);
//       setMessage("❌ Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ==============================
//         RENDER COMPONENT
//   ============================== */
//   return (
//     <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-semibold text-center mb-6">Assign Work Role to Employee</h2>

//       {message && (
//         <div className={`text-center mb-4 font-medium ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
//           {message}
//         </div>
//       )}

//       <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 gap-4">
//         {/* Employee Dropdown */}
//         <div>
//           <label className="mb-1 font-medium text-gray-700">Select Employee</label>
//           <select
//             value={formData.selectedEmployee}
//             onChange={(e) => setFormData({ ...formData, selectedEmployee: e.target.value })}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
//           >
//             <option value="">-- Choose Employee --</option>
//             {employees.map((emp) => (
//               <option key={emp._id} value={emp._id}>
//                 {emp.fullName} ({emp.department})
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Company Dropdown */}
//         <div>
//           <label className="mb-1 font-medium text-gray-700">Select Company</label>
//           <select
//             value={formData.selectedCompany}
//             onChange={(e) => setFormData({ ...formData, selectedCompany: e.target.value })}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
//             disabled={!formData.selectedEmployee}
//           >
//             <option value="">{formData.selectedEmployee ? "-- Choose Assigned Company --" : "-- Select Employee First --"}</option>
//             {companies.map((company) => (
//               <option key={company._id} value={company._id}>
//                 {company.companyName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Roles, SubRoles & Points */}
//         <div className="flex flex-col border p-4 rounded-md bg-gray-50">
//           <label className="font-medium text-gray-700 mb-2">Roles, SubRoles & Points</label>

//           {roles.length === 0 && <p className="text-gray-500 text-sm">No roles found.</p>}

//           {roles.map((role) => (
//             <div key={role._id} className="mb-3 border-b pb-2">
//               {/* Role */}
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={formData.selectedRoles.includes(role._id)}
//                   onChange={() => handleRoleToggle(role._id)}
//                 />
//                 <span className="font-semibold">{role.role}</span>
//               </label>

//               {/* Subroles */}
//               {Array.isArray(role.subRole) &&
//                 role.subRole.map((sub) => (
//                   <div key={sub._id} className="ml-6 mt-1">
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={formData.selectedSubRoles.includes(sub._id)}
//                         onChange={() => handleSubRoleToggle(sub._id)}
//                         disabled={!formData.selectedRoles.includes(role._id)}
//                       />
//                       {sub.subRoleName}
//                     </label>

//                     {/* Points */}
//                     {Array.isArray(sub.points) &&
//                       sub.points.map((point, idx) => (
//                         <label key={idx} className="flex items-center gap-2 ml-6">
//                           <input
//                             type="checkbox"
//                             checked={formData.selectedPoints.includes(point)}
//                             onChange={() => handlePointToggle(point)}
//                             disabled={!formData.selectedRoles.includes(role._id)}
//                           />
//                           {point}
//                         </label>
//                       ))}
//                   </div>
//                 ))}
//             </div>
//           ))}
//         </div>

//         {/* Submit Button */}
//         <button
//           type="button"
//           onClick={handleAssign}
//           disabled={loading}
//           className={`w-full py-3 rounded-md text-white font-semibold transition-colors ${loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"}`}
//         >
//           {loading ? "Assigning..." : "Assign Work Role"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AssignEmployeeRole;


// import React, { useEffect, useState } from "react";

// const AssignEmployeeRole = () => {
//   const [employees, setEmployees] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const [formData, setFormData] = useState({
//     selectedEmployee: "",
//     selectedCompany: "",
//     selectedRoles: [],      // Will store role _id now
//     selectedSubRoles: [],   // Already storing _id
//     selectedPoints: [],
//   });

//   /* ==============================
//         FETCHING FUNCTIONS
//   ============================== */

//   const getAllEmployees = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/employee/allEmployee");
//       const data = await res.json();
//       if (res.ok) setEmployees(data.employees || []);
//     } catch (err) {
//       console.error("❌ Error fetching employees:", err);
//     }
//   };

//   const getAllRoles = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/role/getrole");
//       const data = await res.json();
//       if (res.ok) setRoles(data.data || []);
//     } catch (err) {
//       console.error("❌ Error fetching roles:", err);
//     }
//   };

//   const getAllCompanies = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/company/all");
//       const data = await res.json();
//       if (res.ok) setCompanies(data.companies || []);
//     } catch (err) {
//       console.error("❌ Error fetching companies:", err);
//     }
//   };

//   const getCompaniesByEmployee = async (employeeId) => {
//     try {
//       const res = await fetch(
//         `http://localhost:4000/employee/getCompanyByEmployeeId/${employeeId}`
//       );
//       const data = await res.json();

//       if (res.ok && data.success) {
//         setCompanies(data.assignedCompanies || []);
//       } else {
//         await getAllCompanies();
//       }
//     } catch (err) {
//       console.error("❌ Error fetching employee companies:", err);
//       await getAllCompanies();
//     }
//   };

//   /* ==============================
//         USE EFFECT HOOKS
//   ============================== */
//   useEffect(() => {
//     getAllEmployees();
//     getAllRoles();
//   }, []);

//   useEffect(() => {
//     if (formData.selectedEmployee) {
//       getCompaniesByEmployee(formData.selectedEmployee);
//     } else {
//       setCompanies([]);
//     }
//     setFormData((prev) => ({ ...prev, selectedCompany: "" }));
//   }, [formData.selectedEmployee]);

//   /* ==============================
//         TOGGLE HELPERS
//   ============================== */

//   const toggleSelection = (array, item) =>
//     array.includes(item)
//       ? array.filter((i) => i !== item)
//       : [...array, item];

//   const handleRoleToggle = (roleId) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedRoles: toggleSelection(prev.selectedRoles, roleId),
//     }));
//   };

//   const handleSubRoleToggle = (subRoleId) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedSubRoles: toggleSelection(prev.selectedSubRoles, subRoleId),
//     }));
//   };

//   const handlePointToggle = (point) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedPoints: toggleSelection(prev.selectedPoints, point),
//     }));
//   };

//   /* ==============================
//         ASSIGN ROLE HANDLER
//   ============================== */

//   const handleAssign = async () => {
//     const { selectedEmployee, selectedCompany, selectedRoles, selectedSubRoles, selectedPoints } = formData;

//     if (!selectedEmployee) return alert("Please select an employee.");
//     if (!selectedCompany) return alert("Please select a company.");
//     if (!selectedRoles.length) return alert("Please select at least one role.");

//     setLoading(true);
//     setMessage("");

//     try {
//       const payload = {
//         employeeId: selectedEmployee,
//         companyIds: [selectedCompany],
//         workRoles: selectedRoles,       // Already ObjectIds
//         subRoles: selectedSubRoles,
//         points: selectedPoints,
//       };

//       console.log("📤 Payload:", payload);

//       const res = await fetch("http://localhost:4000/employee/assignRole", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const result = await res.json();
//       console.log("📥 Response:", result);

//       if (res.ok) {
//         setMessage("✅ Work role assigned successfully!");
//         // Reset form
//         setFormData({
//           selectedEmployee: "",
//           selectedCompany: "",
//           selectedRoles: [],
//           selectedSubRoles: [],
//           selectedPoints: [],
//         });
//         setCompanies([]);
//         await getAllEmployees();
//         await getAllRoles();
//       } else {
//         setMessage(`❌ ${result.message || "Failed to assign work role"}`);
//       }
//     } catch (error) {
//       console.error("❌ Error assigning work role:", error);
//       setMessage("❌ Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ==============================
//         RENDER
//   ============================== */

//   return (
//     <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-semibold text-center mb-6">
//         Assign Work Role to Employee
//       </h2>

//       {message && (
//         <div
//           className={`text-center mb-4 font-medium ${
//             message.startsWith("✅") ? "text-green-600" : "text-red-600"
//           }`}
//         >
//           {message}
//         </div>
//       )}

//       <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 gap-4">
//         {/* Employee */}
//         <div>
//           <label className="mb-1 font-medium text-gray-700">Select Employee</label>
//           <select
//             value={formData.selectedEmployee}
//             onChange={(e) => setFormData({ ...formData, selectedEmployee: e.target.value })}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
//           >
//             <option value="">-- Choose Employee --</option>
//             {employees.map(emp => (
//               <option key={emp._id} value={emp._id}>
//                 {emp.fullName} ({emp.department})
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Company */}
//         <div>
//           <label className="mb-1 font-medium text-gray-700">Select Company</label>
//           <select
//             value={formData.selectedCompany}
//             onChange={(e) => setFormData({ ...formData, selectedCompany: e.target.value })}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
//             disabled={!formData.selectedEmployee}
//           >
//             <option value="">
//               {formData.selectedEmployee ? "-- Choose Assigned Company --" : "-- Select Employee First --"}
//             </option>
//             {companies.map(company => (
//               <option key={company._id} value={company._id}>
//                 {company.companyName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Roles & SubRoles & Points */}
//         <div className="flex flex-col border p-4 rounded-md bg-gray-50">
//           <label className="font-medium text-gray-700 mb-2">Roles, SubRoles & Points</label>

//           {roles.length === 0 && <p className="text-gray-500 text-sm">No roles found.</p>}

//           {roles.map(role => (
//             <div key={role._id} className="mb-3 border-b pb-2">
//               {/* Role */}
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={formData.selectedRoles.includes(role._id)}
//                   onChange={() => handleRoleToggle(role._id)}
//                 />
//                 <span className="font-semibold">{role.role}</span>
//               </label>

//               {/* SubRoles */}
//               {role.subRole?.map(sub => (
//                 <div key={sub._id} className="ml-6 mt-1">
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={formData.selectedSubRoles.includes(sub._id)}
//                       onChange={() => handleSubRoleToggle(sub._id)}
//                     />
//                     {sub.subRoleName}
//                   </label>

//                   {/* Points */}
//                   {sub.points?.map((point, idx) => (
//                     <label key={idx} className="flex items-center gap-2 ml-6">
//                       <input
//                         type="checkbox"
//                         checked={formData.selectedPoints.includes(point)}
//                         onChange={() => handlePointToggle(point)}
//                       />
//                       {point}
//                     </label>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>

//         {/* Submit */}
//         <button
//           type="button"
//           onClick={handleAssign}
//           disabled={loading}
//           className={`w-full py-3 rounded-md text-white font-semibold transition-colors ${
//             loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
//           }`}
//         >
//           {loading ? "Assigning..." : "Assign Work Role"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AssignEmployeeRole;





// import React, { useEffect, useState } from "react";

// const AssignEmployeeRole = () => {
//   const [employees, setEmployees] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const [formData, setFormData] = useState({
//     selectedEmployee: "",
//     selectedCompany: "",
//     selectedRoles: [],
//     selectedSubRoles: [],
//     selectedPoints: [],
//   });

//   // ==============================
//   // FETCHING FUNCTIONS
//   // ==============================
//   const getAllEmployees = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/employee/allEmployee");
//       const data = await res.json();
//       if (res.ok) setEmployees(data.employees || []);
//     } catch (err) {
//       console.error("❌ Error fetching employees:", err);
//     }
//   };

//   const getAllRoles = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/role/getrole");
//       const data = await res.json();
//       if (res.ok) setRoles(data.data || []);
//     } catch (err) {
//       console.error("❌ Error fetching roles:", err);
//     }
//   };

//   const getAllCompanies = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/company/all");
//       const data = await res.json();
//       if (res.ok) setCompanies(data.companies || []);
//     } catch (err) {
//       console.error("❌ Error fetching companies:", err);
//     }
//   };

//   const getCompaniesByEmployee = async (employeeId) => {
//     try {
//       const res = await fetch(
//         `http://localhost:4000/employee/getCompanyByEmployeeId/${employeeId}`
//       );
//       const data = await res.json();

//       if (res.ok && data.success) {
//         setCompanies(data.assignedCompanies || []);
//       } else {
//         await getAllCompanies();
//       }
//     } catch (err) {
//       console.error("❌ Error fetching employee companies:", err);
//       await getAllCompanies();
//     }
//   };

//   // ==============================
//   // USE EFFECT HOOKS
//   // ==============================
//   useEffect(() => {
//     getAllEmployees();
//     getAllRoles();
//   }, []);

//   useEffect(() => {
//     if (formData.selectedEmployee) {
//       getCompaniesByEmployee(formData.selectedEmployee);
//     } else {
//       setCompanies([]);
//     }
//     setFormData((prev) => ({ ...prev, selectedCompany: "" }));
//   }, [formData.selectedEmployee]);

//   // ==============================
//   // TOGGLE HELPERS
//   // ==============================
//   const toggleSelection = (array, item) =>
//     array.includes(item) ? array.filter((i) => i !== item) : [...array, item];

//   const handleRoleToggle = (roleId) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedRoles: toggleSelection(prev.selectedRoles, roleId),
//     }));
//   };

//   const handleSubRoleToggle = (subRoleId) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedSubRoles: toggleSelection(prev.selectedSubRoles, subRoleId),
//     }));
//   };

//   const handlePointToggle = (point) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedPoints: toggleSelection(prev.selectedPoints, point),
//     }));
//   };

//   // ==============================
//   // ASSIGN ROLE HANDLER
//   // ==============================
//   const handleAssign = async () => {
//     const { selectedEmployee, selectedCompany, selectedRoles, selectedSubRoles, selectedPoints } = formData;

//     if (!selectedEmployee) return alert("Please select an employee.");
//     if (!selectedCompany) return alert("Please select a company.");
//     if (!selectedRoles.length) return alert("Please select at least one role.");

//     setLoading(true);
//     setMessage("");

//     try {
//       const payload = {
//         employeeId: selectedEmployee,
//         companyIds: [selectedCompany],
//         workRoles: selectedRoles,
//         subRoles: selectedSubRoles,
//         points: selectedPoints,
//       };

//       console.log("📤 Payload:", payload);

//       const res = await fetch("http://localhost:4000/employee/assignRole", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const result = await res.json();
//       console.log("📥 Response:", result);

//       if (res.ok) {
//         setMessage("✅ Work role assigned successfully!");
//         // Reset form
//         setFormData({
//           selectedEmployee: "",
//           selectedCompany: "",
//           selectedRoles: [],
//           selectedSubRoles: [],
//           selectedPoints: [],
//         });
//         setCompanies([]);
//         await getAllEmployees();
//         await getAllRoles();
//       } else {
//         setMessage(`❌ ${result.message || "Failed to assign work role"}`);
//       }
//     } catch (error) {
//       console.error("❌ Error assigning work role:", error);
//       setMessage("❌ Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==============================
//   // RENDER
//   // ==============================
//   return (
//     <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-semibold text-center mb-6">
//         Assign Work Role to Employee
//       </h2>

//       {message && (
//         <div
//           className={`text-center mb-4 font-medium ${
//             message.startsWith("✅") ? "text-green-600" : "text-red-600"
//           }`}
//         >
//           {message}
//         </div>
//       )}

//       <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 gap-4">
//         {/* Employee */}
//         <div>
//           <label className="mb-1 font-medium text-gray-700">Select Employee</label>
//           <select
//             value={formData.selectedEmployee}
//             onChange={(e) => setFormData({ ...formData, selectedEmployee: e.target.value })}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
//           >
//             <option value="">-- Choose Employee --</option>
//             {employees.map(emp => (
//               <option key={emp._id} value={emp._id}>
//                 {emp.fullName || emp._id} ({emp.dep?.name || "No Dept"})
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Company */}
//         <div>
//           <label className="mb-1 font-medium text-gray-700">Select Company</label>
//           <select
//             value={formData.selectedCompany}
//             onChange={(e) => setFormData({ ...formData, selectedCompany: e.target.value })}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
//             disabled={!formData.selectedEmployee}
//           >
//             <option value="">
//               {formData.selectedEmployee ? "-- Choose Assigned Company --" : "-- Select Employee First --"}
//             </option>
//             {companies.map(company => (
//               <option key={company._id} value={company._id}>
//                 {company.companyName || company._id}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Roles & SubRoles & Points */}
//         <div className="flex flex-col border p-4 rounded-md bg-gray-50">
//           <label className="font-medium text-gray-700 mb-2">Roles, SubRoles & Points</label>

//           {roles.length === 0 && <p className="text-gray-500 text-sm">No roles found.</p>}

//           {roles.map(role => (
//             <div key={role._id} className="mb-3 border-b pb-2">
//               {/* Role */}
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={formData.selectedRoles.includes(role._id)}
//                   onChange={() => handleRoleToggle(role._id)}
//                 />
//                 <span className="font-semibold">{role.role || "Unnamed Role"}</span>
//               </label>

//               {/* SubRoles */}
//               {role.subRole?.map(sub => (
//                 <div key={sub._id} className="ml-6 mt-1">
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={formData.selectedSubRoles.includes(sub._id)}
//                       onChange={() => handleSubRoleToggle(sub._id)}
//                     />
//                     {sub.subRoleName || "Unnamed SubRole"}
//                   </label>

//                   {/* Points */}
//                   {sub.points?.map((point, idx) => (
//                     <label key={idx} className="flex items-center gap-2 ml-6">
//                       <input
//                         type="checkbox"
//                         checked={formData.selectedPoints.includes(point)}
//                         onChange={() => handlePointToggle(point)}
//                       />
//                       {point}
//                     </label>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>

//         {/* Submit */}
//         <button
//           type="button"
//           onClick={handleAssign}
//           disabled={loading}
//           className={`w-full py-3 rounded-md text-white font-semibold transition-colors ${
//             loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
//           }`}
//         >
//           {loading ? "Assigning..." : "Assign Work Role"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AssignEmployeeRole;




import React, { useEffect, useState } from "react";

const AssignEmployeeRole = () => {
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    selectedEmployee: "",
    selectedCompany: "",
    selectedRoles: [],
    selectedSubRoles: [],
    selectedPoints: [],
  });

  // ============================================
  // FETCH EMPLOYEES
  // ============================================
  const getAllEmployees = async () => {
    try {
      const res = await fetch("http://localhost:4000/employee/allEmployee");
      const data = await res.json();
      if (res.ok) setEmployees(data.employees || []);
    } catch (err) {
      console.error("❌ Error fetching employees:", err);
    }
  };

  // FETCH ROLES
  const getAllRoles = async () => {
    try {
      const res = await fetch("http://localhost:4000/role/getrole");
      const data = await res.json();
      if (res.ok) setRoles(data.data || []);
    } catch (err) {
      console.error("❌ Error fetching roles:", err);
    }
  };

  // FETCH ALL COMPANIES
  const getAllCompanies = async () => {
    try {
      const res = await fetch("http://localhost:4000/company/all");
      const data = await res.json();
      if (res.ok) setCompanies(data.companies || []);
    } catch (err) {
      console.error("❌ Error fetching companies:", err);
    }
  };

  // ============================================
  // FETCH COMPANY BY EMPLOYEE
  // ============================================
  const getCompaniesByEmployee = async (employeeId) => {
    try {
      const res = await fetch(
        `http://localhost:4000/employee/getCompanyByEmployeeId/${employeeId}`
      );
      const data = await res.json();

      console.log("🏢 Employee Companies Data:", data);

      if (data.success) {
        const companiesData = data.assignedCompanies;

        // FIX: Convert object → array
        setCompanies(
          Array.isArray(companiesData) ? companiesData : [companiesData]
        );
      } else {
        setCompanies([]);
      }
    } catch (err) {
      console.error("❌ Error fetching employee companies:", err);
      setCompanies([]);
    }
  };

  // ============================================
  // USE EFFECTS
  // ============================================
  useEffect(() => {
    getAllEmployees();
    getAllRoles();
  }, []);

  useEffect(() => {
    if (formData.selectedEmployee) {
      getCompaniesByEmployee(formData.selectedEmployee);
    } else {
      setCompanies([]);
    }

    setFormData((prev) => ({ ...prev, selectedCompany: "" }));
  }, [formData.selectedEmployee]);

  // ============================================
  // TOGGLE HELPERS
  // ============================================
  const toggleSelection = (array, item) =>
    array.includes(item) ? array.filter((i) => i !== item) : [...array, item];

  const handleRoleToggle = (roleId) => {
    setFormData((prev) => ({
      ...prev,
      selectedRoles: toggleSelection(prev.selectedRoles, roleId),
    }));
  };

  const handleSubRoleToggle = (subRoleId) => {
    setFormData((prev) => ({
      ...prev,
      selectedSubRoles: toggleSelection(prev.selectedSubRoles, subRoleId),
    }));
  };

  const handlePointToggle = (point) => {
    setFormData((prev) => ({
      ...prev,
      selectedPoints: toggleSelection(prev.selectedPoints, point),
    }));
  };

  // ============================================
  // ASSIGN ROLE
  // ============================================
  const handleAssign = async () => {
    const {
      selectedEmployee,
      selectedCompany,
      selectedRoles,
      selectedSubRoles,
      selectedPoints,
    } = formData;

    if (!selectedEmployee) return alert("Please select an employee.");
    if (!selectedCompany) return alert("Please select a company.");
    if (!selectedRoles.length) return alert("Please select at least one role.");

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        employeeId: selectedEmployee,
        companyIds: [selectedCompany],
        workRoles: selectedRoles,
        subRoles: selectedSubRoles,
        points: selectedPoints,
      };

      console.log("📤 Sending Payload:", payload);

      const res = await fetch("http://localhost:4000/employee/assignRole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("📥 Response:", result);

      if (res.ok) {
        setMessage("✅ Work Role assigned successfully!");

        setFormData({
          selectedEmployee: "",
          selectedCompany: "",
          selectedRoles: [],
          selectedSubRoles: [],
          selectedPoints: [],
        });

        setCompanies([]);
        getAllEmployees();
        getAllRoles();
      } else {
        setMessage(`❌ ${result.message || "Failed to assign role"}`);
      }
    } catch (error) {
      console.error("❌ Error assigning role:", error);
      setMessage("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RENDER UI
  // ============================================
  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Assign Work Role to Employee
      </h2>

      {message && (
        <div
          className={`text-center mb-4 font-medium ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}

      <form className="grid grid-cols-1 gap-4" onSubmit={(e) => e.preventDefault()}>
        {/* EMPLOYEE DROPDOWN */}
        <div>
          <label className="mb-1 font-medium text-gray-700">Select Employee</label>
          <select
            value={formData.selectedEmployee}
            onChange={(e) =>
              setFormData({ ...formData, selectedEmployee: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">-- Choose Employee --</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* COMPANY DROPDOWN */}
        <div>
          <label className="mb-1 font-medium text-gray-700">Select Company</label>
          <select
            value={formData.selectedCompany}
            onChange={(e) =>
              setFormData({ ...formData, selectedCompany: e.target.value })
            }
            className="w-full px-3 py-2 border rounded"
            disabled={!formData.selectedEmployee}
          >
            <option value="">
              {formData.selectedEmployee
                ? "-- Choose Assigned Company --"
                : "-- Select Employee First --"}
            </option>

            {/* SAFE ARRAY LOOP */}
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.companyName}
              </option>
            ))}
          </select>
        </div>

        {/* ROLES, SUBROLES, POINTS */}
        <div className="border p-4 rounded bg-gray-50">
          <label className="font-medium text-gray-700 mb-2 block">
            Roles, SubRoles & Points
          </label>

          {roles.map((role) => (
            <div key={role._id} className="mb-3 border-b pb-2">
              {/* Role */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.selectedRoles.includes(role._id)}
                  onChange={() => handleRoleToggle(role._id)}
                />
                <strong>{role.role}</strong>
              </label>

              {/* SubRoles */}
              {role.subRole?.map((sub) => (
                <div key={sub._id} className="ml-5 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.selectedSubRoles.includes(sub._id)}
                      onChange={() => handleSubRoleToggle(sub._id)}
                    />
                    {sub.subRoleName}
                  </label>

                  {/* Points */}
                  {sub.points?.map((point, idx) => (
                    <label key={idx} className="flex items-center gap-2 ml-6">
                      <input
                        type="checkbox"
                        checked={formData.selectedPoints.includes(point)}
                        onChange={() => handlePointToggle(point)}
                      />
                      {point}
                    </label>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="button"
          onClick={handleAssign}
          disabled={loading}
          className={`w-full py-3 text-white rounded ${
            loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Assigning..." : "Assign Work Role"}
        </button>
      </form>
    </div>
  );
};

export default AssignEmployeeRole;

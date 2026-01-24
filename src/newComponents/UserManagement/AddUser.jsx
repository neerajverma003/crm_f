


// import React, { useState, useEffect, useCallback } from "react";
// import Modal from "./Modal.jsx";
// import axios from "axios";
// const ROLES = ["Admin", "Employee"];
// const AddUser = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [companies, setCompanies] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [designations, setDesignations] = useState([]);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     officialNo: "",
//     emergencyNo: "",
//     company: "",
//     department: "",
//     designation: "",
//     role: "",
//     password: "",
//     salary: "",
//     isActive: true,
//     showPassword: false,
//   });
//   const handleInputChange = useCallback((field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   }, []);
//   const getCompanies = async () => {
//     try {
//       const response = await axios.get("http://localhost:4000/company/all");
//       setCompanies(response.data.companies || []);
//     } catch (error) {
//       console.error("Failed to fetch companies:", error);
//       alert("Failed to fetch companies.");
//     }
//   };
//   const getDepartments = async (companyId) => {
//     if (!companyId) return;

//     try {
//       const url = `http://localhost:4000/department/department?company=${companyId}`;

//       const response = await fetch(url);
//       if (!response.ok) throw new Error("Failed to fetch departments");
//       const data = await response.json();
//       const finalDepartments = (data.departments || []).map((d) => ({
//         id: d._id,
//         name: d.dep,
//       }));
//       setDepartments(finalDepartments);
//     } catch (err) {
//       console.error(err);
//       setDepartments([]);
//     }
//   };
//   const getDesignations = async (companyId, departmentId) => {
//     if (!companyId || !departmentId) return;

//     try {
//       const url = `http://localhost:4000/designation?company=${companyId}&department=${departmentId}`;

//       const response = await fetch(url);
//       if (!response.ok) throw new Error("Failed to fetch designations");

//       const data = await response.json();
//       const finalDesignations = (data.designations || []).map((d) => ({
//         id: d._id,
//         name: d.designation,
//       }));
//       setDesignations(finalDesignations);
//     } catch (err) {
//       console.error(err);
//       setDesignations([]);
//     }
//   };
//   useEffect(() => {
//     getCompanies();
//   }, []);
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.role) {
//       alert("Please select a role");
//       return;
//     }
//     setIsSubmitting(true);
//     const endpoint =
//       formData.role === "Admin"
//         ? "http://localhost:4000/addAdmin"
//         : "http://localhost:4000/employee/addEmployee";

//     try {
//       await axios.post(endpoint, {
//         fullName: formData.fullName,
//         email: formData.email,
//         phone: formData.phone,
//         officialNo: formData.officialNo,
//         emergencyNo: formData.emergencyNo,
//         department: formData.department, // departmentId
//         designation: formData.designation, // designationId
//         company: formData.company, // companyId
//         password: formData.password,
//         salary: formData.salary,
//         accountActive: formData.isActive,
//         role: formData.role,
//       });
//       alert(`${formData.role} added successfully!`);
//       handleClose();
//     } catch (error) {
//       console.error("Error adding user:", error);
//       alert("Failed to add user.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   const handleClose = useCallback(() => {
//     setIsOpen(false);
//     setFormData({
//       fullName: "",
//       email: "",
//       phone: "",
//       officialNo: "",
//       emergencyNo: "",
//       company: "",
//       department: "",
//       designation: "",
//       role: "",
//       password: "",
//       salary: "",
//       isActive: true,
//       showPassword: false,
//     });

//     setDepartments([]);
//     setDesignations([]);
//   }, []);
//   return (
//     <>
//       <button
//         onClick={() => setIsOpen(true)}
//         className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
//       >
//         Add User
//       </button>

//       <Modal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-2xl">
//         <div className="p-6">
//           <h2 className="mb-6 text-xl font-semibold text-gray-900">
//             Add New User
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.fullName}
//                   onChange={(e) =>
//                     handleInputChange("fullName", e.target.value)
//                   }
//                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) =>
//                     handleInputChange("email", e.target.value)
//                   }
//                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Phone
//                 </label>
//                 <input
//                   type="tel"
//                   value={formData.phone}
//                   onChange={(e) => handleInputChange("phone", e.target.value)}
//                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                 />
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Official Number
//                 </label>
//                 <input
//                   type="tel"
//                   value={formData.officialNo}
//                   onChange={(e) =>
//                     handleInputChange("officialNo", e.target.value)
//                   }
//                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                 />
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Emergency Number
//                 </label>
//                 <input
//                   type="tel"
//                   value={formData.emergencyNo}
//                   onChange={(e) =>
//                     handleInputChange("emergencyNo", e.target.value)
//                   }
//                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                 />
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Salary
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.salary}
//                   onChange={(e) =>
//                     handleInputChange("salary", e.target.value)
//                   }
//                   placeholder="Enter salary"
//                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                 />
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Company
//                 </label>
//                 <select
//                   value={formData.company}
//                   onChange={(e) => {
//                     const compId = e.target.value;
//                     handleInputChange("company", compId);

//                     // reset dependent fields
//                     handleInputChange("department", "");
//                     handleInputChange("designation", "");
//                     setDepartments([]);
//                     setDesignations([]);

//                     if (compId) getDepartments(compId);
//                   }}
//                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                   required
//                 >
//                   <option value="">Select company</option>
//                   {companies.map((comp) => (
//                     <option key={comp._id} value={comp._id}>
//                       {comp.companyName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Department
//                 </label>

//                 <select
//                   value={formData.department}
//                   onChange={(e) => {
//                     const depId = e.target.value;
//                     handleInputChange("department", depId);
//                     handleInputChange("designation", "");
//                     setDesignations([]);

//                     if (depId) getDesignations(formData.company, depId);
//                   }}
//                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                   required
//                 >
//                   <option value="">Select department</option>

//                   {departments.map((dept) => (
//                     <option key={dept.id} value={dept.id}>
//                       {dept.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Designation
//                 </label>

//                 <select
//                   value={formData.designation}
//                   onChange={(e) =>
//                     handleInputChange("designation", e.target.value)
//                   }
//                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                   required
//                 >
//                   <option value="">Select designation</option>

//                   {designations.map((desig) => (
//                     <option key={desig.id} value={desig.id}>
//                       {desig.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Role
//                 </label>
//                 <select
//                   value={formData.role}
//                   onChange={(e) => handleInputChange("role", e.target.value)}
//                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                   required
//                 >
//                   <option value="">Select Role</option>
//                   {ROLES.map((role) => (
//                     <option key={role} value={role}>
//                       {role}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="relative">
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <input
//                   type={formData.showPassword ? "text" : "password"}
//                   value={formData.password}
//                   onChange={(e) =>
//                     handleInputChange("password", e.target.value)
//                   }
//                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                   required
//                 />

//                 <button
//                   type="button"
//                   onClick={() =>
//                     handleInputChange("showPassword", !formData.showPassword)
//                   }
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//                 >
//                   {formData.showPassword ? "Hide" : "Show"}
//                 </button>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={formData.isActive}
//                 onChange={(e) =>
//                   handleInputChange("isActive", e.target.checked)
//                 }
//                 className="rounded border-gray-300 text-blue-600"
//               />
//               <label className="text-sm font-medium text-gray-700">
//                 Account Active
//               </label>
//             </div>
//             <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
//               <button
//                 type="button"
//                 onClick={handleClose}
//                 className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Adding..." : "Add User"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </Modal>
//     </>
//   );
// };
// export default AddUser;


// import React, { useState, useEffect, useCallback } from "react";
// import Modal from "./Modal.jsx";
// import axios from "axios";
// const ROLES = ["Admin", "Employee"];
// const AddUser = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [companies, setCompanies] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [designations, setDesignations] = useState([]);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     officialNo: "",
//     emergencyNo: "",
//     company: "",
//     department: "",
//     designation: "",
//     role: "",
//     password: "",
//     isActive: true,
//     showPassword: false,
//   });
//   const handleInputChange = useCallback((field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   }, []);
//   const getCompanies = async () => {
//     try {
//       const response = await axios.get("http://localhost:4000/company/all");
//       setCompanies(response.data.companies || []);
//     } catch (error) {
//       console.error("Failed to fetch companies:", error);
//       alert("Failed to fetch companies.");
//     }
//   };
//   const getDepartments = async (companyId) => {
//     if (!companyId) return;

//     try {
//       const url = `http://localhost:4000/department/department?company=${companyId}`;

//       const response = await fetch(url);
//       if (!response.ok) throw new Error("Failed to fetch departments");
//       const data = await response.json();
//       const finalDepartments = (data.departments || []).map((d) => ({
//         id: d._id,
//         name: d.dep,
//       }));
//       setDepartments(finalDepartments);
//     } catch (err) {
//       console.error(err);
//       setDepartments([]);
//     }
//   };
//   const getDesignations = async (companyId, departmentId) => {
//     if (!companyId || !departmentId) return;

//     try {
//       const url = `http://localhost:4000/designation?company=${companyId}&department=${departmentId}`;

//       const response = await fetch(url);
//       if (!response.ok) throw new Error("Failed to fetch designations");

//       const data = await response.json();
//       const finalDesignations = (data.designations || []).map((d) => ({
//         id: d._id,
//         name: d.designation,
//       }));
//       setDesignations(finalDesignations);
//     } catch (err) {
//       console.error(err);
//       setDesignations([]);
//     }
//   };
//   useEffect(() => {
//     getCompanies();
//   }, []);
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.role) {
//       alert("Please select a role");
//       return;
//     }
//     setIsSubmitting(true);
//     const endpoint =
//       formData.role === "Admin"
//         ? "http://localhost:4000/addAdmin"
//         : "http://localhost:4000/employee/addEmployee";

//     try {
//       await axios.post(endpoint, {
//         fullName: formData.fullName,
//         email: formData.email,
//         phone: formData.phone,
//         officialNo: formData.officialNo,
//         emergencyNo: formData.emergencyNo,
//         department: formData.department, // departmentId
//         designation: formData.designation, // designationId
//         company: formData.company, // companyId
//         password: formData.password,
//         accountActive: formData.isActive,
//         role: formData.role,
//       });
//       alert(`${formData.role} added successfully!`);
//       handleClose();
//     } catch (error) {
//       console.error("Error adding user:", error);
//       alert("Failed to add user.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   const handleClose = useCallback(() => {
//     setIsOpen(false);
//     setFormData({
//       fullName: "",
//       email: "",
//       phone: "",
//       officialNo: "",
//       emergencyNo: "",
//       company: "",
//       department: "",
//       designation: "",
//       role: "",
//       password: "",
//       isActive: true,
//       showPassword: false,
//     });

//     setDepartments([]);
//     setDesignations([]);
//   }, []);
//   return (
//     <>
//       <button
//         onClick={() => setIsOpen(true)}
//         className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
//       >
//         Add User
//       </button>

//       <Modal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-2xl">
//         <div className="p-6">
//           <h2 className="mb-6 text-xl font-semibold text-gray-900">
//             Add New User
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.fullName}
//                   onChange={(e) =>
//                     handleInputChange("fullName", e.target.value)
//                   }
//                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) =>
//                     handleInputChange("email", e.target.value)
//                   }
//                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Phone
//                 </label>
//                 <input
//                   type="tel"
//                   value={formData.phone}
//                   onChange={(e) => handleInputChange("phone", e.target.value)}
//                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                 />
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Official Number
//                 </label>
//                 <input
//                   type="tel"
//                   value={formData.officialNo}
//                   onChange={(e) =>
//                     handleInputChange("officialNo", e.target.value)
//                   }
//                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                 />
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Emergency Number
//                 </label>
//                 <input
//                   type="tel"
//                   value={formData.emergencyNo}
//                   onChange={(e) =>
//                     handleInputChange("emergencyNo", e.target.value)
//                   }
//                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                 />
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Company
//                 </label>
//                 <select
//                   value={formData.company}
//                   onChange={(e) => {
//                     const compId = e.target.value;
//                     handleInputChange("company", compId);

//                     // reset dependent fields
//                     handleInputChange("department", "");
//                     handleInputChange("designation", "");
//                     setDepartments([]);
//                     setDesignations([]);

//                     if (compId) getDepartments(compId);
//                   }}
//                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                   required
//                 >
//                   <option value="">Select company</option>
//                   {companies.map((comp) => (
//                     <option key={comp._id} value={comp._id}>
//                       {comp.companyName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Department
//                 </label>

//                 <select
//                   value={formData.department}
//                   onChange={(e) => {
//                     const depId = e.target.value;
//                     handleInputChange("department", depId);
//                     handleInputChange("designation", "");
//                     setDesignations([]);

//                     if (depId) getDesignations(formData.company, depId);
//                   }}
//                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                   required
//                 >
//                   <option value="">Select department</option>

//                   {departments.map((dept) => (
//                     <option key={dept.id} value={dept.id}>
//                       {dept.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Designation
//                 </label>

//                 <select
//                   value={formData.designation}
//                   onChange={(e) =>
//                     handleInputChange("designation", e.target.value)
//                   }
//                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                   required
//                 >
//                   <option value="">Select designation</option>

//                   {designations.map((desig) => (
//                     <option key={desig.id} value={desig.id}>
//                       {desig.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Role
//                 </label>
//                 <select
//                   value={formData.role}
//                   onChange={(e) => handleInputChange("role", e.target.value)}
//                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                   required
//                 >
//                   <option value="">Select Role</option>
//                   {ROLES.map((role) => (
//                     <option key={role} value={role}>
//                       {role}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="relative">
//                 <label className="mb-1 block text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <input
//                   type={formData.showPassword ? "text" : "password"}
//                   value={formData.password}
//                   onChange={(e) =>
//                     handleInputChange("password", e.target.value)
//                   }
//                   className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
//                   required
//                 />

//                 <button
//                   type="button"
//                   onClick={() =>
//                     handleInputChange("showPassword", !formData.showPassword)
//                   }
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//                 >
//                   {formData.showPassword ? "Hide" : "Show"}
//                 </button>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={formData.isActive}
//                 onChange={(e) =>
//                   handleInputChange("isActive", e.target.checked)
//                 }
//                 className="rounded border-gray-300 text-blue-600"
//               />
//               <label className="text-sm font-medium text-gray-700">
//                 Account Active
//               </label>
//             </div>
//             <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
//               <button
//                 type="button"
//                 onClick={handleClose}
//                 className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Adding..." : "Add User"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </Modal>
//     </>
//   );
// };
// export default AddUser;





import React, { useState, useEffect, useCallback } from "react";
import Modal from "./Modal.jsx";
import axios from "axios";
const ROLES = ["Admin", "Employee"];
const AddUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    officialNo: "",
    emergencyNo: "",
    company: "",
    department: "",
    designation: "",
    role: "",
    password: "",
    salary: "",
    isActive: true,
    showPassword: false,
  });
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);
  const getCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:4000/company/all");
      setCompanies(response.data.companies || []);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      alert("Failed to fetch companies.");
    }
  };
  const getDepartments = async (companyId) => {
    if (!companyId) return;

    try {
      const url = `http://localhost:4000/department/department?company=${companyId}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch departments");
      const data = await response.json();
      const finalDepartments = (data.departments || []).map((d) => ({
        id: d._id,
        name: d.dep,
      }));
      setDepartments(finalDepartments);
    } catch (err) {
      console.error(err);
      setDepartments([]);
    }
  };
  const getDesignations = async (companyId, departmentId) => {
    if (!companyId || !departmentId) return;

    try {
      const url = `http://localhost:4000/designation?company=${companyId}&department=${departmentId}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch designations");

      const data = await response.json();
      const finalDesignations = (data.designations || []).map((d) => ({
        id: d._id,
        name: d.designation,
      }));
      setDesignations(finalDesignations);
    } catch (err) {
      console.error(err);
      setDesignations([]);
    }
  };
  useEffect(() => {
    getCompanies();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      alert("Please select a role");
      return;
    }
    setIsSubmitting(true);
    const endpoint =
      formData.role === "Admin"
        ? "http://localhost:4000/addAdmin"
        : "http://localhost:4000/employee/addEmployee";

    try {
      await axios.post(endpoint, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        officialNo: formData.officialNo,
        emergencyNo: formData.emergencyNo,
        department: formData.department, // departmentId
        designation: formData.designation, // designationId
        company: formData.company, // companyId
        password: formData.password,
        salary: formData.salary,
        accountActive: formData.isActive,
        role: formData.role,
      });
      alert(`${formData.role} added successfully!`);
      handleClose();
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      officialNo: "",
      emergencyNo: "",
      company: "",
      department: "",
      designation: "",
      role: "",
      password: "",
      salary: "",
      isActive: true,
      showPassword: false,
    });

    setDepartments([]);
    setDesignations([]);
  }, []);
  return (
      <>
          <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 rounded-full sm:px-4 py-2 h-14 w-[12rem] bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
              Add User
          </button>

          <Modal
              isOpen={isOpen}
              onClose={handleClose}
              maxWidth="max-w-2xl"
          >
              <div className="p-6">
                  <h2 className="mb-6 text-xl font-semibold text-gray-900">Add New User</h2>
                  <form
                      onSubmit={handleSubmit}
                      className="space-y-6"
                  >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                              <input
                                  type="text"
                                  value={formData.fullName}
                                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                                  required
                              />
                          </div>
                          <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                              <input
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => handleInputChange("email", e.target.value)}
                                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                                  required
                              />
                          </div>
                          <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                              <input
                                  type="tel"
                                  value={formData.phone}
                                  onChange={(e) => handleInputChange("phone", e.target.value)}
                                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                              />
                          </div>
                          <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">Official Number</label>
                              <input
                                  type="tel"
                                  value={formData.officialNo}
                                  onChange={(e) => handleInputChange("officialNo", e.target.value)}
                                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                              />
                          </div>
                          <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">Emergency Number</label>
                              <input
                                  type="tel"
                                  value={formData.emergencyNo}
                                  onChange={(e) => handleInputChange("emergencyNo", e.target.value)}
                                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                              />
                          </div>
                          <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">Salary</label>
                              <input
                                  type="number"
                                  value={formData.salary}
                                  onChange={(e) => handleInputChange("salary", e.target.value)}
                                  placeholder="Enter salary"
                                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                              />
                          </div>
                          <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">Company</label>
                              <select
                                  value={formData.company}
                                  onChange={(e) => {
                                      const compId = e.target.value;
                                      handleInputChange("company", compId);

                                      // reset dependent fields
                                      handleInputChange("department", "");
                                      handleInputChange("designation", "");
                                      setDepartments([]);
                                      setDesignations([]);

                                      if (compId) getDepartments(compId);
                                  }}
                                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                                  required
                              >
                                  <option value="">Select company</option>
                                  {companies.map((comp) => (
                                      <option
                                          key={comp._id}
                                          value={comp._id}
                                      >
                                          {comp.companyName}
                                      </option>
                                  ))}
                              </select>
                          </div>
                          <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">Department</label>

                              <select
                                  value={formData.department}
                                  onChange={(e) => {
                                      const depId = e.target.value;
                                      handleInputChange("department", depId);
                                      handleInputChange("designation", "");
                                      setDesignations([]);

                                      if (depId) getDesignations(formData.company, depId);
                                  }}
                                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                                  required
                              >
                                  <option value="">Select department</option>

                                  {departments.map((dept) => (
                                      <option
                                          key={dept.id}
                                          value={dept.id}
                                      >
                                          {dept.name}
                                      </option>
                                  ))}
                              </select>
                          </div>
                          <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">Designation</label>

                              <select
                                  value={formData.designation}
                                  onChange={(e) => handleInputChange("designation", e.target.value)}
                                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                                  required
                              >
                                  <option value="">Select designation</option>

                                  {designations.map((desig) => (
                                      <option
                                          key={desig.id}
                                          value={desig.id}
                                      >
                                          {desig.name}
                                      </option>
                                  ))}
                              </select>
                          </div>
                          <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
                              <select
                                  value={formData.role}
                                  onChange={(e) => handleInputChange("role", e.target.value)}
                                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                                  required
                              >
                                  <option value="">Select Role</option>
                                  {ROLES.map((role) => (
                                      <option
                                          key={role}
                                          value={role}
                                      >
                                          {role}
                                      </option>
                                  ))}
                              </select>
                          </div>
                          <div className="relative">
                              <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                              <input
                                  type={formData.showPassword ? "text" : "password"}
                                  value={formData.password}
                                  onChange={(e) => handleInputChange("password", e.target.value)}
                                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                                  required
                              />

                              <button
                                  type="button"
                                  onClick={() => handleInputChange("showPassword", !formData.showPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                              >
                                  {formData.showPassword ? "Hide" : "Show"}
                              </button>
                          </div>
                      </div>
                      <div className="flex items-center gap-2">
                          <input
                              type="checkbox"
                              checked={formData.isActive}
                              onChange={(e) => handleInputChange("isActive", e.target.checked)}
                              className="rounded border-gray-300 text-blue-600"
                          />
                          <label className="text-sm font-medium text-gray-700">Account Active</label>
                      </div>
                      <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
                          <button
                              type="button"
                              onClick={handleClose}
                              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                              disabled={isSubmitting}
                          >
                              Cancel
                          </button>
                          <button
                              type="submit"
                              className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
                              disabled={isSubmitting}
                          >
                              {isSubmitting ? "Adding..." : "Add User"}
                          </button>
                      </div>
                  </form>
              </div>
          </Modal>
      </>
  );
};
export default AddUser;
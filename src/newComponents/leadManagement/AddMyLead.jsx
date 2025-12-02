// // import React, { useState, useEffect } from "react";
// // import { Plus, AlertCircle, Eye, Edit2, X } from "lucide-react";

// // // 🧩 Dropdown Options
// // const leadSources = [
// //   "Cold Call", "Website", "Referral", "LinkedIn", "Trade Show",
// //   "Email Campaign", "Social Media", "Event", "Organic Search", "Paid Ads",
// // ];
// // const leadTypes = ["International", "Domestic"];
// // const tripTypes = ["Solo", "Group", "Family", "Couple", "Honeymoon"];
// // const leadStatuses = ["Hot", "Warm", "Cold", "Converted", "Lost"];
// // const tripDurations = [
// //   "1n/2d","2n/3d","3n/4d","4n/5d","5n/6d","6n/7d","7n/8d","8n/9d","9n/10d",
// //   "10n/11d","11n/12d","12n/13d","13n/14d","14n/15d","Others"
// // ];

// // // 🧩 Input Field Component
// // const InputField = ({ name, type = "text", placeholder, required, value, error, onChange }) => (
// //   <div className="h-[4.5rem]">
// //     <label className="block text-xs font-medium text-gray-700 mb-0.5">
// //       {name.charAt(0).toUpperCase() + name.slice(1)} {required && <span className="text-red-500">*</span>}
// //     </label>
// //     <input
// //       type={type}
// //       name={name}
// //       value={value || ""}
// //       onChange={onChange}
// //       placeholder={placeholder}
// //       className={`w-full px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
// //         error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
// //       }`}
// //       autoComplete="off"
// //     />
// //     {error && (
// //       <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
// //         <AlertCircle className="w-3 h-3" /> {error}
// //       </p>
// //     )}
// //   </div>
// // );

// // // 🧩 Select Field Component
// // const SelectField = ({ name, options, required, value, error, onChange }) => (
// //   <div className="h-[4.5rem]">
// //     <label className="block text-xs font-medium text-gray-700 mb-0.5">
// //       {name.charAt(0).toUpperCase() + name.slice(1)} {required && <span className="text-red-500">*</span>}
// //     </label>
// //     <select
// //       name={name}
// //       value={value || ""}
// //       onChange={onChange}
// //       className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
// //         error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
// //       }`}
// //     >
// //       <option value="">Select {name}</option>
// //       {options.map((opt) => (
// //         <option key={opt}>{opt}</option>
// //       ))}
// //     </select>
// //     {error && (
// //       <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
// //         <AlertCircle className="w-3 h-3" /> {error}
// //       </p>
// //     )}
// //   </div>
// // );

// // // 🧩 Modal Component
// // const Modal = ({ isOpen, onClose, size = "large", children }) => {
// //   if (!isOpen) return null;
// //   return (
// //     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
// //       <div 
// //         className={`bg-white rounded-lg shadow-lg ${size === 'large' ? 'w-full max-w-4xl' : 'w-full max-w-md'} max-h-[95vh] overflow-hidden`}
// //         onClick={(e) => e.stopPropagation()}
// //       >
// //         {children}
// //       </div>
// //     </div>
// //   );
// // };

// // // 🧩 Add/Edit Lead Form Component
// // const LeadForm = ({ initialData, onSubmit, onClose }) => {
// //   const [formData, setFormData] = useState(initialData);
// //   const [errors, setErrors] = useState({});
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [apiError, setApiError] = useState("");
// //   const [submitSuccess, setSubmitSuccess] = useState(false);

// //   useEffect(() => setFormData(initialData), [initialData]);

// //   const validate = (data) => {
// //     const newErrors = {};
// //     if (!data.phone || data.phone.trim() === "")
// //       newErrors.phone = "Phone is required";
// //     return newErrors;
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   // Handle dynamic child ages
// //   const handleChildAgeChange = (index, value) => {
// //     const ages = [...formData.childAges];
// //     ages[index] = value;
// //     setFormData((prev) => ({ ...prev, childAges: ages }));
// //   };
// //   const addChildAge = () => setFormData((prev) => ({ ...prev, childAges: [...prev.childAges, ""] }));
// //   const removeChildAge = (index) => {
// //     const ages = [...formData.childAges];
// //     ages.splice(index, 1);
// //     setFormData((prev) => ({ ...prev, childAges: ages }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     const newErrors = validate(formData);
// //     setErrors(newErrors);
// //     if (Object.keys(newErrors).length > 0) return;

// //     setIsSubmitting(true);
// //     setApiError("");
// //     try {
// //       await onSubmit(formData);
// //       setSubmitSuccess(true);
// //       setTimeout(() => { setSubmitSuccess(false); onClose(); }, 1500);
// //     } catch (err) {
// //       setApiError(err.message);
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit} className="space-y-3">
// //       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
// //         <InputField name="name" value={formData.name} onChange={handleChange} />
// //         <InputField name="email" type="email" value={formData.email} onChange={handleChange} />
// //         <InputField name="phone" value={formData.phone} onChange={handleChange} required error={errors.phone} />
// //         <InputField name="whatsAppNo" value={formData.whatsAppNo} onChange={handleChange} />
// //         <InputField name="departureCity" value={formData.departureCity} onChange={handleChange} />
// //         <InputField name="destination" value={formData.destination} onChange={handleChange} />
// //         <InputField name="expectedTravelDate" type="date" value={formData.expectedTravelDate} onChange={handleChange} />

// //         <SelectField name="noOfDays" options={tripDurations} value={formData.noOfDays} onChange={handleChange} />
// //         {formData.noOfDays === "Others" && (
// //           <InputField
// //             name="customNoOfDays"
// //             placeholder="Enter custom duration"
// //             value={formData.customNoOfDays || ""}
// //             onChange={handleChange}
// //           />
// //         )}

// //         <InputField name="placesToCover" value={formData.placesToCover} onChange={handleChange} />
// //         <InputField name="noOfPerson" type="number" value={formData.noOfPerson} onChange={handleChange} />
// //         <InputField name="noOfChild" type="number" value={formData.noOfChild} onChange={handleChange} />
// //         <InputField name="groupNumber" type="text" value={formData.groupNumber} onChange={handleChange} />

// //         {/* Dynamic Child Ages */}
// //         <div className="col-span-2">
// //           <label className="block text-xs font-medium text-gray-700 mb-0.5">Child Ages</label>
// //           {formData.childAges.map((age, idx) => (
// //             <div key={idx} className="flex gap-2 mb-1">
// //               <input
// //                 type="number"
// //                 value={age}
// //                 onChange={(e) => handleChildAgeChange(idx, e.target.value)}
// //                 placeholder="Child Age"
// //                 className="w-full px-3 py-1.5 border rounded-lg text-sm"
// //               />
// //               <button type="button" onClick={() => removeChildAge(idx)} className="bg-red-100 px-2 rounded hover:bg-red-200">X</button>
// //             </div>
// //           ))}
// //           <button type="button" onClick={addChildAge} className="mt-1 text-blue-600 hover:underline text-sm">
// //             + Add Child Age
// //           </button>
// //         </div>

// //         <SelectField name="leadSource" options={leadSources} value={formData.leadSource} onChange={handleChange} />
// //         <SelectField name="leadType" options={leadTypes} value={formData.leadType} onChange={handleChange} />
// //         <SelectField name="tripType" options={tripTypes} value={formData.tripType} onChange={handleChange} />
// //         <SelectField name="leadStatus" options={leadStatuses} value={formData.leadStatus} onChange={handleChange} />
// //       </div>

// //       <div className="mt-2">
// //         <label className="block text-xs font-medium text-gray-700 mb-0.5">Notes</label>
// //         <textarea
// //           name="notes"
// //           value={formData.notes}
// //           onChange={handleChange}
// //           rows="3"
// //           placeholder="Add any notes or remarks..."
// //           className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
// //         ></textarea>
// //       </div>

// //       <div className="mt-3 flex gap-2">
// //         <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
// //           {isSubmitting ? "Saving..." : "Save Lead"}
// //         </button>
// //         <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded">
// //           Cancel
// //         </button>
// //       </div>

// //       {apiError && <p className="text-red-600 mt-2">{apiError}</p>}
// //       {submitSuccess && <p className="text-green-600 mt-2">Lead saved successfully!</p>}
// //     </form>
// //   );
// // };

// // // 🧩 Main Component
// // const EmployeeLeads = () => {
// //   const [leads, setLeads] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");
// //   const [viewLead, setViewLead] = useState(null);
// //   const [editLead, setEditLead] = useState(null);
// //   const [isAddModalOpen, setIsAddModalOpen] = useState(false);

// //   const employeeId = localStorage.getItem("userId");

// //   const fetchLeads = async () => {
// //     setLoading(true);
// //     setError("");
// //     if (!employeeId) { setError("Employee ID not found"); setLoading(false); return; }
// //     try {
// //       const res = await fetch(`http://localhost:4000/employeelead/employee/${employeeId}`);
// //       if (!res.ok) throw new Error(`Server Error: ${res.status}`);
// //       const data = await res.json();
// //       setLeads((data.leads || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
// //     } catch (err) {
// //       setError(err.message || "Failed to fetch leads");
// //     } finally { setLoading(false); }
// //   };

// //   useEffect(() => { fetchLeads(); }, []);

// //   const handleView = (lead) => setViewLead(lead);
// //   const handleEdit = (lead) => setEditLead(lead);
// //   const closeModal = () => { setViewLead(null); setEditLead(null); setIsAddModalOpen(false); };

// //   const handleAddLead = async (data) => {
// //     const res = await fetch("http://localhost:4000/employeelead", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ ...data, employeeId }),
// //     });
// //     if (!res.ok) throw new Error("Failed to create lead");
// //     await fetchLeads();
// //   };

// //   const handleUpdateLead = async (data) => {
// //     if (!editLead) return;
// //     const res = await fetch(`http://localhost:4000/employeelead/${editLead._id}`, {
// //       method: "PUT",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(data),
// //     });
// //     if (!res.ok) throw new Error("Failed to update lead");
// //     await fetchLeads();
// //   };

// //   const formatDate = (dateString) => {
// //     if (!dateString) return "-";
// //     const date = new Date(dateString);
// //     return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
// //   };

// //   return (
// //     <div className="p-4">
// //       <button
// //         onClick={() => setIsAddModalOpen(true)}
// //         className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
// //       >
// //         <Plus className="w-4 h-4" /> Add Lead
// //       </button>

// //       <div className="mt-6 overflow-x-auto">
// //         {loading ? <p>Loading leads...</p> :
// //          error || leads.length === 0 ? <p className="text-gray-600">Please Enter Leads</p> :
// //          <table className="min-w-full border border-gray-300 rounded-lg">
// //           <thead className="bg-gray-100">
// //             <tr>
// //               <th className="px-4 py-2 border">Name</th>
// //               <th className="px-4 py-2 border">Email</th>
// //               <th className="px-4 py-2 border">Phone</th>
// //               <th className="px-4 py-2 border">Departure</th>
// //               <th className="px-4 py-2 border">Destination</th>
// //               <th className="px-4 py-2 border">Travel Date</th>
// //               <th className="px-4 py-2 border text-center">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {leads.map((lead) => (
// //               <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
// //                 <td className="px-4 py-2 border">{lead.name}</td>
// //                 <td className="px-4 py-2 border">{lead.email}</td>
// //                 <td className="px-4 py-2 border">{lead.phone}</td>
// //                 <td className="px-4 py-2 border">{lead.departureCity}</td>
// //                 <td className="px-4 py-2 border">{lead.destination}</td>
// //                 <td className="px-4 py-2 border">{formatDate(lead.expectedTravelDate)}</td>
// //                 <td className="px-4 py-2 border text-center">
// //                   <div className="flex justify-center gap-2">
// //                     <button onClick={() => handleView(lead)} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200" title="View Lead"><Eye size={16} /></button>
// //                     <button onClick={() => handleEdit(lead)} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200" title="Edit Lead"><Edit2 size={16} /></button>
// //                   </div>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //          </table>}
// //       </div>

// //       {/* Add/Edit Modal */}
// //       {(isAddModalOpen || editLead) && (
// //         <Modal isOpen={true} onClose={closeModal} size="large">
// //           <div className="flex flex-col h-full max-h-[95vh]">
// //             <div className="p-4 border-b flex justify-between items-center">
// //               <h2 className="text-lg font-bold text-gray-900">
// //                 {editLead ? "Edit Lead" : "Add New Lead"}
// //               </h2>
// //               <button onClick={closeModal} className="text-gray-600 hover:text-gray-800"><X size={20} /></button>
// //             </div>
// //             <div className="flex-1 overflow-y-auto p-4">
// //               <LeadForm
// //                 initialData={editLead || {
// //                   name: "", email: "", phone: "", whatsAppNo: "",
// //                   departureCity: "", destination: "", expectedTravelDate: "",
// //                   noOfDays: "", customNoOfDays: "", placesToCover: "",
// //                   noOfPerson: "", noOfChild: "", childAges: [],
// //                   groupNumber: "", // ← Added
// //                   leadSource: "", leadType: "", tripType: "",
// //                   leadStatus: "Hot", notes: ""
// //                 }}
// //                 onSubmit={editLead ? handleUpdateLead : handleAddLead}
// //                 onClose={closeModal}
// //               />
// //             </div>
// //           </div>
// //         </Modal>
// //       )}

// //       {/* View Lead Modal */}
// //       {viewLead && (
// //         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={closeModal}>
// //           <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
// //             <button onClick={closeModal} className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"><X size={18} /></button>
// //             <h2 className="text-lg font-semibold mb-4 text-center">Lead Details</h2>
// //             <div className="space-y-3">
// //               <div><strong className="block text-gray-700">Name:</strong> {viewLead.name || "-"}</div>
// //               <div><strong className="block text-gray-700">Email:</strong> {viewLead.email || "-"}</div>
// //               <div><strong className="block text-gray-700">Phone:</strong> {viewLead.phone || "-"}</div>
// //               <div><strong className="block text-gray-700">WhatsApp:</strong> {viewLead.whatsAppNo || "-"}</div>
// //               <div><strong className="block text-gray-700">Departure:</strong> {viewLead.departureCity || "-"}</div>
// //               <div><strong className="block text-gray-700">Destination:</strong> {viewLead.destination || "-"}</div>
// //               <div><strong className="block text-gray-700">Travel Date:</strong> {formatDate(viewLead.expectedTravelDate)}</div>
// //               <div><strong className="block text-gray-700">No. of Days:</strong> {viewLead.noOfDays || "-"} {viewLead.noOfDays === "Others" ? `(${viewLead.customNoOfDays})` : ""}</div>
// //               <div><strong className="block text-gray-700">Places to Cover:</strong> {viewLead.placesToCover || "-"}</div>
// //               <div><strong className="block text-gray-700">No. of Persons:</strong> {viewLead.noOfPerson || "-"}</div>
// //               <div><strong className="block text-gray-700">No. of Children:</strong> {viewLead.noOfChild || "-"}</div>
// //               <div><strong className="block text-gray-700">Child Ages:</strong> {viewLead.childAges?.length ? viewLead.childAges.join(", ") : "-"}</div>
// //               <div><strong className="block text-gray-700">Group Number:</strong> {viewLead.groupNumber || "-"}</div>
// //               <div><strong className="block text-gray-700">Lead Source:</strong> {viewLead.leadSource || "-"}</div>
// //               <div><strong className="block text-gray-700">Lead Type:</strong> {viewLead.leadType || "-"}</div>
// //               <div><strong className="block text-gray-700">Trip Type:</strong> {viewLead.tripType || "-"}</div>
// //               <div><strong className="block text-gray-700">Lead Status:</strong> {viewLead.leadStatus || "-"}</div>
// //               <div><strong className="block text-gray-700">Notes:</strong> {viewLead.notes || "-"}</div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default EmployeeLeads;




// import React, { useState, useEffect } from "react";
// import { Plus, AlertCircle, Eye, Edit2, X } from "lucide-react";

// // 🧩 Dropdown Options
// const leadSources = [
//   "Cold Call", "Website", "Referral", "LinkedIn", "Trade Show",
//   "Email Campaign", "Social Media", "Event", "Organic Search", "Paid Ads",
// ];
// const leadTypes = ["International", "Domestic"];
// const tripTypes = ["Solo", "Group", "Family", "Couple", "Honeymoon"];
// const leadStatuses = ["Hot", "Warm", "Cold", "Converted", "Lost"];
// const tripDurations = [
//   "1n/2d","2n/3d","3n/4d","4n/5d","5n/6d","6n/7d","7n/8d","8n/9d","9n/10d",
//   "10n/11d","11n/12d","12n/13d","13n/14d","14n/15d","Others"
// ];

// // 🧩 Input Field Component
// const InputField = ({ name, type = "text", placeholder, required, value, error, onChange }) => (
//   <div className="h-[4.5rem]">
//     <label className="block text-xs font-medium text-gray-700 mb-0.5">
//       {name.charAt(0).toUpperCase() + name.slice(1)} {required && <span className="text-red-500">*</span>}
//     </label>
//     <input
//       type={type}
//       name={name}
//       value={value || ""}
//       onChange={onChange}
//       placeholder={placeholder}
//       className={`w-full px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
//         error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
//       }`}
//       autoComplete="off"
//     />
//     {error && (
//       <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
//         <AlertCircle className="w-3 h-3" /> {error}
//       </p>
//     )}
//   </div>
// );

// // 🧩 Select Field Component
// const SelectField = ({ name, options, required, value, error, onChange }) => (
//   <div className="h-[4.5rem]">
//     <label className="block text-xs font-medium text-gray-700 mb-0.5">
//       {name.charAt(0).toUpperCase() + name.slice(1)} {required && <span className="text-red-500">*</span>}
//     </label>
//     <select
//       name={name}
//       value={value || ""}
//       onChange={onChange}
//       className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
//         error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
//       }`}
//     >
//       <option value="">Select {name}</option>
//       {options.map((opt) => (
//         <option key={opt}>{opt}</option>
//       ))}
//     </select>
//     {error && (
//       <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
//         <AlertCircle className="w-3 h-3" /> {error}
//       </p>
//     )}
//   </div>
// );

// // 🧩 Modal Component
// const Modal = ({ isOpen, onClose, size = "large", children }) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
//       <div 
//         className={`bg-white rounded-lg shadow-lg ${size === 'large' ? 'w-full max-w-4xl' : 'w-full max-w-md'} max-h-[95vh] overflow-hidden`}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {children}
//       </div>
//     </div>
//   );
// };

// // 🧩 Add/Edit Lead Form Component
// const LeadForm = ({ initialData, onSubmit, onClose }) => {
//   const [formData, setFormData] = useState(initialData);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [apiError, setApiError] = useState("");
//   const [submitSuccess, setSubmitSuccess] = useState(false);

//   useEffect(() => setFormData(initialData), [initialData]);

//   const validate = (data) => {
//     const newErrors = {};
//     if (!data.phone || data.phone.trim() === "")
//       newErrors.phone = "Phone is required";
//     return newErrors;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleChildAgeChange = (index, value) => {
//     const ages = [...formData.childAges];
//     ages[index] = value;
//     setFormData((prev) => ({ ...prev, childAges: ages }));
//   };
//   const addChildAge = () => setFormData((prev) => ({ ...prev, childAges: [...prev.childAges, ""] }));
//   const removeChildAge = (index) => {
//     const ages = [...formData.childAges];
//     ages.splice(index, 1);
//     setFormData((prev) => ({ ...prev, childAges: ages }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newErrors = validate(formData);
//     setErrors(newErrors);
//     if (Object.keys(newErrors).length > 0) return;

//     setIsSubmitting(true);
//     setApiError("");
//     try {
//       await onSubmit(formData);
//       setSubmitSuccess(true);
//       setTimeout(() => { setSubmitSuccess(false); onClose(); }, 1500);
//     } catch (err) {
//       setApiError(err.message || "Failed to save lead");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-3">
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//         <InputField name="name" value={formData.name} onChange={handleChange} />
//         <InputField name="email" type="email" value={formData.email} onChange={handleChange} />
//         <InputField name="phone" value={formData.phone} onChange={handleChange} required error={errors.phone} />
//         <InputField name="whatsAppNo" value={formData.whatsAppNo} onChange={handleChange} />
//         <InputField name="departureCity" value={formData.departureCity} onChange={handleChange} />
//         <InputField name="destination" value={formData.destination} onChange={handleChange} />
//         <InputField name="expectedTravelDate" type="date" value={formData.expectedTravelDate} onChange={handleChange} />

//         <SelectField name="noOfDays" options={tripDurations} value={formData.noOfDays} onChange={handleChange} />
//         {formData.noOfDays === "Others" && (
//           <InputField
//             name="customNoOfDays"
//             placeholder="Enter custom duration"
//             value={formData.customNoOfDays || ""}
//             onChange={handleChange}
//           />
//         )}

//         <InputField name="placesToCover" value={formData.placesToCover} onChange={handleChange} />
//         <InputField name="noOfPerson" type="number" value={formData.noOfPerson} onChange={handleChange} />
//         <InputField name="noOfChild" type="number" value={formData.noOfChild} onChange={handleChange} />
//         <InputField name="groupNumber" type="text" value={formData.groupNumber} onChange={handleChange} />

//         {/* Dynamic Child Ages */}
//         <div className="col-span-2">
//           <label className="block text-xs font-medium text-gray-700 mb-0.5">Child Ages</label>
//           {formData.childAges.map((age, idx) => (
//             <div key={idx} className="flex gap-2 mb-1">
//               <input
//                 type="number"
//                 value={age}
//                 onChange={(e) => handleChildAgeChange(idx, e.target.value)}
//                 placeholder="Child Age"
//                 className="w-full px-3 py-1.5 border rounded-lg text-sm"
//               />
//               <button type="button" onClick={() => removeChildAge(idx)} className="bg-red-100 px-2 rounded hover:bg-red-200">X</button>
//             </div>
//           ))}
//           <button type="button" onClick={addChildAge} className="mt-1 text-blue-600 hover:underline text-sm">
//             + Add Child Age
//           </button>
//         </div>

//         <SelectField name="leadSource" options={leadSources} value={formData.leadSource} onChange={handleChange} />
//         <SelectField name="leadType" options={leadTypes} value={formData.leadType} onChange={handleChange} />
//         <SelectField name="tripType" options={tripTypes} value={formData.tripType} onChange={handleChange} />
//         <SelectField name="leadStatus" options={leadStatuses} value={formData.leadStatus} onChange={handleChange} />
//       </div>

//       <div className="mt-2">
//         <label className="block text-xs font-medium text-gray-700 mb-0.5">Notes</label>
//         <textarea
//           name="notes"
//           value={formData.notes}
//           onChange={handleChange}
//           rows="3"
//           placeholder="Add any notes or remarks..."
//           className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
//         ></textarea>
//       </div>

//       <div className="mt-3 flex gap-2">
//         <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
//           {isSubmitting ? "Saving..." : "Save Lead"}
//         </button>
//         <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded">
//           Cancel
//         </button>
//       </div>

//       {apiError && <p className="text-red-600 mt-2">{apiError}</p>}
//       {submitSuccess && <p className="text-green-600 mt-2">Lead saved successfully!</p>}
//     </form>
//   );
// };

// // 🧩 Main Component
// const EmployeeLeads = () => {
//   const [leads, setLeads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [viewLead, setViewLead] = useState(null);
//   const [editLead, setEditLead] = useState(null);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);

//   const employeeId = localStorage.getItem("userId"); // employee ID

//   const fetchLeads = async () => {
//     setLoading(true);
//     setError("");
//     if (!employeeId) { setError("Employee ID not found"); setLoading(false); return; }
//     try {
//       const res = await fetch(`http://localhost:4000/employeelead/employee/${employeeId}`);
//       if (!res.ok) throw new Error(`Server Error: ${res.status}`);
//       const data = await res.json();
//       setLeads((data.leads || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
//     } catch (err) {
//       setError(err.message || "Failed to fetch leads");
//     } finally { setLoading(false); }
//   };

//   useEffect(() => { fetchLeads(); }, []);

//   const handleView = (lead) => setViewLead(lead);
//   const handleEdit = (lead) => setEditLead(lead);
//   const closeModal = () => { setViewLead(null); setEditLead(null); setIsAddModalOpen(false); };

//   const handleAddLead = async (data) => {
//     const payload = { ...data, employee: employeeId }; // include employee
//     const res = await fetch("http://localhost:4000/employeelead", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     if (!res.ok) throw new Error("Failed to create lead");
//     await fetchLeads();
//   };

//   const handleUpdateLead = async (data) => {
//     if (!editLead) return;
//     const payload = { ...data, employee: employeeId }; // include employee
//     const res = await fetch(`http://localhost:4000/employeelead/${editLead._id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     if (!res.ok) throw new Error("Failed to update lead");
//     await fetchLeads();
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "-";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
//   };

//   return (
//     <div className="p-4">
//       <button
//         onClick={() => setIsAddModalOpen(true)}
//         className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
//       >
//         <Plus className="w-4 h-4" /> Add Lead
//       </button>

//       <div className="mt-6 overflow-x-auto">
//         {loading ? <p>Loading leads...</p> :
//          error || leads.length === 0 ? <p className="text-gray-600">Please Enter Leads</p> :
//          <table className="min-w-full border border-gray-300 rounded-lg">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-2 border">Name</th>
//               <th className="px-4 py-2 border">Email</th>
//               <th className="px-4 py-2 border">Phone</th>
//               <th className="px-4 py-2 border">Departure</th>
//               <th className="px-4 py-2 border">Destination</th>
//               <th className="px-4 py-2 border">Travel Date</th>
//               <th className="px-4 py-2 border text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {leads.map((lead) => (
//               <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
//                 <td className="px-4 py-2 border">{lead.name}</td>
//                 <td className="px-4 py-2 border">{lead.email}</td>
//                 <td className="px-4 py-2 border">{lead.phone}</td>
//                 <td className="px-4 py-2 border">{lead.departureCity}</td>
//                 <td className="px-4 py-2 border">{lead.destination}</td>
//                 <td className="px-4 py-2 border">{formatDate(lead.expectedTravelDate)}</td>
//                 <td className="px-4 py-2 border text-center">
//                   <div className="flex justify-center gap-2">
//                     <button onClick={() => handleView(lead)} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200" title="View Lead"><Eye size={16} /></button>
//                     <button onClick={() => handleEdit(lead)} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200" title="Edit Lead"><Edit2 size={16} /></button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//          </table>}
//       </div>

//       {/* Add/Edit Modal */}
//       {(isAddModalOpen || editLead) && (
//         <Modal isOpen={true} onClose={closeModal} size="large">
//           <div className="flex flex-col h-full max-h-[95vh]">
//             <div className="p-4 border-b flex justify-between items-center">
//               <h2 className="text-lg font-bold text-gray-900">
//                 {editLead ? "Edit Lead" : "Add New Lead"}
//               </h2>
//               <button onClick={closeModal} className="text-gray-600 hover:text-gray-800"><X size={20} /></button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-4">
//               <LeadForm
//                 initialData={editLead || {
//                   name: "", email: "", phone: "", whatsAppNo: "",
//                   departureCity: "", destination: "", expectedTravelDate: "",
//                   noOfDays: "", customNoOfDays: "", placesToCover: "",
//                   noOfPerson: "", noOfChild: "", childAges: [],
//                   groupNumber: "",
//                   leadSource: "", leadType: "", tripType: "",
//                   leadStatus: "Hot", notes: "",
//                   employee: employeeId // ✅ include employee
//                 }}
//                 onSubmit={editLead ? handleUpdateLead : handleAddLead}
//                 onClose={closeModal}
//               />
//             </div>
//           </div>
//         </Modal>
//       )}

//       {/* View Lead Modal */}
//       {viewLead && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={closeModal}>
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
//             <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"><X size={20} /></button>
//             <h3 className="text-lg font-semibold mb-3">Lead Details</h3>
//             <div className="space-y-2 text-sm">
//               {Object.entries(viewLead).map(([key, val]) => (
//                 key !== "_id" && key !== "__v" && (
//                   <p key={key}><span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {Array.isArray(val) ? val.join(", ") : val || "-"}</p>
//                 )
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmployeeLeads;

import React, { useState, useEffect } from "react";
import { Plus, AlertCircle, Eye, Edit2, X } from "lucide-react";

// 🧩 Dropdown Options
const leadSources = [
  "Cold Call", "Website", "Referral", "LinkedIn", "Trade Show",
  "Email Campaign", "Social Media", "Event", "Organic Search", "Paid Ads",
];
const leadTypes = ["International", "Domestic"];
const tripTypes = ["Solo", "Group", "Family", "Couple", "Honeymoon"];
const leadStatuses = ["Hot", "Warm", "Cold", "Converted", "Lost"];
const tripDurations = [
  "1n/2d","2n/3d","3n/4d","4n/5d","5n/6d","6n/7d","7n/8d","8n/9d","9n/10d",
  "10n/11d","11n/12d","12n/13d","13n/14d","14n/15d","Others"
];

// 🧩 Input Field Component
const InputField = ({ name, type = "text", placeholder, required, value, error, onChange }) => (
  <div className="h-[4.5rem]">
    <label className="block text-xs font-medium text-gray-700 mb-0.5">
      {name.charAt(0).toUpperCase() + name.slice(1)} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
        error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
      }`}
      autoComplete="off"
    />
    {error && (
      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {error}
      </p>
    )}
  </div>
);

// 🧩 Select Field Component
const SelectField = ({ name, options, required, value, error, onChange }) => (
  <div className="h-[4.5rem]">
    <label className="block text-xs font-medium text-gray-700 mb-0.5">
      {name.charAt(0).toUpperCase() + name.slice(1)} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
        error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
      }`}
    >
      <option value="">Select {name}</option>
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
    {error && (
      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {error}
      </p>
    )}
  </div>
);

// 🧩 Modal Component
const Modal = ({ isOpen, onClose, size = "large", children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className={`bg-white rounded-lg shadow-lg ${size === "large" ? "w-full max-w-4xl" : "w-full max-w-md"} max-h-[95vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

// 🧩 Add/Edit Lead Form Component
const LeadForm = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsAppNo: "",
    departureCity: "",
    destination: "",
    expectedTravelDate: "",
    noOfDays: "",
    customNoOfDays: "",
    placesToCover: "",
    placesToCoverArray: [],
    noOfPerson: "",
    noOfChild: "",
    childAges: [],
    groupNumber: "",
    leadSource: "",
    leadType: "",
    tripType: "",
    leadStatus: "Hot",
    notes: "",
    ...initialData,
    placesToCoverArray: initialData?.placesToCoverArray || (initialData?.placesToCover ? initialData.placesToCover.split(", ").map(p => p.trim()) : []),
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      whatsAppNo: "",
      departureCity: "",
      destination: "",
      expectedTravelDate: "",
      noOfDays: "",
      customNoOfDays: "",
      placesToCover: "",
      placesToCoverArray: initialData?.placesToCoverArray || (initialData?.placesToCover ? initialData.placesToCover.split(", ").map(p => p.trim()) : []),
      noOfPerson: "",
      noOfChild: "",
      childAges: [],
      groupNumber: "",
      leadSource: "",
      leadType: "",
      tripType: "",
      leadStatus: "Hot",
      notes: "",
      ...initialData,
    });
  }, [initialData]);

  // Validation
  const validate = (data) => {
    const newErrors = {};
    if (!data.phone || data.phone.trim() === "") newErrors.phone = "Phone is required";
    return newErrors;
  };

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Child ages handlers
  const handleChildAgeChange = (index, value) => {
    const ages = [...formData.childAges];
    ages[index] = value;
    setFormData((prev) => ({ ...prev, childAges: ages }));
  };
  const addChildAge = () => setFormData((prev) => ({ ...prev, childAges: [...prev.childAges, ""] }));
  const removeChildAge = (index) => {
    const ages = [...formData.childAges];
    ages.splice(index, 1);
    setFormData((prev) => ({ ...prev, childAges: ages }));
  };

  // Places to cover handlers
  const handleAddPlace = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const place = e.target.value.trim();
      if (!place) return;

      const currentPlaces = formData.placesToCoverArray || [];
      if (!currentPlaces.includes(place)) {
        setFormData((prev) => ({
          ...prev,
          placesToCoverArray: [...currentPlaces, place],
        }));
      }
      e.target.value = "";
    }
  };
  const removePlace = (index) => {
    const updatedPlaces = [...(formData.placesToCoverArray || [])];
    updatedPlaces.splice(index, 1);
    setFormData((prev) => ({ ...prev, placesToCoverArray: updatedPlaces }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      ...formData,
      placesToCover: (formData.placesToCoverArray || []).join(", "),
    };

    setIsSubmitting(true);
    setApiError("");
    try {
      await onSubmit(payload);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setApiError(err.message || "Failed to save lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputField name="name" value={formData.name} onChange={handleChange} />
        <InputField name="email" type="email" value={formData.email} onChange={handleChange} />
        <InputField name="phone" value={formData.phone} onChange={handleChange} required error={errors.phone} />
        <InputField name="whatsAppNo" value={formData.whatsAppNo} onChange={handleChange} />
        <InputField name="departureCity" value={formData.departureCity} onChange={handleChange} />
        <InputField name="destination" value={formData.destination} onChange={handleChange} />
        <InputField name="expectedTravelDate" type="date" value={formData.expectedTravelDate} onChange={handleChange} />
        <SelectField name="noOfDays" options={tripDurations} value={formData.noOfDays} onChange={handleChange} />
        {formData.noOfDays === "Others" && (
          <InputField name="customNoOfDays" placeholder="Enter custom duration" value={formData.customNoOfDays || ""} onChange={handleChange} />
        )}

        {/* Multi-place input */}
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-0.5">Places to Cover</label>
          <div className="flex flex-wrap gap-1 mb-1">
            {(formData.placesToCoverArray || []).map((place, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1 text-sm">
                {place}
                <button type="button" onClick={() => removePlace(idx)}>x</button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type a place and press Enter"
            onKeyDown={handleAddPlace}
            className="w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <InputField name="noOfPerson" type="number" value={formData.noOfPerson} onChange={handleChange} />
        <InputField name="noOfChild" type="number" value={formData.noOfChild} onChange={handleChange} />
        <InputField name="groupNumber" type="text" value={formData.groupNumber} onChange={handleChange} />

        {/* Child Ages */}
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-0.5">Child Ages</label>
          {formData.childAges.map((age, idx) => (
            <div key={idx} className="flex gap-2 mb-1">
              <input type="number" value={age} onChange={(e) => handleChildAgeChange(idx, e.target.value)} placeholder="Child Age" className="w-full px-3 py-1.5 border rounded-lg text-sm" />
              <button type="button" onClick={() => removeChildAge(idx)} className="bg-red-100 px-2 rounded hover:bg-red-200">X</button>
            </div>
          ))}
          <button type="button" onClick={addChildAge} className="mt-1 text-blue-600 hover:underline text-sm">+ Add Child Age</button>
        </div>

        <SelectField name="leadSource" options={leadSources} value={formData.leadSource} onChange={handleChange} />
        <SelectField name="leadType" options={leadTypes} value={formData.leadType} onChange={handleChange} />
        <SelectField name="tripType" options={tripTypes} value={formData.tripType} onChange={handleChange} />
        <SelectField name="leadStatus" options={leadStatuses} value={formData.leadStatus} onChange={handleChange} />
      </div>

      <div className="mt-2">
        <label className="block text-xs font-medium text-gray-700 mb-0.5">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          placeholder="Add any notes or remarks..."
          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
        ></textarea>
      </div>

      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          {isSubmitting ? "Saving..." : "Save Lead"}
        </button>
        <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded">
          Cancel
        </button>
      </div>
      {apiError && <p className="text-red-600 mt-2">{apiError}</p>}
      {submitSuccess && <p className="text-green-600 mt-2">Lead saved successfully!</p>}
    </form>
  );
};

// 🧩 Main EmployeeLeads Component
const EmployeeLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewLead, setViewLead] = useState(null);
  const [editLead, setEditLead] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const employeeId = localStorage.getItem("userId");

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    if (!employeeId) {
      setError("Employee ID not found");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:4000/employeelead/employee/${employeeId}`);
      if (!res.ok) throw new Error(`Server Error: ${res.status}`);
      const data = await res.json();
      setLeads((data.leads || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      setError(err.message || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleView = (lead) => setViewLead(lead);
  const handleEdit = (lead) => setEditLead(lead);
  const closeModal = () => {
    setViewLead(null);
    setEditLead(null);
    setIsAddModalOpen(false);
  };

  const handleAddLead = async (data) => {
    const payload = { ...data, employee: employeeId };
    const res = await fetch("http://localhost:4000/employeelead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create lead");
    await fetchLeads();
  };

  const handleUpdateLead = async (data) => {
    if (!editLead) return;
    const payload = { ...data, employee: employeeId };
    const res = await fetch(`http://localhost:4000/employeelead/${editLead._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update lead");
    await fetchLeads();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="p-4">
      <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
        <Plus className="w-4 h-4" /> Add Lead
      </button>

      <div className="mt-6 overflow-x-auto">
        {loading ? <p>Loading leads...</p> :
        error || leads.length === 0 ? <p className="text-gray-600">Please Enter Leads</p> :
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Departure</th>
              <th className="px-4 py-2 border">Destination</th>
              <th className="px-4 py-2 border">Travel Date</th>
              <th className="px-4 py-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2 border">{lead.name}</td>
                <td className="px-4 py-2 border">{lead.email}</td>
                <td className="px-4 py-2 border">{lead.phone}</td>
                <td className="px-4 py-2 border">{lead.departureCity}</td>
                <td className="px-4 py-2 border">{lead.destination}</td>
                <td className="px-4 py-2 border">{formatDate(lead.expectedTravelDate)}</td>
                <td className="px-4 py-2 border text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => handleView(lead)} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200" title="View Lead"><Eye size={16} /></button>
                    <button onClick={() => handleEdit(lead)} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200" title="Edit Lead"><Edit2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>

      {/* Add/Edit Modal */}
      {(isAddModalOpen || editLead) && (
        <Modal isOpen={true} onClose={closeModal} size="large">
          <div className="flex flex-col h-full max-h-[95vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">{editLead ? "Edit Lead" : "Add New Lead"}</h2>
              <button onClick={closeModal} className="text-gray-600 hover:text-gray-800"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <LeadForm
                initialData={editLead || {
                  name: "", email: "", phone: "", whatsAppNo: "", departureCity: "",
                  destination: "", expectedTravelDate: "", noOfDays: "", customNoOfDays: "",
                  placesToCover: "", placesToCoverArray: [], noOfPerson: "", noOfChild: "",
                  childAges: [], groupNumber: "", leadSource: "", leadType: "", tripType: "",
                  leadStatus: "Hot", notes: "", employee: employeeId
                }}
                onSubmit={editLead ? handleUpdateLead : handleAddLead}
                onClose={closeModal}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* View Lead Modal */}
      {viewLead && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"><X size={20} /></button>
            <h3 className="text-lg font-semibold mb-3">Lead Details</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(viewLead).map(([key, val]) => (
                key !== "_id" && key !== "__v" && (
                  <p key={key}><span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {Array.isArray(val) ? val.join(", ") : val || "-"}</p>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeLeads;

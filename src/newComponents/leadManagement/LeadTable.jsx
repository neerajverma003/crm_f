// // import React, { useState, useMemo, useCallback, useEffect } from "react";
// import { Eye, Edit2, Trash2, ArrowUpDown } from "lucide-react";
// import { useState,useEffect,useMemo,useCallback } from "react";

// const LeadTable = ({ searchText = "", selectedStatus = "All Status", refreshTrigger }) => {
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//   const [selectedLeads, setSelectedLeads] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [leads, setLeads] = useState([]);

//   // Modal state
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [currentLead, setCurrentLead] = useState(null);

//   // Fetch leads from API
//   const fetchLeadData = async () => {
//     try {
//       const response = await fetch("http://localhost:4000/leads");
//       const result = await response.json();
//       console.log(result)
//       if (result.success) {
//         setLeads(result.data || result);
//       } else {
//         setLeads([]);
//       }
//     } catch (error) {
//       console.error("Error fetching lead data:", error);
//       setLeads([]);
//     }
//   };

//   useEffect(() => {
//     fetchLeadData();
//   }, []);

//   // Status colors
//   const getStatusColor = (status) => {
//     const colors = {
//       Hot: "bg-red-500 text-white",
//       Warm: "bg-orange-500 text-white",
//       Cold: "bg-blue-500 text-white",
//     };
//     return colors[status] || "bg-gray-500 text-white";
//   };

//   // Filter and search
//   const filteredLeads = useMemo(() => {
//     return leads.filter((lead) => {
//       const statusMatch =
//         selectedStatus === "All Status" || lead.leadStatus === selectedStatus;
//       const searchMatch =
//         !searchText ||
//         lead.name?.toLowerCase().includes(searchText.toLowerCase()) ||
//         lead.email?.toLowerCase().includes(searchText.toLowerCase()) ||
//         lead.company?.toLowerCase().includes(searchText.toLowerCase()) ||
//         lead.phone?.includes(searchText);
//       return statusMatch && searchMatch;
//     });
//   }, [leads, searchText, selectedStatus]);

//   // Sort leads
//   const sortedLeads = useMemo(() => {
//     if (!sortConfig.key) return filteredLeads;
//     return [...filteredLeads].sort((a, b) => {
//       let aValue = a[sortConfig.key];
//       let bValue = b[sortConfig.key];
//       if (sortConfig.key === "value") {
//         aValue = parseFloat(aValue?.replace(/[$,]/g, "") || 0);
//         bValue = parseFloat(bValue?.replace(/[$,]/g, "") || 0);
//       }
//       if (sortConfig.key === "lastContact" || sortConfig.key === "createdAt") {
//         aValue = new Date(aValue);
//         bValue = new Date(bValue);
//       }
//       if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [filteredLeads, sortConfig]);

//   // Pagination
//   const paginatedLeads = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return sortedLeads.slice(startIndex, startIndex + itemsPerPage);
//   }, [sortedLeads, currentPage, itemsPerPage]);

//   const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);

//   // Handlers
//   const handleSort = useCallback((key) => {
//     setSortConfig((current) => ({
//       key,
//       direction:
//         current.key === key && current.direction === "asc" ? "desc" : "asc",
//     }));
//   }, []);

//   const handleSelectLead = useCallback((leadId) => {
//     setSelectedLeads((current) =>
//       current.includes(leadId)
//         ? current.filter((id) => id !== leadId)
//         : [...current, leadId]
//     );
//   }, []);

//   const handleSelectAll = useCallback(() => {
//     setSelectedLeads((current) =>
//       current.length === paginatedLeads.length
//         ? []
//         : paginatedLeads.map((lead) => lead._id)
//     );
//   }, [paginatedLeads]);

//   // 👁 View Modal Trigger
//   const handleView = useCallback((lead) => {
//     setCurrentLead(lead);
//     setIsViewModalOpen(true);
//   }, []);

//   // ✏️ Edit Modal Trigger
//   const handleEdit = useCallback((lead) => {
//     setCurrentLead(lead);
//     setIsEditModalOpen(true);
//   }, []);

//   // 🗑 Delete Lead
//   const handleDelete = useCallback(async (lead) => {
//     if (!window.confirm(`Are you sure you want to delete ${lead.name}?`)) return;
//     try {
//       const response = await fetch(`http://localhost:4000/leads/${lead._id}`, {
//         method: "DELETE",
//       });
//       const result = await response.json();
//       if (result.success) {
//         setLeads((prev) => prev.filter((l) => l._id !== lead._id));
//       }
//     } catch (error) {
//       console.error("Error deleting lead:", error);
//     }
//   }, []);

//   // PATCH Update
//   const handleUpdateLead = async (updatedLead) => {
//     try {
//       const response = await fetch(`http://localhost:4000/leads/${updatedLead._id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedLead),
//       });
//       const result = await response.json();
//       if (result.success) {
//         setLeads((prev) =>
//           prev.map((lead) =>
//             lead._id === updatedLead._id ? { ...lead, ...updatedLead } : lead
//           )
//         );
//         setIsEditModalOpen(false);
//       }
//     } catch (error) {
//       console.error("Error updating lead:", error);
//     }
//   };

//   // 🧱 Edit Modal
//  // Edit Modal (UI same as Add Lead)

// const EditModal = ({ lead, onClose, onSave }) => {
//   const [formData, setFormData] = useState({ ...lead });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   if (!lead) return null;

//   const textFields = [
//     "name",
//     "email",
//     "phone",
//     "whatsAppNo",
//     "company",
//     "value",
//     "departureCity",
//     "destination",
//     "noOfDays",
//     "noOfPerson",
//     "noOfChild",
//     "childAge",
//     "placesToCover",
//     "groupNumber"
//   ];

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
//       <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
//         <h2 className="mb-4 text-lg font-semibold text-center">Edit Lead</h2>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {/* Optional Group Number (Edit Only) */}
//           <div className="flex flex-col sm:col-span-2">
//   <label className="mb-1 text-sm font-medium">Group Number </label>
//   <input
//     type="text"
//     name="groupNumber"
//     value={formData.groupNumber || ""}
//     onChange={(e) => {
//       const value = e.target.value;
//       // Allow only numeric and max 4 characters
//       if (/^\d{0,4}$/.test(value)) {
//         setFormData((prev) => ({ ...prev, groupNumber: value }));
//       }
//     }}
//     placeholder="Enter Group Number"
//     className="w-full rounded border px-3 py-2"
//     maxLength={4} // Optional, ensures user can't type more than 4
//   />
// </div>

//           {/* Text Inputs */}
//           {textFields.map((field) => (
//             <div key={field} className="flex flex-col">
//               <label className="mb-1 text-sm font-medium">
//                 {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
//               </label>
//               <input
//                 name={field}
//                 value={formData[field] || ""}
//                 onChange={handleChange}
//                 placeholder={field
//                   .replace(/([A-Z])/g, " $1")
//                   .replace(/^./, (str) => str.toUpperCase())}
//                 className="w-full rounded border px-3 py-2"
//               />
//             </div>
//           ))}

//           {/* Dropdowns */}
//           <div className="flex flex-col">
//             <label className="mb-1 text-sm font-medium">Lead Status</label>
//             <select
//               name="leadStatus"
//               value={formData.leadStatus || "Cold"}
//               onChange={handleChange}
//               className="w-full rounded border px-3 py-2"
//             >
//               <option value="Hot">Hot</option>
//               <option value="Warm">Warm</option>
//               <option value="Cold">Cold</option>
//             </select>
//           </div>

//           <div className="flex flex-col">
//             <label className="mb-1 text-sm font-medium">Lead Source</label>
//             <select
//               name="leadSource"
//               value={formData.leadSource || ""}
//               onChange={handleChange}
//               className="w-full rounded border px-3 py-2"
//             >
//               <option value="">Select Source</option>
//               <option value="Referral">Referral</option>
//               <option value="Website">Website</option>
//               <option value="Social Media">Social Media</option>
//               <option value="Advertisement">Advertisement</option>
//             </select>
//           </div>

//           <div className="flex flex-col">
//             <label className="mb-1 text-sm font-medium">Lead Type</label>
//             <select
//               name="leadType"
//               value={formData.leadType || ""}
//               onChange={handleChange}
//               className="w-full rounded border px-3 py-2"
//             >
//               <option value="">Select Type</option>
//               <option value="Individual">Individual</option>
//               <option value="Corporate">Corporate</option>
//             </select>
//           </div>

//           {/* Date */}
//           <div className="flex flex-col">
//             <label className="mb-1 text-sm font-medium">Expected Travel Date</label>
//             <input
//               type="date"
//               name="expectedTravelDate"
//               value={formData.expectedTravelDate?.split("T")[0] || ""}
//               onChange={handleChange}
//               className="w-full rounded border px-3 py-2"
//             />
//           </div>

//           {/* Notes */}
//           <div className="flex flex-col sm:col-span-2">
//             <label className="mb-1 text-sm font-medium">Notes</label>
//             <textarea
//               name="notes"
//               value={formData.notes || ""}
//               onChange={handleChange}
//               placeholder="Notes"
//               className="w-full rounded border px-3 py-2"
//             />
//           </div>

//           {/* Buttons */}
//           <div className="sm:col-span-2 mt-4 flex justify-end gap-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="rounded bg-gray-200 px-4 py-2"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="rounded bg-blue-500 px-4 py-2 text-white"
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // export default EditModal;

//   // 👁 Read-only View Modal
//   const ViewModal = ({ lead, onClose }) => {
//   if (!lead) return null;

//   const formatDate = (date) => new Date(date).toLocaleDateString();

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
//       <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
//         <h2 className="mb-4 text-lg font-semibold text-center text-gray-800">
//           Lead Details
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-800">
//           <p><strong>Name:</strong> {lead.name}</p>
//           <p><strong>Email:</strong> {lead.email}</p>
//           <p><strong>Phone:</strong> {lead.phone}</p>
//           <p><strong>WhatsApp No:</strong> {lead.whatsAppNo}</p>
//           <p><strong>Company:</strong> {lead.company}</p>
//           <p><strong>Lead Source:</strong> {lead.leadSource}</p>
//           <p><strong>Lead Type:</strong> {lead.leadType}</p>
//           <p><strong>Lead Status:</strong> {lead.leadStatus}</p>
//           <p><strong>Value:</strong> ${lead.value}</p>
//           <p><strong>Departure City:</strong> {lead.departureCity}</p>
//           <p><strong>Destination:</strong> {lead.destination}</p>
//           <p><strong>Expected Travel:</strong> {formatDate(lead.expectedTravelDate)}</p>
//           <p><strong>No. of Days:</strong> {lead.noOfDays}</p>
//           <p><strong>No. of Persons:</strong> {lead.noOfPerson}</p>
//           <p><strong>No. of Children:</strong> {lead.noOfChild}</p>
//           <p><strong>Group Number:</strong>{lead.groupNumber}</p>
//           <p><strong>Child Age:</strong> {lead.childAge}</p>
//           <p><strong>Places to Cover:</strong> {lead.placesToCover}</p>
//           <p><strong>Last Contact:</strong> {formatDate(lead.lastContact)}</p>
//           <p><strong>Created At:</strong> {formatDate(lead.createdAt)}</p>
//           <p><strong>Updated At:</strong> {formatDate(lead.updatedAt)}</p>
//           <p className="sm:col-span-2"><strong>Notes:</strong> {lead.notes}</p>
//         </div>

//         <div className="mt-6 flex justify-center">
//           <button
//             onClick={onClose}
//             className="rounded bg-red-500 px-5 py-2 text-white hover:bg-red-600 transition"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

//   const SortableHeader = ({ column, children }) => (
//     <th
//       className="cursor-pointer px-3 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 sm:px-6"
//       onClick={() => handleSort(column)}
//     >
//       <div className="flex items-center gap-2">
//         <span>{children}</span>
//         <ArrowUpDown className="h-4 w-4" />
//       </div>
//     </th>
//   );

//   if (filteredLeads.length === 0) {
//     return (
//       <div className="py-12 text-center">
//         <h3 className="mb-2 text-lg font-medium text-gray-900">
//           No leads found
//         </h3>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-full overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//   <tr>
//     <th className="px-3 py-4 sm:px-6">
//       <input
//         type="checkbox"
//         checked={
//           selectedLeads.length === paginatedLeads.length &&
//           paginatedLeads.length > 0
//         }
//         onChange={handleSelectAll}
//         className="h-4 w-4 rounded border-gray-300 text-indigo-600"
//       />
//     </th>
//     <SortableHeader column="name">Name</SortableHeader>
//     <SortableHeader column="email">Email</SortableHeader>
//     <SortableHeader column="phone">Phone</SortableHeader>
//     <SortableHeader column="whatsAppNo">WhatsApp No</SortableHeader>
//     <SortableHeader column="destination">Destination</SortableHeader>
//     <SortableHeader column="leadSource">Lead Source</SortableHeader>
//     <SortableHeader column="createdAt">Created At</SortableHeader>
//     <th className="px-3 py-4 text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
//       Actions
//     </th>
//   </tr>
// </thead>

// <tbody className="divide-y divide-gray-200 bg-white">
//   {paginatedLeads.map((lead) => (
//     <tr
//       key={lead._id}
//       className={selectedLeads.includes(lead._id) ? "bg-gray-100" : ""}
//     >
//       <td className="px-3 py-4 sm:px-6">
//         <input
//           type="checkbox"
//           checked={selectedLeads.includes(lead._id)}
//           onChange={() => handleSelectLead(lead._id)}
//           className="h-4 w-4 rounded border-gray-300 text-indigo-600"
//         />
//       </td>
//       <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.name}</td>
//       <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.email}</td>
//       <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.phone}</td>
//       <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.whatsAppNo}</td>
//       <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.destination}</td>
//       <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.leadSource}</td>
//       <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">
//         {new Date(lead.createdAt).toLocaleDateString()}
//       </td>
//       <td className="flex items-center gap-3 px-3 py-4 sm:px-6">
//         <button onClick={() => handleView(lead)} className="text-blue-500 hover:text-blue-700">
//           <Eye className="h-4 w-4" />
//         </button>
//         <button onClick={() => handleEdit(lead)} className="text-green-500 hover:text-green-700">
//           <Edit2 className="h-4 w-4" />
//         </button>
//         <button onClick={() => handleDelete(lead)} className="text-red-500 hover:text-red-700">
//           <Trash2 className="h-4 w-4" />
//         </button>
//       </td>
//     </tr>
//   ))}
// </tbody>

//         </table>

//         {/* Pagination */}
//         <div className="mt-4 flex justify-between">
//           <button
//             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//             disabled={currentPage === 1}
//             className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* Modals */}
//       {isEditModalOpen && (
//         <EditModal
//           lead={currentLead}
//           onClose={() => setIsEditModalOpen(false)}
//           onSave={handleUpdateLead}
//         />
//       )}

//       {isViewModalOpen && (
//         <ViewModal
//           lead={currentLead}
//           onClose={() => setIsViewModalOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default LeadTable;

// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { Eye, Edit2, Trash2, ArrowUpDown } from "lucide-react";

// const LeadTable = ({ searchText = "", selectedStatus = "All Status", refreshTrigger }) => {
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//   const [selectedLeads, setSelectedLeads] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [leads, setLeads] = useState([]);
//   const [employee, setEmployee] = useState(null);

//   // Modal state
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [currentLead, setCurrentLead] = useState(null);

//   // ===============================================
//   // Fetch employee data
//   // ===============================================
//   const fetchEmployee = async () => {
//     try {
//       const employeeId = localStorage.getItem("userId");
//       if (!employeeId) return;

//       const response = await fetch(`http://localhost:4000/employee/${employeeId}`);
//       const result = await response.json();

//       if (result.success) {
//         setEmployee(result.employee);
//       }
//     } catch (error) {
//       console.error("Error fetching employee:", error);
//     }
//   };

//   // ===============================================
//   // Fetch leads data
//   // ===============================================
//   const fetchLeadData = async () => {
//     try {
//       const response = await fetch("http://localhost:4000/leads");
//       const result = await response.json();
//       if (result.success) {
//         setLeads(result.data || result);
//       } else {
//         setLeads([]);
//       }
//     } catch (error) {
//       console.error("Error fetching leads:", error);
//       setLeads([]);
//     }
//   };

//   useEffect(() => {
//     fetchEmployee();
//     fetchLeadData();
//   }, [refreshTrigger]);

//   // ===============================================
//   // Filter leads by employee destinations, status, search
//   // ===============================================
//   const filteredLeads = useMemo(() => {
//     if (!employee || !employee.destinations) return [];

//     const employeeDestNames = employee.destinations.map(d => d.destination);

//     return leads.filter((lead) => {
//       const leadDestName = typeof lead.destination === "string" ? lead.destination : lead.destination?.destination;

//       const destinationMatch = employeeDestNames.includes(leadDestName);
//       const statusMatch = selectedStatus === "All Status" || lead.leadStatus === selectedStatus;
//       const searchMatch =
//         !searchText ||
//         lead.name?.toLowerCase().includes(searchText.toLowerCase()) ||
//         lead.email?.toLowerCase().includes(searchText.toLowerCase()) ||
//         lead.company?.toLowerCase().includes(searchText.toLowerCase()) ||
//         lead.phone?.includes(searchText);

//       return destinationMatch && statusMatch && searchMatch;
//     });
//   }, [leads, searchText, selectedStatus, employee]);

//   // ===============================================
//   // Sort leads
//   // ===============================================
//   const sortedLeads = useMemo(() => {
//     if (!sortConfig.key) return filteredLeads;

//     return [...filteredLeads].sort((a, b) => {
//       let aValue = a[sortConfig.key];
//       let bValue = b[sortConfig.key];

//       if (sortConfig.key === "value") {
//         aValue = parseFloat(aValue?.replace(/[$,]/g, "") || 0);
//         bValue = parseFloat(bValue?.replace(/[$,]/g, "") || 0);
//       }
//       if (sortConfig.key === "lastContact" || sortConfig.key === "createdAt") {
//         aValue = new Date(aValue);
//         bValue = new Date(bValue);
//       }
//       if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [filteredLeads, sortConfig]);

//   // ===============================================
//   // Pagination
//   // ===============================================
//   const paginatedLeads = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return sortedLeads.slice(startIndex, startIndex + itemsPerPage);
//   }, [sortedLeads, currentPage, itemsPerPage]);

//   const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);

//   // ===============================================
//   // Handlers
//   // ===============================================
//   const handleSort = useCallback((key) => {
//     setSortConfig((current) => ({
//       key,
//       direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
//     }));
//   }, []);

//   const handleSelectLead = useCallback((leadId) => {
//     setSelectedLeads((current) =>
//       current.includes(leadId) ? current.filter((id) => id !== leadId) : [...current, leadId]
//     );
//   }, []);

//   const handleSelectAll = useCallback(() => {
//     setSelectedLeads((current) =>
//       current.length === paginatedLeads.length ? [] : paginatedLeads.map((lead) => lead._id)
//     );
//   }, [paginatedLeads]);

//   const handleView = useCallback((lead) => {
//     setCurrentLead(lead);
//     setIsViewModalOpen(true);
//   }, []);

//   const handleEdit = useCallback((lead) => {
//     setCurrentLead(lead);
//     setIsEditModalOpen(true);
//   }, []);

//   const handleDelete = useCallback(async (lead) => {
//     if (!window.confirm(`Delete lead ${lead.name}?`)) return;
//     try {
//       const response = await fetch(`http://localhost:4000/leads/${lead._id}`, { method: "DELETE" });
//       const result = await response.json();
//       if (result.success) {
//         setLeads((prev) => prev.filter((l) => l._id !== lead._id));
//       }
//     } catch (error) {
//       console.error("Delete failed:", error);
//     }
//   }, []);

//   const handleUpdateLead = async (updatedLead) => {
//     try {
//       const response = await fetch(`http://localhost:4000/leads/${updatedLead._id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedLead),
//       });
//       const result = await response.json();
//       if (result.success) {
//         setLeads((prev) => prev.map((lead) => (lead._id === updatedLead._id ? { ...lead, ...updatedLead } : lead)));
//         setIsEditModalOpen(false);
//       }
//     } catch (error) {
//       console.error("Error updating lead:", error);
//     }
//   };

//   // ===============================================
//   // Modals (Edit and View)
//   // ===============================================
//  const EditModal = ({ lead, onClose, onSave }) => {
//   const [formData, setFormData] = useState({ ...lead });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   if (!lead) return null;

//   const textFields = [
//     "name",
//     "email",
//     "phone",
//     "whatsAppNo",
//     "company",
//     "value",
//     "departureCity",
//     "destination",
//     "noOfDays",
//     "noOfPerson",
//     "noOfChild",
//     "childAge",
//     "placesToCover",
//     "groupNumber"
//   ];

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
//       <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
//         <h2 className="mb-4 text-lg font-semibold text-center">Edit Lead</h2>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {/* Optional Group Number (Edit Only) */}
//           <div className="flex flex-col sm:col-span-2">
//   <label className="mb-1 text-sm font-medium">Group Number </label>
//   <input
//     type="text"
//     name="groupNumber"
//     value={formData.groupNumber || ""}
//     onChange={(e) => {
//       const value = e.target.value;
//       // Allow only numeric and max 4 characters
//       if (/^\d{0,4}$/.test(value)) {
//         setFormData((prev) => ({ ...prev, groupNumber: value }));
//       }
//     }}
//     placeholder="Enter Group Number"
//     className="w-full rounded border px-3 py-2"
//     maxLength={4} // Optional, ensures user can't type more than 4
//   />
// </div>

//           {/* Text Inputs */}
//           {textFields.map((field) => (
//             <div key={field} className="flex flex-col">
//               <label className="mb-1 text-sm font-medium">
//                 {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
//               </label>
//               <input
//                 name={field}
//                 value={formData[field] || ""}
//                 onChange={handleChange}
//                 placeholder={field
//                   .replace(/([A-Z])/g, " $1")
//                   .replace(/^./, (str) => str.toUpperCase())}
//                 className="w-full rounded border px-3 py-2"
//               />
//             </div>
//           ))}

//           {/* Dropdowns */}
//           <div className="flex flex-col">
//             <label className="mb-1 text-sm font-medium">Lead Status</label>
//             <select
//               name="leadStatus"
//               value={formData.leadStatus || "Cold"}
//               onChange={handleChange}
//               className="w-full rounded border px-3 py-2"
//             >
//               <option value="Hot">Hot</option>
//               <option value="Warm">Warm</option>
//               <option value="Cold">Cold</option>
//             </select>
//           </div>

//           <div className="flex flex-col">
//             <label className="mb-1 text-sm font-medium">Lead Source</label>
//             <select
//               name="leadSource"
//               value={formData.leadSource || ""}
//               onChange={handleChange}
//               className="w-full rounded border px-3 py-2"
//             >
//               <option value="">Select Source</option>
//               <option value="Referral">Referral</option>
//               <option value="Website">Website</option>
//               <option value="Social Media">Social Media</option>
//               <option value="Advertisement">Advertisement</option>
//             </select>
//           </div>

//           <div className="flex flex-col">
//             <label className="mb-1 text-sm font-medium">Lead Type</label>
//             <select
//               name="leadType"
//               value={formData.leadType || ""}
//               onChange={handleChange}
//               className="w-full rounded border px-3 py-2"
//             >
//               <option value="">Select Type</option>
//               <option value="Individual">Individual</option>
//               <option value="Corporate">Corporate</option>
//             </select>
//           </div>

//           {/* Date */}
//           <div className="flex flex-col">
//             <label className="mb-1 text-sm font-medium">Expected Travel Date</label>
//             <input
//               type="date"
//               name="expectedTravelDate"
//               value={formData.expectedTravelDate?.split("T")[0] || ""}
//               onChange={handleChange}
//               className="w-full rounded border px-3 py-2"
//             />
//           </div>

//           {/* Notes */}
//           <div className="flex flex-col sm:col-span-2">
//             <label className="mb-1 text-sm font-medium">Notes</label>
//             <textarea
//               name="notes"
//               value={formData.notes || ""}
//               onChange={handleChange}
//               placeholder="Notes"
//               className="w-full rounded border px-3 py-2"
//             />
//           </div>

//           {/* Buttons */}
//           <div className="sm:col-span-2 mt-4 flex justify-end gap-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="rounded bg-gray-200 px-4 py-2"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="rounded bg-blue-500 px-4 py-2 text-white"
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // export default EditModal;

//   const ViewModal = ({ lead, onClose }) => {
//     if (!lead) return null;
//     const formatDate = (date) => new Date(date).toLocaleDateString();
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
//         <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
//           <h2 className="mb-4 text-lg font-semibold text-center text-gray-800">Lead Details</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-800">
//             <p><strong>Name:</strong> {lead.name}</p>
//             <p><strong>Email:</strong> {lead.email}</p>
//             <p><strong>Phone:</strong> {lead.phone}</p>
//             <p><strong>Destination:</strong> {lead.destination}</p>
//             <p><strong>Created At:</strong> {formatDate(lead.createdAt)}</p>
//           </div>
//           <div className="mt-6 flex justify-center">
//             <button onClick={onClose} className="rounded bg-red-500 px-5 py-2 text-white hover:bg-red-600 transition">Close</button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const SortableHeader = ({ column, children }) => (
//     <th
//       className="cursor-pointer px-3 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 sm:px-6"
//       onClick={() => handleSort(column)}
//     >
//       <div className="flex items-center gap-2">
//         <span>{children}</span>
//         <ArrowUpDown className="h-4 w-4" />
//       </div>
//     </th>
//   );

//   if (filteredLeads.length === 0) {
//     return (
//       <div className="py-12 text-center">
//         <h3 className="mb-2 text-lg font-medium text-gray-900">No leads found</h3>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-full overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-3 py-4 sm:px-6">
//                 <input
//                   type="checkbox"
//                   checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
//                   onChange={handleSelectAll}
//                   className="h-4 w-4 rounded border-gray-300 text-indigo-600"
//                 />
//               </th>
//               <SortableHeader column="name">Name</SortableHeader>
//               <SortableHeader column="email">Email</SortableHeader>
//               <SortableHeader column="phone">Phone</SortableHeader>
//               <SortableHeader column="destination">Destination</SortableHeader>
//               <SortableHeader column="createdAt">Created At</SortableHeader>
//               <th className="px-3 py-4 text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">Actions</th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-200 bg-white">
//             {paginatedLeads.map((lead) => (
//               <tr key={lead._id} className={selectedLeads.includes(lead._id) ? "bg-gray-100" : ""}>
//                 <td className="px-3 py-4 sm:px-6">
//                   <input
//                     type="checkbox"
//                     checked={selectedLeads.includes(lead._id)}
//                     onChange={() => handleSelectLead(lead._id)}
//                     className="h-4 w-4 rounded border-gray-300 text-indigo-600"
//                   />
//                 </td>
//                 <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.name}</td>
//                 <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.email}</td>
//                 <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.phone}</td>
//                 <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.destination}</td>
//                 <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{new Date(lead.createdAt).toLocaleDateString()}</td>
//                 <td className="flex items-center gap-3 px-3 py-4 sm:px-6">
//                   <button onClick={() => handleView(lead)} className="text-blue-500 hover:text-blue-700"><Eye className="h-4 w-4" /></button>
//                   <button onClick={() => handleEdit(lead)} className="text-green-500 hover:text-green-700"><Edit2 className="h-4 w-4" /></button>
//                   <button onClick={() => handleDelete(lead)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         <div className="mt-4 flex justify-between">
//           <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50">Previous</button>
//           <span>Page {currentPage} of {totalPages}</span>
//           <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50">Next</button>
//         </div>
//       </div>

//       {isEditModalOpen && <EditModal lead={currentLead} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdateLead} />}
//       {isViewModalOpen && <ViewModal lead={currentLead} onClose={() => setIsViewModalOpen(false)} />}
//     </div>
//   );
// };

// export default LeadTable;

// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { Eye, Edit2, Trash2, ArrowUpDown } from "lucide-react";

// const LeadTable = ({ searchText = "", selectedStatus = "All Status", refreshTrigger }) => {
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//   const [selectedLeads, setSelectedLeads] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [leads, setLeads] = useState([]);
//   const [employee, setEmployee] = useState(null);

//   // Modal state
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [currentLead, setCurrentLead] = useState(null);

//   // ===============================================
//   // Fetch employee data
//   // ===============================================
//   const fetchEmployee = async () => {
//     try {
//       const employeeId = localStorage.getItem("userId");
//       if (!employeeId) return;

//       const response = await fetch(`http://localhost:4000/employee/${employeeId}`);
//       const result = await response.json();

//       if (result.success) {
//         setEmployee(result.employee);
//       }
//     } catch (error) {
//       console.error("Error fetching employee:", error);
//     }
//   };

//   // ===============================================
//   // Fetch leads data
//   // ===============================================
//   const fetchLeadData = async () => {
//     try {
//       const response = await fetch("http://localhost:4000/leads");
//       const result = await response.json();
//       if (result.success) {
//         setLeads(result.data || result);
//       } else {
//         setLeads([]);
//       }
//     } catch (error) {
//       console.error("Error fetching leads:", error);
//       setLeads([]);
//     }
//   };

//   useEffect(() => {
//     fetchEmployee();
//     fetchLeadData();
//   }, [refreshTrigger]);

//   // ===============================================
//   // Filter leads by employee destinations, status, search
//   // ===============================================
//   const filteredLeads = useMemo(() => {
//     if (!employee || !employee.destinations) return [];

//     const employeeDestNames = employee.destinations.map(d => d.destination);

//     return leads.filter((lead) => {
//       const leadDestName = typeof lead.destination === "string" ? lead.destination : lead.destination?.destination;

//       const destinationMatch = employeeDestNames.includes(leadDestName);
//       const statusMatch = selectedStatus === "All Status" || lead.leadStatus === selectedStatus;
//       const searchMatch =
//         !searchText ||
//         lead.name?.toLowerCase().includes(searchText.toLowerCase()) ||
//         lead.email?.toLowerCase().includes(searchText.toLowerCase()) ||
//         lead.company?.toLowerCase().includes(searchText.toLowerCase()) ||
//         lead.phone?.includes(searchText);

//       return destinationMatch && statusMatch && searchMatch;
//     });
//   }, [leads, searchText, selectedStatus, employee]);

//   // ===============================================
//   // Sort leads
//   // ===============================================
//   const sortedLeads = useMemo(() => {
//     if (!sortConfig.key) return filteredLeads;

//     return [...filteredLeads].sort((a, b) => {
//       let aValue = a[sortConfig.key];
//       let bValue = b[sortConfig.key];

//       if (sortConfig.key === "value") {
//         aValue = parseFloat(aValue?.replace(/[$,]/g, "") || 0);
//         bValue = parseFloat(bValue?.replace(/[$,]/g, "") || 0);
//       }
//       if (sortConfig.key === "lastContact" || sortConfig.key === "createdAt") {
//         aValue = new Date(aValue);
//         bValue = new Date(bValue);
//       }
//       if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [filteredLeads, sortConfig]);

//   // ===============================================
//   // Pagination
//   // ===============================================
//   const paginatedLeads = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return sortedLeads.slice(startIndex, startIndex + itemsPerPage);
//   }, [sortedLeads, currentPage, itemsPerPage]);

//   const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);

//   // ===============================================
//   // Handlers
//   // ===============================================
//   const handleSort = useCallback((key) => {
//     setSortConfig((current) => ({
//       key,
//       direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
//     }));
//   }, []);

//   const handleSelectLead = useCallback((leadId) => {
//     setSelectedLeads((current) =>
//       current.includes(leadId) ? current.filter((id) => id !== leadId) : [...current, leadId]
//     );
//   }, []);

//   const handleSelectAll = useCallback(() => {
//     setSelectedLeads((current) =>
//       current.length === paginatedLeads.length ? [] : paginatedLeads.map((lead) => lead._id)
//     );
//   }, [paginatedLeads]);

//   const handleView = useCallback((lead) => {
//     setCurrentLead(lead);
//     setIsViewModalOpen(true);
//   }, []);

//   const handleEdit = useCallback((lead) => {
//     setCurrentLead(lead);
//     setIsEditModalOpen(true);
//   }, []);

//   const handleDelete = useCallback(async (lead) => {
//     if (!window.confirm(`Delete lead ${lead.name}?`)) return;
//     try {
//       const response = await fetch(`http://localhost:4000/leads/${lead._id}`, { method: "DELETE" });
//       const result = await response.json();
//       if (result.success) {
//         setLeads((prev) => prev.filter((l) => l._id !== lead._id));
//       }
//     } catch (error) {
//       console.error("Delete failed:", error);
//     }
//   }, []);

//   const handleUpdateLead = async (updatedLead) => {
//     try {
//       const response = await fetch(`http://localhost:4000/leads/${updatedLead._id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedLead),
//       });
//       const result = await response.json();
//       if (result.success) {
//         setLeads((prev) => prev.map((lead) => (lead._id === updatedLead._id ? { ...lead, ...updatedLead } : lead)));
//         setIsEditModalOpen(false);
//       }
//     } catch (error) {
//       console.error("Error updating lead:", error);
//     }
//   };

//   // ===============================================
//   // Modals (Edit and View)
//   // ===============================================
//  const EditModal = ({ lead, onClose, onSave }) => {
//   const [formData, setFormData] = useState({ ...lead });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   if (!lead) return null;

//   const textFields = [
//     "name",
//     "email",
//     "phone",
//     "whatsAppNo",
//     "company",
//     "value",
//     "departureCity",
//     "destination",
//     "noOfDays",
//     "noOfPerson",
//     "noOfChild",
//     "childAge",
//     "placesToCover",
//     "groupNumber"
//   ];

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
//       <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
//         <h2 className="mb-4 text-lg font-semibold text-center">Edit Lead</h2>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {/* Optional Group Number (Edit Only) */}
//           <div className="flex flex-col sm:col-span-2">
//   <label className="mb-1 text-sm font-medium">Group Number </label>
//   <input
//     type="text"
//     name="groupNumber"
//     value={formData.groupNumber || ""}
//     onChange={(e) => {
//       const value = e.target.value;
//       // Allow only numeric and max 4 characters
//       if (/^\d{0,4}$/.test(value)) {
//         setFormData((prev) => ({ ...prev, groupNumber: value }));
//       }
//     }}
//     placeholder="Enter Group Number"
//     className="w-full rounded border px-3 py-2"
//     maxLength={4} // Optional, ensures user can't type more than 4
//   />
// </div>

//           {/* Text Inputs */}
//           {textFields.map((field) => (
//             <div key={field} className="flex flex-col">
//               <label className="mb-1 text-sm font-medium">
//                 {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
//               </label>
//               <input
//                 name={field}
//                 value={formData[field] || ""}
//                 onChange={handleChange}
//                 placeholder={field
//                   .replace(/([A-Z])/g, " $1")
//                   .replace(/^./, (str) => str.toUpperCase())}
//                 className="w-full rounded border px-3 py-2"
//               />
//             </div>
//           ))}

//           {/* Dropdowns */}
//           <div className="flex flex-col">
//             <label className="mb-1 text-sm font-medium">Lead Status</label>
//             <select
//               name="leadStatus"
//               value={formData.leadStatus || "Cold"}
//               onChange={handleChange}
//               className="w-full rounded border px-3 py-2"
//             >
//               <option value="Hot">Hot</option>
//               <option value="Warm">Warm</option>
//               <option value="Cold">Cold</option>
//             </select>
//           </div>

//           <div className="flex flex-col">
//             <label className="mb-1 text-sm font-medium">Lead Source</label>
//             <select
//               name="leadSource"
//               value={formData.leadSource || ""}
//               onChange={handleChange}
//               className="w-full rounded border px-3 py-2"
//             >
//               <option value="">Select Source</option>
//               <option value="Referral">Referral</option>
//               <option value="Website">Website</option>
//               <option value="Social Media">Social Media</option>
//               <option value="Advertisement">Advertisement</option>
//             </select>
//           </div>

//           <div className="flex flex-col">
//             <label className="mb-1 text-sm font-medium">Lead Type</label>
//             <select
//               name="leadType"
//               value={formData.leadType || ""}
//               onChange={handleChange}
//               className="w-full rounded border px-3 py-2"
//             >
//               <option value="">Select Type</option>
//               <option value="Individual">Individual</option>
//               <option value="Corporate">Corporate</option>
//             </select>
//           </div>

//           {/* Date */}
//           <div className="flex flex-col">
//             <label className="mb-1 text-sm font-medium">Expected Travel Date</label>
//             <input
//               type="date"
//               name="expectedTravelDate"
//               value={formData.expectedTravelDate?.split("T")[0] || ""}
//               onChange={handleChange}
//               className="w-full rounded border px-3 py-2"
//             />
//           </div>

//           {/* Notes */}
//           <div className="flex flex-col sm:col-span-2">
//             <label className="mb-1 text-sm font-medium">Notes</label>
//             <textarea
//               name="notes"
//               value={formData.notes || ""}
//               onChange={handleChange}
//               placeholder="Notes"
//               className="w-full rounded border px-3 py-2"
//             />
//           </div>

//           {/* Buttons */}
//           <div className="sm:col-span-2 mt-4 flex justify-end gap-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="rounded bg-gray-200 px-4 py-2"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="rounded bg-blue-500 px-4 py-2 text-white"
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // export default EditModal;

//   const ViewModal = ({ lead, onClose }) => {
//     if (!lead) return null;
//     const formatDate = (date) => new Date(date).toLocaleDateString();
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
//         <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
//           <h2 className="mb-4 text-lg font-semibold text-center text-gray-800">Lead Details</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-800">
//             <p><strong>Name:</strong> {lead.name}</p>
//             <p><strong>Email:</strong> {lead.email}</p>
//             <p><strong>Phone:</strong> {lead.phone}</p>
//             <p><strong>Destination:</strong> {lead.destination}</p>
//             <p><strong>Created At:</strong> {formatDate(lead.createdAt)}</p>
//           </div>
//           <div className="mt-6 flex justify-center">
//             <button onClick={onClose} className="rounded bg-red-500 px-5 py-2 text-white hover:bg-red-600 transition">Close</button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const SortableHeader = ({ column, children }) => (
//     <th
//       className="cursor-pointer px-3 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 sm:px-6"
//       onClick={() => handleSort(column)}
//     >
//       <div className="flex items-center gap-2">
//         <span>{children}</span>
//         <ArrowUpDown className="h-4 w-4" />
//       </div>
//     </th>
//   );

//   if (filteredLeads.length === 0) {
//     return (
//       <div className="py-12 text-center">
//         <h3 className="mb-2 text-lg font-medium text-gray-900">No leads found</h3>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-full overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-3 py-4 sm:px-6">
//                 <input
//                   type="checkbox"
//                   checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
//                   onChange={handleSelectAll}
//                   className="h-4 w-4 rounded border-gray-300 text-indigo-600"
//                 />
//               </th>
//               <SortableHeader column="name">Name</SortableHeader>
//               <SortableHeader column="email">Email</SortableHeader>
//               <SortableHeader column="phone">Phone</SortableHeader>
//               <SortableHeader column="destination">Destination</SortableHeader>
//               <SortableHeader column="createdAt">Created At</SortableHeader>
//               <th className="px-3 py-4 text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">Actions</th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-200 bg-white">
//             {paginatedLeads.map((lead) => (
//               <tr key={lead._id} className={selectedLeads.includes(lead._id) ? "bg-gray-100" : ""}>
//                 <td className="px-3 py-4 sm:px-6">
//                   <input
//                     type="checkbox"
//                     checked={selectedLeads.includes(lead._id)}
//                     onChange={() => handleSelectLead(lead._id)}
//                     className="h-4 w-4 rounded border-gray-300 text-indigo-600"
//                   />
//                 </td>
//                 <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.name}</td>
//                 <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.email}</td>
//                 <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.phone}</td>
//                 <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.destination}</td>
//                 <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{new Date(lead.createdAt).toLocaleDateString()}</td>
//                 <td className="flex items-center gap-3 px-3 py-4 sm:px-6">
//                   <button onClick={() => handleView(lead)} className="text-blue-500 hover:text-blue-700"><Eye className="h-4 w-4" /></button>
//                   <button onClick={() => handleEdit(lead)} className="text-green-500 hover:text-green-700"><Edit2 className="h-4 w-4" /></button>
//                   <button onClick={() => handleDelete(lead)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         <div className="mt-4 flex justify-between">
//           <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50">Previous</button>
//           <span>Page {currentPage} of {totalPages}</span>
//           <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50">Next</button>
//         </div>
//       </div>

//       {isEditModalOpen && <EditModal lead={currentLead} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdateLead} />}
//       {isViewModalOpen && <ViewModal lead={currentLead} onClose={() => setIsViewModalOpen(false)} />}
//     </div>
//   );
// };

// export default LeadTable;

// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { Eye, Edit2, Trash2, ArrowUpDown } from "lucide-react";

// const LeadTable = ({ searchText = "", selectedStatus = "All Status", refreshTrigger }) => {
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//   const [selectedLeads, setSelectedLeads] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [leads, setLeads] = useState([]);

//   // Modal state
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [currentLead, setCurrentLead] = useState(null);

//   // ===============================================
//   // Fetch leads data
//   // ===============================================
//   const fetchLeadData = async () => {
//     try {
//       const response = await fetch("http://localhost:4000/leads");
//       const result = await response.json();
//       if (result.success) {
//         setLeads(result.data || []);
//       } else {
//         setLeads([]);
//       }
//     } catch (error) {
//       console.error("Error fetching leads:", error);
//       setLeads([]);
//     }
//   };

//   useEffect(() => {
//     fetchLeadData();
//   }, [refreshTrigger]);

//   // ===============================================
//   // Filter leads by search and status
//   // ===============================================
//   const filteredLeads = useMemo(() => {
//     return leads.filter((lead) => {
//       const statusMatch = selectedStatus === "All Status" || lead.leadStatus === selectedStatus;

//       const searchMatch =
//         !searchText ||
//         lead.name?.toLowerCase().includes(searchText.toLowerCase()) ||
//         lead.email?.toLowerCase().includes(searchText.toLowerCase()) ||
//         lead.company?.toLowerCase().includes(searchText.toLowerCase()) ||
//         `${lead.phone}`.includes(searchText);

//       return statusMatch && searchMatch;
//     });
//   }, [leads, searchText, selectedStatus]);

//   // ===============================================
//   // Sort leads
//   // ===============================================
//   const sortedLeads = useMemo(() => {
//     if (!sortConfig.key) return filteredLeads;

//     return [...filteredLeads].sort((a, b) => {
//       let aValue = a[sortConfig.key];
//       let bValue = b[sortConfig.key];

//       if (sortConfig.key === "value") {
//         aValue = parseFloat(aValue?.replace(/[$,]/g, "") || 0);
//         bValue = parseFloat(bValue?.replace(/[$,]/g, "") || 0);
//       }

//       if (sortConfig.key === "lastContact" || sortConfig.key === "createdAt") {
//         aValue = new Date(aValue);
//         bValue = new Date(bValue);
//       }

//       if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [filteredLeads, sortConfig]);

//   // ===============================================
//   // Pagination
//   // ===============================================
//   const paginatedLeads = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return sortedLeads.slice(startIndex, startIndex + itemsPerPage);
//   }, [sortedLeads, currentPage, itemsPerPage]);

//   const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);

//   // ===============================================
//   // Handlers
//   // ===============================================
//   const handleSort = useCallback((key) => {
//     setSortConfig((current) => ({
//       key,
//       direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
//     }));
//   }, []);

//   const handleSelectLead = useCallback((leadId) => {
//     setSelectedLeads((current) =>
//       current.includes(leadId) ? current.filter((id) => id !== leadId) : [...current, leadId]
//     );
//   }, []);

//   const handleSelectAll = useCallback(() => {
//     setSelectedLeads((current) =>
//       current.length === paginatedLeads.length ? [] : paginatedLeads.map((lead) => lead._id)
//     );
//   }, [paginatedLeads]);

//   const handleView = useCallback((lead) => {
//     setCurrentLead(lead);
//     setIsViewModalOpen(true);
//   }, []);

//   const handleEdit = useCallback((lead) => {
//     setCurrentLead(lead);
//     setIsEditModalOpen(true);
//   }, []);

//   const handleDelete = useCallback(async (lead) => {
//     if (!window.confirm(`Delete lead ${lead.name || lead.phone}?`)) return;
//     try {
//       const response = await fetch(`http://localhost:4000/leads/${lead._id}`, { method: "DELETE" });
//       const result = await response.json();
//       if (result.success) {
//         setLeads((prev) => prev.filter((l) => l._id !== lead._id));
//       }
//     } catch (error) {
//       console.error("Delete failed:", error);
//     }
//   }, []);

//   const handleUpdateLead = async (updatedLead) => {
//     try {
//       const response = await fetch(`http://localhost:4000/leads/${updatedLead._id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedLead),
//       });
//       const result = await response.json();
//       if (result.success) {
//         setLeads((prev) => prev.map((lead) => (lead._id === updatedLead._id ? { ...lead, ...updatedLead } : lead)));
//         setIsEditModalOpen(false);
//       }
//     } catch (error) {
//       console.error("Error updating lead:", error);
//     }
//   };

//   // ===============================================
//   // Modals
//   // ===============================================
//   const EditModal = ({ lead, onClose, onSave }) => {
//     const [formData, setFormData] = useState({ ...lead });

//     const handleChange = (e) => {
//       const { name, value } = e.target;
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = (e) => {
//       e.preventDefault();
//       onSave(formData);
//     };

//     if (!lead) return null;

//     const textFields = [
//       "name", "email", "phone", "whatsAppNo", "company", "value",
//       "departureCity", "destination", "noOfDays", "noOfPerson",
//       "noOfChild", "childAge", "placesToCover", "groupNumber"
//     ];

//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
//         <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
//           <h2 className="mb-4 text-lg font-semibold text-center">Edit Lead</h2>
//           <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {textFields.map((field) => (
//               <div key={field} className="flex flex-col">
//                 <label className="mb-1 text-sm font-medium">
//                   {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
//                 </label>
//                 <input
//                   name={field}
//                   value={formData[field] || ""}
//                   onChange={handleChange}
//                   className="w-full rounded border px-3 py-2"
//                 />
//               </div>
//             ))}
//             <div className="flex flex-col">
//               <label className="mb-1 text-sm font-medium">Lead Status</label>
//               <select
//                 name="leadStatus"
//                 value={formData.leadStatus || "Cold"}
//                 onChange={handleChange}
//                 className="w-full rounded border px-3 py-2"
//               >
//                 <option value="Hot">Hot</option>
//                 <option value="Warm">Warm</option>
//                 <option value="Cold">Cold</option>
//               </select>
//             </div>
//             <div className="flex flex-col sm:col-span-2">
//               <label className="mb-1 text-sm font-medium">Notes</label>
//               <textarea
//                 name="notes"
//                 value={formData.notes || ""}
//                 onChange={handleChange}
//                 className="w-full rounded border px-3 py-2"
//               />
//             </div>
//             <div className="sm:col-span-2 mt-4 flex justify-end gap-2">
//               <button type="button" onClick={onClose} className="rounded bg-gray-200 px-4 py-2">Cancel</button>
//               <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white">Save</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };

//   const ViewModal = ({ lead, onClose }) => {
//     if (!lead) return null;
//     const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "");
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
//         <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
//           <h2 className="mb-4 text-lg font-semibold text-center text-gray-800">Lead Details</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-800">
//             <p><strong>Name:</strong> {lead.name || ""}</p>
//             <p><strong>Email:</strong> {lead.email || ""}</p>
//             <p><strong>Phone:</strong> {lead.phone ?? ""}</p>
//             <p><strong>WhatsApp No:</strong> {lead.whatsAppNo || ""}</p>
//             <p><strong>Company:</strong> {lead.company || ""}</p>
//             <p><strong>Lead Source:</strong> {lead.leadSource || ""}</p>
//             <p><strong>Lead Type:</strong> {lead.leadType || ""}</p>
//             <p><strong>Lead Status:</strong> {lead.leadStatus || ""}</p>
//             <p><strong>Departure City:</strong> {lead.departureCity || ""}</p>
//             <p><strong>Destination:</strong> {lead.destination || ""}</p>
//             <p><strong>Expected Travel:</strong> {formatDate(lead.expectedTravelDate)}</p>
//             <p><strong>No. of Days:</strong> {lead.noOfDays ?? ""}</p>
//             <p><strong>No. of Persons:</strong> {lead.noOfPerson ?? ""}</p>
//             <p><strong>No. of Children:</strong> {lead.noOfChild ?? ""}</p>
//             <p><strong>Group Number:</strong> {lead.groupNumber || ""}</p>
//             <p><strong>Child Age:</strong> {lead.childAge || ""}</p>
//             <p><strong>Places to Cover:</strong> {lead.placesToCover || ""}</p>
//             <p><strong>Value:</strong> {lead.value || ""}</p>
//             <p><strong>Last Contact:</strong> {formatDate(lead.lastContact)}</p>
//             <p><strong>Created At:</strong> {formatDate(lead.createdAt)}</p>
//             <p><strong>Updated At:</strong> {formatDate(lead.updatedAt)}</p>
//             <p className="sm:col-span-2"><strong>Notes:</strong> {lead.notes || ""}</p>
//           </div>
//           <div className="mt-6 flex justify-center">
//             <button onClick={onClose} className="rounded bg-red-500 px-5 py-2 text-white hover:bg-red-600 transition">Close</button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const SortableHeader = ({ column, children }) => (
//     <th
//       className="cursor-pointer px-3 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 sm:px-6"
//       onClick={() => handleSort(column)}
//     >
//       <div className="flex items-center gap-2">
//         <span>{children}</span>
//         <ArrowUpDown className="h-4 w-4" />
//       </div>
//     </th>
//   );

//   if (filteredLeads.length === 0) {
//     return (
//       <div className="py-12 text-center">
//         <h3 className="mb-2 text-lg font-medium text-gray-900">No leads found</h3>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-full overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-3 py-4 sm:px-6">
//                 <input
//                   type="checkbox"
//                   checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
//                   onChange={handleSelectAll}
//                   className="h-4 w-4 rounded border-gray-300 text-indigo-600"
//                 />
//               </th>
//               <SortableHeader column="name">Name</SortableHeader>
//               <SortableHeader column="email">Email</SortableHeader>
//               <SortableHeader column="phone">Phone</SortableHeader>
//               <SortableHeader column="destination">Destination</SortableHeader>
//               <SortableHeader column="createdAt">Created At</SortableHeader>
//               <th className="px-3 py-4 text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">Actions</th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-200 bg-white">
//             {paginatedLeads.map((lead) => (
//               <tr key={lead._id} className={selectedLeads.includes(lead._id) ? "bg-gray-100" : ""}>
//                 <td className="px-3 py-4 sm:px-6">
//                   <input
//                     type="checkbox"
//                     checked={selectedLeads.includes(lead._id)}
//                     onChange={() => handleSelectLead(lead._id)}
//                     className="h-4 w-4 rounded border-gray-300 text-indigo-600"
//                   />
//                 </td>
//                 <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.name}</td>
//                 <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.email}</td>
//                 <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.phone}</td>
//                 <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.destination}</td>
//                 <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{new Date(lead.createdAt).toLocaleDateString()}</td>
//                 <td className="flex items-center gap-3 px-3 py-4 sm:px-6">
//                   <button onClick={() => handleView(lead)} className="text-blue-500 hover:text-blue-700"><Eye className="h-4 w-4" /></button>
//                   <button onClick={() => handleEdit(lead)} className="text-green-500 hover:text-green-700"><Edit2 className="h-4 w-4" /></button>
//                   <button onClick={() => handleDelete(lead)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         <div className="mt-4 flex justify-between">
//           <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50">Previous</button>
//           <span>Page {currentPage} of {totalPages}</span>
//           <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50">Next</button>
//         </div>
//       </div>

//       {isEditModalOpen && <EditModal lead={currentLead} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdateLead} />}
//       {isViewModalOpen && <ViewModal lead={currentLead} onClose={() => setIsViewModalOpen(false)} />}
//     </div>
//   );
// };

// export default LeadTable;

// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { Eye, Edit2, Trash2, ArrowUpDown } from "lucide-react";

// const LeadTable = ({ searchText = "", selectedStatus = "All Status", refreshTrigger }) => {
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//   const [selectedLeads, setSelectedLeads] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [leads, setLeads] = useState([]);

//   // NEW STATES
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All Employees");

//   // Modal state
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [currentLead, setCurrentLead] = useState(null);

//   // ===============================================
//   // Fetch BOTH leads + employee leads
//   // ===============================================
//   const fetchLeadData = async () => {
//     try {
//       const [normalRes, empRes] = await Promise.all([
//         fetch("http://localhost:4000/leads"),
//         fetch("http://localhost:4000/employeelead/all")
//       ]);

//       const normalJson = await normalRes.json();
//       const empJson = await empRes.json();

//       const normalData = normalJson.success ? normalJson.data : [];
//       const employeeData = empJson.success ? empJson.leads : [];

//       // Create unique list of employees for filter
//       const empNames = employeeData
//         .map((el) => el.employee?.fullName)
//         .filter(Boolean);

//       setEmployeeList([...new Set(empNames)]);

//       // merge both datasets
//       const combined = [
//         ...normalData.map((l) => ({ ...l, type: "normal" })),
//         ...employeeData.map((l) => ({ ...l, type: "employee" }))
//       ];

//       // New leads ALWAYS on top
//       combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//       setLeads(combined);

//     } catch (error) {
//       console.error("Error fetching leads:", error);
//       setLeads([]);
//     }
//   };

//   useEffect(() => {
//     fetchLeadData();
//   }, [refreshTrigger]);

//   // ===============================================
//   // Filter leads by search + status + employee
//   // ===============================================
//   const filteredLeads = useMemo(() => {
//     return leads.filter((lead) => {
//       const statusMatch = selectedStatus === "All Status" || lead.leadStatus === selectedStatus;

//       const employeeMatch =
//         selectedEmployee === "All Employees" ||
//         lead.employee?.fullName === selectedEmployee;

//       const searchMatch =
//         !searchText ||
//         lead.name?.toLowerCase().includes(searchText.toLowerCase()) ||
//         lead.email?.toLowerCase().includes(searchText.toLowerCase()) ||
//         lead.company?.toLowerCase().includes(searchText.toLowerCase()) ||
//         `${lead.phone}`.includes(searchText);

//       return statusMatch && employeeMatch && searchMatch;
//     });
//   }, [leads, searchText, selectedStatus, selectedEmployee]);

//   // ===============================================
//   // Sort leads
//   // ===============================================
//   const sortedLeads = useMemo(() => {
//     if (!sortConfig.key) return filteredLeads;

//     return [...filteredLeads].sort((a, b) => {
//       let aValue = a[sortConfig.key];
//       let bValue = b[sortConfig.key];

//       if (sortConfig.key === "value") {
//         aValue = parseFloat(aValue?.replace(/[$,]/g, "") || 0);
//         bValue = parseFloat(bValue?.replace(/[$,]/g, "") || 0);
//       }

//       if (sortConfig.key === "lastContact" || sortConfig.key === "createdAt") {
//         aValue = new Date(aValue);
//         bValue = new Date(bValue);
//       }

//       if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [filteredLeads, sortConfig]);

//   // ===============================================
//   // Pagination
//   // ===============================================
//   const paginatedLeads = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return sortedLeads.slice(startIndex, startIndex + itemsPerPage);
//   }, [sortedLeads, currentPage, itemsPerPage]);

//   const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);

//   // ===============================================
//   // Handlers
//   // ===============================================
//   const handleSort = useCallback((key) => {
//     setSortConfig((current) => ({
//       key,
//       direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
//     }));
//   }, []);

//   const handleSelectLead = useCallback((leadId) => {
//     setSelectedLeads((current) =>
//       current.includes(leadId) ? current.filter((id) => id !== leadId) : [...current, leadId]
//     );
//   }, []);

//   const handleSelectAll = useCallback(() => {
//     setSelectedLeads((current) =>
//       current.length === paginatedLeads.length ? [] : paginatedLeads.map((lead) => lead._id)
//     );
//   }, [paginatedLeads]);

//   const handleView = useCallback((lead) => {
//     setCurrentLead(lead);
//     setIsViewModalOpen(true);
//   }, []);

//   const handleEdit = useCallback((lead) => {
//     setCurrentLead(lead);
//     setIsEditModalOpen(true);
//   }, []);

//   const handleDelete = useCallback(async (lead) => {
//     if (!window.confirm(`Delete lead ${lead.name || lead.phone}?`)) return;
//     try {
//       const response = await fetch(`http://localhost:4000/leads/${lead._id}`, { method: "DELETE" });
//       const result = await response.json();
//       if (result.success) {
//         setLeads((prev) => prev.filter((l) => l._id !== lead._id));
//       }
//     } catch (error) {
//       console.error("Delete failed:", error);
//     }
//   }, []);

//   const handleUpdateLead = async (updatedLead) => {
//     try {
//       const response = await fetch(`http://localhost:4000/leads/${updatedLead._id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedLead),
//       });
//       const result = await response.json();
//       if (result.success) {
//         setLeads((prev) => prev.map((lead) => (lead._id === updatedLead._id ? { ...lead, ...updatedLead } : lead)));
//         setIsEditModalOpen(false);
//       }
//     } catch (error) {
//       console.error("Error updating lead:", error);
//     }
//   };

//   // ===============================================
//   // EMPLOYEE FILTER DROPDOWN (KEPT SIMPLE, DOESN’T BREAK UI)
//   // ===============================================
//   const EmployeeFilter = () => (
//     <div className="mb-3">
//       <label className="text-sm font-medium mr-2">Filter by Employee:</label>
//       <select
//         value={selectedEmployee}
//         onChange={(e) => setSelectedEmployee(e.target.value)}
//         className="border px-3 py-2 rounded"
//       >
//         <option value="All Employees">All Employees</option>
//         {employeeList.map((emp, index) => (
//           <option key={index} value={emp}>{emp}</option>
//         ))}
//       </select>
//     </div>
//   );

//   // ===============================================
//   // Modals (UNCHANGED)
//   // ===============================================

//   const EditModal = ({ lead, onClose, onSave }) => {
//     const [formData, setFormData] = useState({ ...lead });

//     const handleChange = (e) => {
//       const { name, value } = e.target;
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = (e) => {
//       e.preventDefault();
//       onSave(formData);
//     };

//     if (!lead) return null;

//     const textFields = [
//       "name", "email", "phone", "whatsAppNo", "company", "value",
//       "departureCity", "destination", "noOfDays", "noOfPerson",
//       "noOfChild", "childAge", "placesToCover", "groupNumber"
//     ];

//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
//         <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
//           <h2 className="mb-4 text-lg font-semibold text-center">Edit Lead</h2>
//           <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {textFields.map((field) => (
//               <div key={field} className="flex flex-col">
//                 <label className="mb-1 text-sm font-medium">
//                   {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
//                 </label>
//                 <input
//                   name={field}
//                   value={formData[field] || ""}
//                   onChange={handleChange}
//                   className="w-full rounded border px-3 py-2"
//                 />
//               </div>
//             ))}
//             <div className="flex flex-col">
//               <label className="mb-1 text-sm font-medium">Lead Status</label>
//               <select
//                 name="leadStatus"
//                 value={formData.leadStatus || "Cold"}
//                 onChange={handleChange}
//                 className="w-full rounded border px-3 py-2"
//               >
//                 <option value="Hot">Hot</option>
//                 <option value="Warm">Warm</option>
//                 <option value="Cold">Cold</option>
//               </select>
//             </div>
//             <div className="flex flex-col sm:col-span-2">
//               <label className="mb-1 text-sm font-medium">Notes</label>
//               <textarea
//                 name="notes"
//                 value={formData.notes || ""}
//                 onChange={handleChange}
//                 className="w-full rounded border px-3 py-2"
//               />
//             </div>
//             <div className="sm:col-span-2 mt-4 flex justify-end gap-2">
//               <button type="button" onClick={onClose} className="rounded bg-gray-200 px-4 py-2">Cancel</button>
//               <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white">Save</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };

//  const ViewModal = ({ lead, onClose }) => {
//   if (!lead) return null;

//   const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "");

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
//       <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
//         <h2 className="mb-4 text-lg font-semibold text-center text-gray-800">Lead Details</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-800">
//           <p><strong>Name:</strong> {lead.name || ""}</p>
//           <p><strong>Email:</strong> {lead.email || ""}</p>
//           <p><strong>Phone:</strong> {lead.phone ?? ""}</p>
//           <p><strong>WhatsApp No:</strong> {lead.whatsAppNo || ""}</p>
//           <p><strong>Lead Source:</strong> {lead.leadSource || ""}</p>
//           <p><strong>Lead Type:</strong> {lead.leadType || ""}</p>
//           <p><strong>Lead Status:</strong> {lead.leadStatus || ""}</p>
//           <p><strong>Departure City:</strong> {lead.departureCity || ""}</p>
//           <p><strong>Destination:</strong> {lead.destination || ""}</p>
//           <p><strong>Expected Travel:</strong> {formatDate(lead.expectedTravelDate)}</p>
//           <p><strong>No. of Days:</strong> {lead.noOfDays ?? ""}</p>
//           <p><strong>No. of Persons:</strong> {lead.noOfPerson ?? ""}</p>
//           <p><strong>No. of Children:</strong> {lead.noOfChild ?? ""}</p>
//           <p><strong>Group Number:</strong> {lead.groupNumber || ""}</p>
//           <p>
//             <strong>Child Ages:</strong>{" "}
//             {lead.childAges && lead.childAges.length > 0
//               ? lead.childAges.join(", ")
//               : ""}
//           </p>
//           <p><strong>Places to Cover:</strong> {lead.placesToCover || ""}</p>
//           <p><strong>Last Contact:</strong> {formatDate(lead.lastContact)}</p>
//           <p><strong>Created At:</strong> {formatDate(lead.createdAt)}</p>
//           <p><strong>Updated At:</strong> {formatDate(lead.updatedAt)}</p>
//           <p className="sm:col-span-2"><strong>Notes:</strong> {lead.notes || ""}</p>
//         </div>

//         <div className="mt-6 flex justify-center">
//           <button onClick={onClose} className="rounded bg-red-500 px-5 py-2 text-white hover:bg-red-600 transition">
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // export default ViewModal;

//   const SortableHeader = ({ column, children }) => (
//     <th
//       className="cursor-pointer px-3 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 sm:px-6"
//       onClick={() => handleSort(column)}
//     >
//       <div className="flex items-center gap-2">
//         <span>{children}</span>
//         <ArrowUpDown className="h-4 w-4" />
//       </div>
//     </th>
//   );

//   if (filteredLeads.length === 0) {
//     return (
//       <div className="py-12 text-center">
//         <h3 className="mb-2 text-lg font-medium text-gray-900">No leads found</h3>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-full overflow-hidden">

//       {/* EMPLOYEE FILTER HERE */}
//       <EmployeeFilter />

//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-3 py-4 sm:px-6">
//                 <input
//                   type="checkbox"
//                   checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
//                   onChange={handleSelectAll}
//                   className="h-4 w-4 rounded border-gray-300 text-indigo-600"
//                 />
//               </th>

//               <SortableHeader column="name">Name</SortableHeader>
//               <SortableHeader column="email">Email</SortableHeader>
//               <SortableHeader column="phone">Phone</SortableHeader>
//               <SortableHeader column="destination">Destination</SortableHeader>
//               <SortableHeader column="leadSource">Source</SortableHeader>

//               {/* NEW COLUMN */}
//               <SortableHeader column="employee">Employee</SortableHeader>

//               <th className="px-3 py-4 text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
//                 Actions
//               </th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-200 bg-white">
//             {paginatedLeads.map((lead) => (
//               <tr key={lead._id} className={selectedLeads.includes(lead._id) ? "bg-gray-100" : ""}>
//                 <td className="px-3 py-4 sm:px-6">
//                   <input
//                     type="checkbox"
//                     checked={selectedLeads.includes(lead._id)}
//                     onChange={() => handleSelectLead(lead._id)}
//                     className="h-4 w-4 rounded border-gray-300 text-indigo-600"
//                   />
//                 </td>

//                 <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.name}</td>
//                 <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.email}</td>
//                 <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.phone}</td>
//                 <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.destination}</td>
//                 <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">{lead.leadSource}</td>

//                 {/* SHOW EMPLOYEE */}
//                 <td className="px-3 py-4 text-sm text-gray-900 sm:px-6">
//                   {lead.type === "employee" ? (lead.employee?.fullName || "—") : "—"}
//                 </td>

//                 <td className="flex items-center gap-3 px-3 py-4 sm:px-6">
//                   <button onClick={() => handleView(lead)} className="text-blue-500 hover:text-blue-700">
//                     <Eye className="h-4 w-4" />
//                   </button>
//                   <button onClick={() => handleEdit(lead)} className="text-green-500 hover:text-green-700">
//                     <Edit2 className="h-4 w-4" />
//                   </button>
//                   <button onClick={() => handleDelete(lead)} className="text-red-500 hover:text-red-700">
//                     <Trash2 className="h-4 w-4" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         <div className="mt-4 flex justify-between">
//           <button
//             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//             disabled={currentPage === 1}
//             className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50">
//             Previous
//           </button>

//           <span>Page {currentPage} of {totalPages}</span>

//           <button
//             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50">
//             Next
//           </button>
//         </div>
//       </div>

//       {isEditModalOpen && (
//         <EditModal lead={currentLead} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdateLead} />
//       )}
//       {isViewModalOpen && (
//         <ViewModal lead={currentLead} onClose={() => setIsViewModalOpen(false)} />
//       )}
//     </div>
//   );
// };

// export default LeadTable;

// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { Eye, Edit2, Trash2, ArrowUpDown, X } from "lucide-react";

// const LeadTable = ({ searchText = "", selectedStatus = "All Status", refreshTrigger }) => {
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//   const [selectedLeads, setSelectedLeads] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [leads, setLeads] = useState([]);

//   // New States for filtering employees
//   const [employeeList, setEmployeeList] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState("All Employees");

//   // Modal states
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [currentLead, setCurrentLead] = useState(null);

//   // Fetch both leads
//   const fetchLeadData = async () => {
//     try {
//       const [normalRes, empRes] = await Promise.all([
//         fetch("http://localhost:4000/leads"),
//         fetch("http://localhost:4000/employeelead/all")
//       ]);

//       const normalJson = await normalRes.json();
//       const empJson = await empRes.json();

//       const normalData = normalJson.success ? normalJson.data : [];
//       const employeeData = empJson.success ? empJson.leads : [];

//       const empNames = employeeData
//         .map((el) => el.employee?.fullName)
//         .filter(Boolean);

//       setEmployeeList([...new Set(empNames)]);

//       const combined = [
//         ...normalData.map((l) => ({ ...l, type: "normal" })),
//         ...employeeData.map((l) => ({ ...l, type: "employee" }))
//       ];

//       combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//       setLeads(combined);

//     } catch (error) {
//       console.error("Error fetching leads:", error);
//       setLeads([]);
//     }
//   };

//   useEffect(() => {
//     fetchLeadData();
//   }, [refreshTrigger]);

//   // Filtered leads
//   const filteredLeads = useMemo(() => {
//     return leads.filter((lead) => {
//       const statusMatch =
//         selectedStatus === "All Status" || lead.leadStatus === selectedStatus;

//       const employeeMatch =
//         selectedEmployee === "All Employees" ||
//         lead.employee?.fullName === selectedEmployee;

//       const searchMatch =
//         !searchText ||
//         lead.name?.toLowerCase().includes(searchText.toLowerCase()) ||
//         lead.email?.toLowerCase().includes(searchText.toLowerCase()) ||
//         lead.company?.toLowerCase().includes(searchText.toLowerCase()) ||
//         `${lead.phone}`.includes(searchText);

//       return statusMatch && employeeMatch && searchMatch;
//     });
//   }, [leads, searchText, selectedStatus, selectedEmployee]);

//   // Sorting
//   const sortedLeads = useMemo(() => {
//     if (!sortConfig.key) return filteredLeads;

//     return [...filteredLeads].sort((a, b) => {
//       let aValue = a[sortConfig.key];
//       let bValue = b[sortConfig.key];

//       if (sortConfig.key === "value") {
//         aValue = parseFloat(aValue?.replace(/[$,]/g, "") || 0);
//         bValue = parseFloat(bValue?.replace(/[$,]/g, "") || 0);
//       }

//       if (sortConfig.key === "lastContact" || sortConfig.key === "createdAt") {
//         aValue = new Date(aValue);
//         bValue = new Date(bValue);
//       }

//       if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [filteredLeads, sortConfig]);

//   // Pagination
//   const paginatedLeads = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return sortedLeads.slice(startIndex, startIndex + itemsPerPage);
//   }, [sortedLeads, currentPage, itemsPerPage]);

//   const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);

//   // ================================
//   // Handlers
//   // ================================
//   const handleSort = (key) => {
//     setSortConfig((current) => ({
//       key,
//       direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
//     }));
//   };

//   const handleSelectLead = (leadId) => {
//     setSelectedLeads((current) =>
//       current.includes(leadId)
//         ? current.filter((id) => id !== leadId)
//         : [...current, leadId]
//     );
//   };

//   const handleSelectAll = () => {
//     setSelectedLeads(
//       selectedLeads.length === paginatedLeads.length
//         ? []
//         : paginatedLeads.map((lead) => lead._id)
//     );
//   };

//   const handleView = (lead) => {
//     setCurrentLead(lead);
//     setIsViewModalOpen(true);
//   };

//   const handleEdit = (lead) => {
//     setCurrentLead(lead);
//     setIsEditModalOpen(true);
//   };

//   const handleDelete = async (lead) => {
//     if (!window.confirm(`Delete lead ${lead.name}?`)) return;
//     try {
//       await fetch(`http://localhost:4000/leads/${lead._id}`, { method: "DELETE" });
//       setLeads((prev) => prev.filter((l) => l._id !== lead._id));
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const handleUpdateLead = async (updatedLead) => {
//     try {
//       const response = await fetch(`http://localhost:4000/leads/${updatedLead._id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedLead),
//       });

//       const result = await response.json();
//       if (result.success) {
//         setLeads((prev) =>
//           prev.map((l) => (l._id === updatedLead._id ? updatedLead : l))
//         );
//         setIsEditModalOpen(false);
//       }
//     } catch (e) {}
//   };

//   // ================================================
//   // EMPLOYEE FILTER
//   // ================================================
//   const EmployeeFilter = () => (
//     <div className="mb-3">
//       <label className="mr-2 text-sm font-medium">Filter by Employee:</label>
//       <select
//         value={selectedEmployee}
//         onChange={(e) => setSelectedEmployee(e.target.value)}
//         className="border px-3 py-2 rounded"
//       >
//         <option value="All Employees">All Employees</option>
//         {employeeList.map((emp, i) => (
//           <option key={i} value={emp}>{emp}</option>
//         ))}
//       </select>
//     </div>
//   );

//   // ==================================================
//   // UPDATED EDIT MODAL (MATCHES ADD FORM)
//   // ==================================================
//   const EditModal = ({ lead, onClose, onSave }) => {
//     const [formData, setFormData] = useState({
//       ...lead,
//       placesToCoverArray: lead.placesToCover?.split(",").map((p) => p.trim()) || [],
//       childAges: lead.childAges || [],
//       customNoOfDays: "",
//     });

//     const [placeInput, setPlaceInput] = useState("");
//     const [childAgeInput, setChildAgeInput] = useState("");

//     const handleAddPlace = (e) => {
//       if (e.key === "Enter" && placeInput.trim()) {
//         setFormData((p) => ({
//           ...p,
//           placesToCoverArray: [...p.placesToCoverArray, placeInput.trim()],
//         }));
//         setPlaceInput("");
//       }
//     };

//     const handleRemovePlace = (idx) => {
//       setFormData((p) => ({
//         ...p,
//         placesToCoverArray: p.placesToCoverArray.filter((_, i) => i !== idx),
//       }));
//     };

//     const handleAddChildAge = (e) => {
//       if (e.key === "Enter" && childAgeInput.trim()) {
//         setFormData((p) => ({
//           ...p,
//           childAges: [...p.childAges, childAgeInput.trim()],
//         }));
//         setChildAgeInput("");
//       }
//     };

//     const handleRemoveChildAge = (idx) => {
//       setFormData((p) => ({
//         ...p,
//         childAges: p.childAges.filter((_, i) => i !== idx),
//       }));
//     };

//     const handleSubmit = (e) => {
//       e.preventDefault();
//       onSave({
//         ...formData,
//         placesToCover: formData.placesToCoverArray.join(", "),
//         noOfDays:
//           formData.noOfDays === "Others"
//             ? formData.customNoOfDays
//             : formData.noOfDays,
//       });
//     };

//     if (!lead) return null;

//     return (
//       <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//         <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//           <h2 className="text-lg font-semibold mb-4 text-center">Edit Lead</h2>

//           <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

//             {/* Simple text fields */}
//             {[
//               "name", "email", "phone", "whatsAppNo",
//               "departureCity", "destination",
//               "noOfPerson", "noOfChild", "groupNumber"
//             ].map((field) => (
//               <div key={field} className="flex flex-col">
//                 <label className="text-sm font-medium mb-1">
//                   {field.replace(/([A-Z])/g, " $1")}
//                 </label>
//                 <input
//                   className="border px-3 py-2 rounded"
//                   value={formData[field] || ""}
//                   name={field}
//                   onChange={(e) =>
//                     setFormData({ ...formData, [field]: e.target.value })
//                   }
//                 />
//               </div>
//             ))}

//             {/* No of Days Dropdown */}
//             <div className="flex flex-col">
//               <label className="text-sm font-medium mb-1">No. of Days</label>
//               <select
//                 className="border px-3 py-2 rounded"
//                 value={formData.noOfDays}
//                 onChange={(e) =>
//                   setFormData({ ...formData, noOfDays: e.target.value })
//                 }
//               >
//                 {[...Array(15)].map((_, i) => (
//                   <option key={i} value={`${i + 1}n/${i + 2}d`}>
//                     {i + 1}n / {i + 2}d
//                   </option>
//                 ))}
//                 <option value="Others">Others</option>
//               </select>
//             </div>

//             {/* Custom days */}
//             {formData.noOfDays === "Others" && (
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium mb-1">Custom Days</label>
//                 <input
//                   className="border px-3 py-2 rounded"
//                   value={formData.customNoOfDays}
//                   onChange={(e) =>
//                     setFormData({ ...formData, customNoOfDays: e.target.value })
//                   }
//                 />
//               </div>
//             )}

//             {/* Places to cover */}
//             <div className="sm:col-span-2">
//               <label className="text-sm font-medium mb-1">Places to Cover</label>

//               <input
//                 className="border px-3 py-2 rounded w-full"
//                 placeholder="Type & press Enter"
//                 value={placeInput}
//                 onChange={(e) => setPlaceInput(e.target.value)}
//                 onKeyDown={handleAddPlace}
//               />

//               <div className="flex flex-wrap gap-2 mt-2">
//                 {formData.placesToCoverArray.map((p, i) => (
//                   <span
//                     key={i}
//                     className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
//                   >
//                     {p}
//                     <X
//                       className="w-4 h-4 cursor-pointer"
//                       onClick={() => handleRemovePlace(i)}
//                     />
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {/* Child ages */}
//             <div className="sm:col-span-2">
//               <label className="text-sm font-medium mb-1">Child Ages</label>

//               <input
//                 className="border px-3 py-2 rounded w-full"
//                 placeholder="Enter age & press Enter"
//                 value={childAgeInput}
//                 onChange={(e) => setChildAgeInput(e.target.value)}
//                 onKeyDown={handleAddChildAge}
//               />

//               <div className="flex flex-wrap gap-2 mt-2">
//                 {formData.childAges.map((p, i) => (
//                   <span
//                     key={i}
//                     className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-2"
//                   >
//                     {p}
//                     <X
//                       className="w-4 h-4 cursor-pointer"
//                       onClick={() => handleRemoveChildAge(i)}
//                     />
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {/* Lead Status */}
//             <div className="flex flex-col">
//               <label className="text-sm font-medium mb-1">Lead Status</label>
//               <select
//                 className="border px-3 py-2 rounded"
//                 value={formData.leadStatus}
//                 onChange={(e) =>
//                   setFormData({ ...formData, leadStatus: e.target.value })
//                 }
//               >
//                 <option value="Hot">Hot</option>
//                 <option value="Warm">Warm</option>
//                 <option value="Cold">Cold</option>
//               </select>
//             </div>

//             {/* Notes */}
//             <div className="sm:col-span-2">
//               <label className="text-sm font-medium mb-1">Notes</label>
//               <textarea
//                 className="border px-3 py-2 rounded w-full"
//                 value={formData.notes}
//                 onChange={(e) =>
//                   setFormData({ ...formData, notes: e.target.value })
//                 }
//               />
//             </div>

//             <div className="sm:col-span-2 flex justify-end gap-3 mt-4">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-4 py-2 bg-gray-200 rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-500 text-white rounded"
//               >
//                 Save
//               </button>
//             </div>

//           </form>
//         </div>
//       </div>
//     );
//   };

//   // =========================================================
//   // VIEW MODAL (unchanged)
//   // =========================================================
//   const ViewModal = ({ lead, onClose }) => {
//     if (!lead) return null;
//     return (
//       <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
//         <div className="bg-white p-6 rounded-lg max-w-xl w-full">
//           <h2 className="text-lg font-bold mb-3">Lead Details</h2>
//           <pre>{JSON.stringify(lead, null, 2)}</pre>
//           <button
//             onClick={onClose}
//             className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   };

//   // ========================================================
//   // TABLE UI (unchanged exactly as requested)
//   // ========================================================

//   const SortableHeader = ({ column, children }) => (
//     <th
//       className="cursor-pointer px-3 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 sm:px-6"
//       onClick={() => handleSort(column)}
//     >
//       <div className="flex items-center gap-2">
//         {children}
//         <ArrowUpDown className="h-4 w-4" />
//       </div>
//     </th>
//   );

//   if (filteredLeads.length === 0) {
//     return (
//       <div className="py-12 text-center">
//         <h3 className="text-lg font-medium">No leads found</h3>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">

//       <EmployeeFilter />

//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-3 py-4">
//                 <input
//                   type="checkbox"
//                   checked={
//                     selectedLeads.length === paginatedLeads.length &&
//                     paginatedLeads.length > 0
//                   }
//                   onChange={handleSelectAll}
//                 />
//               </th>

//               <SortableHeader column="name">Name</SortableHeader>
//               <SortableHeader column="email">Email</SortableHeader>
//               <SortableHeader column="phone">Phone</SortableHeader>
//               <SortableHeader column="destination">Destination</SortableHeader>
//               <SortableHeader column="leadSource">Source</SortableHeader>
//               <SortableHeader column="employee">Employee</SortableHeader>

//               <th className="px-3 py-4 text-xs">Actions</th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-200 bg-white">
//             {paginatedLeads.map((lead) => (
//               <tr key={lead._id}>
//                 <td className="px-3 py-4">
//                   <input
//                     type="checkbox"
//                     checked={selectedLeads.includes(lead._id)}
//                     onChange={() => handleSelectLead(lead._id)}
//                   />
//                 </td>

//                 <td className="px-3 py-4">{lead.name}</td>
//                 <td className="px-3 py-4">{lead.email}</td>
//                 <td className="px-3 py-4">{lead.phone}</td>
//                 <td className="px-3 py-4">{lead.destination}</td>
//                 <td className="px-3 py-4">{lead.leadSource}</td>

//                 <td className="px-3 py-4">
//                   {lead.type === "employee" ? lead.employee?.fullName : "—"}
//                 </td>

//                 <td className="px-3 py-4 flex gap-3">
//                   <button className="text-blue-600" onClick={() => handleView(lead)}>
//                     <Eye size={16} />
//                   </button>
//                   <button className="text-green-600" onClick={() => handleEdit(lead)}>
//                     <Edit2 size={16} />
//                   </button>
//                   <button className="text-red-600" onClick={() => handleDelete(lead)}>
//                     <Trash2 size={16} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         <div className="mt-4 flex justify-between">
//           <button
//             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//             disabled={currentPage === 1}
//             className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
//           >
//             Previous
//           </button>

//           <span>Page {currentPage} of {totalPages}</span>

//           <button
//             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {isEditModalOpen && (
//         <EditModal
//           lead={currentLead}
//           onClose={() => setIsEditModalOpen(false)}
//           onSave={handleUpdateLead}
//         />
//       )}

//       {isViewModalOpen && (
//         <ViewModal
//           lead={currentLead}
//           onClose={() => setIsViewModalOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default LeadTable;





  import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
  import { Eye, Edit2, Trash2, ArrowUpDown, X, Loader } from "lucide-react";

  const LeadTable = ({ searchText = "", selectedStatus = "All Status", refreshTrigger }) => {
      const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
      const [selectedLeads, setSelectedLeads] = useState([]);
      const [currentPage, setCurrentPage] = useState(1);
      const [itemsPerPage] = useState(50); // Fetch larger chunks from API
      
      // Optimized lead state - store all pages' data with cache
      const [leads, setLeads] = useState([]);
      const [totalRecords, setTotalRecords] = useState(0);
      const [totalPages, setTotalPages] = useState(0);
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState(null);

      // Cache for API calls - avoid redundant requests
      const cacheRef = useRef({
          normal: {},
          employee: {}
      });
      const lastFetchRef = useRef({
          search: "",
          status: "",
          page: 1
      });

      // Employee list filter
      const [employeeList, setEmployeeList] = useState([]);
      const [selectedEmployee, setSelectedEmployee] = useState("All Employees");

      // Modal states
      const [isEditModalOpen, setIsEditModalOpen] = useState(false);
      const [isViewModalOpen, setIsViewModalOpen] = useState(false);
      const [currentLead, setCurrentLead] = useState(null);

      // ================================================
      // FETCH ALL EMPLOYEE NAMES FROM ENTIRE DATASET
      // ================================================
      const fetchAllEmployees = useCallback(async () => {
          try {
              // Fetch all employee leads to extract unique employee names
              const response = await fetch("http://localhost:4000/employeelead/all");
              const result = await response.json();
              
              console.log("Employee leads response:", result);
              
              if (result.success && result.leads && Array.isArray(result.leads)) {
                  // Extract unique employee names from all leads
                  const empNames = result.leads
                      .map((lead) => lead.employee?.fullName || lead.employee?.name)
                      .filter((name) => name && name.trim() !== "");
                  
                  const uniqueEmployees = [...new Set(empNames)];
                  const sortedEmployees = uniqueEmployees.sort();
                  
                  console.log("Extracted employees:", sortedEmployees);
                  setEmployeeList(sortedEmployees);
              } else {
                  console.warn("Unexpected response structure:", result);
              }
          } catch (error) {
              console.error("Error fetching all employees:", error);
          }
      }, []);

      // ================================================
      // OPTIMIZED FETCH - Uses pagination & caching
      // ================================================
      const fetchLeadData = useCallback(async (pageNum = 1) => {
          try {
              setIsLoading(true);
              setError(null);

              // Build query strings with filters
              const normalParams = new URLSearchParams({
                  page: pageNum,
                  limit: itemsPerPage,
                  ...(searchText && { search: searchText }),
                  ...(selectedStatus !== "All Status" && { status: selectedStatus })
              });

              const empParams = new URLSearchParams({
                  page: pageNum,
                  limit: itemsPerPage,
                  ...(searchText && { search: searchText }),
                  ...(selectedStatus !== "All Status" && { status: selectedStatus })
              });

              // Fetch both normal and employee leads in parallel
              const [normalRes, empRes] = await Promise.all([
                  fetch(`http://localhost:4000/leads?${normalParams.toString()}`),
                  fetch(`http://localhost:4000/employeelead/all?${empParams.toString()}`)
              ]);

              const normalJson = await normalRes.json();
              const empJson = await empRes.json();

              // Process normal leads
              const normalData = normalJson.success ? normalJson.data : [];
              const normalPagination = normalJson.pagination || {};

              // Process employee leads
              const empData = empJson.success ? empJson.leads : [];
              const empPagination = empJson.pagination || {};

              // Combine leads with type indicator
              const combinedLeads = [
                  ...normalData.map((l) => ({ ...l, type: "normal" })),
                  ...empData.map((l) => ({ ...l, type: "employee" }))
              ];

              // Sort by creation date
              combinedLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

              setLeads(combinedLeads);
              
              // Use total from API - add both normal and employee lead totals
              const normalTotal = normalPagination.totalRecords || 0;
              const empTotal = empPagination.totalRecords || 0;
              const totalFromApi = normalTotal + empTotal;
              
              setTotalRecords(totalFromApi);
              setTotalPages(Math.ceil(totalFromApi / itemsPerPage));

              lastFetchRef.current = {
                  search: searchText,
                  status: selectedStatus,
                  page: pageNum
              };
          } catch (error) {
              console.error("Error fetching leads:", error);
              setError(error.message);
              setLeads([]);
          } finally {
              setIsLoading(false);
          }
      }, [searchText, selectedStatus, itemsPerPage]);

      // Trigger fetch when search, status, or refresh changes
      useEffect(() => {
          setCurrentPage(1);
          fetchLeadData(1);
      }, [searchText, selectedStatus, refreshTrigger, fetchLeadData]);

      // Fetch all employees once on mount
      useEffect(() => {
          fetchAllEmployees();
      }, [fetchAllEmployees]);

      // Fetch new page when pagination changes
      useEffect(() => {
          if (currentPage !== lastFetchRef.current.page) {
              fetchLeadData(currentPage);
          }
      }, [currentPage, fetchLeadData]);

      // Filter leads by employee (client-side, after API provides data)
      const filteredLeads = useMemo(() => {
          return leads.filter((lead) => {
              const employeeMatch =
                  selectedEmployee === "All Employees" ||
                  (lead.type === "employee" && lead.employee?.fullName === selectedEmployee) ||
                  (lead.type === "normal" && selectedEmployee === "All Employees");
              return employeeMatch;
          });
      }, [leads, selectedEmployee]);

      // Sorting
      const sortedLeads = useMemo(() => {
          if (!sortConfig.key) return filteredLeads;

          return [...filteredLeads].sort((a, b) => {
              let aValue = a[sortConfig.key];
              let bValue = b[sortConfig.key];

              if (sortConfig.key === "value") {
                  aValue = parseFloat(aValue?.replace(/[$,]/g, "") || 0);
                  bValue = parseFloat(bValue?.replace(/[$,]/g, "") || 0);
              }

              if (sortConfig.key === "lastContact" || sortConfig.key === "createdAt") {
                  aValue = new Date(aValue);
                  bValue = new Date(bValue);
              }

              if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
              if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
              return 0;
          });
      }, [filteredLeads, sortConfig]);

      // Use API paginated data directly
      const paginatedLeads = sortedLeads;
      // Use the actual totalPages from API response, not calculated from current page data
      const displayTotalPages = totalPages || 1;

      // ================================
      // Handlers
      // ================================
      const handleSort = (key) => {
          setSortConfig((current) => ({
              key,
              direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
          }));
      };

      const handleSelectLead = (leadId) => {
          setSelectedLeads((current) => (current.includes(leadId) ? current.filter((id) => id !== leadId) : [...current, leadId]));
      };

      const handleSelectAll = () => {
          setSelectedLeads(selectedLeads.length === paginatedLeads.length ? [] : paginatedLeads.map((lead) => lead._id));
      };

      const handleView = (lead) => {
          setCurrentLead(lead);
          setIsViewModalOpen(true);
      };

      const handleEdit = (lead) => {
          setCurrentLead(lead);
          setIsEditModalOpen(true);
      };

      const handleDelete = async (lead) => {
          if (!window.confirm(`Delete lead ${lead.name}?`)) return;
          try {
              await fetch(`http://localhost:4000/leads/${lead._id}`, { method: "DELETE" });
              setLeads((prev) => prev.filter((l) => l._id !== lead._id));
          } catch (e) {
              console.log(e);
          }
      };

      const handleUpdateLead = async (updatedLead) => {
          try {
              const isEmployeeLead = updatedLead?.type === "employee" || currentLead?.type === "employee";
              const url = isEmployeeLead ? `http://localhost:4000/employeelead/${updatedLead._id}` : `http://localhost:4000/leads/${updatedLead._id}`;
              const method = isEmployeeLead ? "PUT" : "PATCH";

              const response = await fetch(url, {
                  method,
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(updatedLead),
              });

              const result = await response.json();
              if (result?.success) {
                  const next = result.data ?? updatedLead;
                  setLeads((prev) => prev.map((l) => (l._id === next._id ? { ...l, ...next } : l)));
                  setIsEditModalOpen(false);
              }
          } catch (e) {
              console.error("Update error:", e);
          }
      };

      // ================================================
      // EMPLOYEE FILTER
      // ================================================
      const EmployeeFilter = () => {
          console.log("EmployeeList in dropdown:", employeeList);
          return (
          <div className="mb-3">
              <label className="mr-2 text-sm font-medium">Filter by Employee:</label>
              <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="rounded border px-3 py-2"
              >
                  <option value="All Employees">All Employees</option>
                  {employeeList && employeeList.length > 0 ? (
                      employeeList.map((emp, i) => (
                          <option
                              key={i}
                              value={emp}
                          >
                              {emp}
                          </option>
                      ))
                  ) : (
                      <option disabled>No employees found</option>
                  )}
              </select>
          </div>
      );
      };

      // ==================================================
      // EDIT MODAL (unchanged)
      // ==================================================
      // *** keeping your full edit modal exactly as you posted ***
      const EditModal = ({ lead, onClose, onSave }) => {
          const [formData, setFormData] = useState({
              ...lead,
              placesToCoverArray: lead.placesToCover?.split(",").map((p) => p.trim()) || [],
              childAges: lead.childAges || [],
              customNoOfDays: "",
          });

          const [placeInput, setPlaceInput] = useState("");
          const [childAgeInput, setChildAgeInput] = useState("");

          const handleAddPlace = (e) => {
              if (e.key === "Enter" && placeInput.trim()) {
                  setFormData((p) => ({
                      ...p,
                      placesToCoverArray: [...p.placesToCoverArray, placeInput.trim()],
                  }));
                  setPlaceInput("");
              }
          };

          const handleRemovePlace = (idx) => {
              setFormData((p) => ({
                  ...p,
                  placesToCoverArray: p.placesToCoverArray.filter((_, i) => i !== idx),
              }));
          };

          const handleAddChildAge = (e) => {
              if (e.key === "Enter" && childAgeInput.trim()) {
                  setFormData((p) => ({
                      ...p,
                      childAges: [...p.childAges, childAgeInput.trim()],
                  }));
                  setChildAgeInput("");
              }
          };

          const handleRemoveChildAge = (idx) => {
              setFormData((p) => ({
                  ...p,
                  childAges: p.childAges.filter((_, i) => i !== idx),
              }));
          };

          const handleSubmit = (e) => {
              e.preventDefault();
              const isEmployeeLead = lead?.type === "employee";

              const normalized = { ...formData };

              normalized.placesToCover = formData.placesToCoverArray.join(", ");

              if (formData.expectedTravelDate) {
                  const dt = new Date(formData.expectedTravelDate);
                  normalized.expectedTravelDate = Number.isNaN(dt.getTime()) ? undefined : dt;
              }

              const toNum = (v) => (v === "" || v === null || v === undefined ? undefined : Number(v));
              normalized.noOfPerson = toNum(formData.noOfPerson);
              normalized.noOfChild = toNum(formData.noOfChild);

              const ages = Array.isArray(formData.childAges) ? formData.childAges.map((a) => Number(a)).filter((n) => !Number.isNaN(n)) : [];
              normalized.childAges = ages;

              if (isEmployeeLead) {
                  normalized.noOfDays = formData.noOfDays === "Others" ? formData.customNoOfDays : formData.noOfDays;
              } else {
                  const nd = formData.noOfDays === "Others" ? formData.customNoOfDays : formData.noOfDays;
                  normalized.noOfDays = nd ? Number(nd) : undefined;
              }

              onSave(normalized);
          };

          if (!lead) return null;

          const leadSources = [
              "Cold Call",
              "Website",
              "Referral",
              "LinkedIn",
              "Trade Show",
              "Email Campaign",
              "Social Media",
              "Event",
              "Organic Search",
              "Paid Ads",
          ];
          const leadTypes = ["International", "Domestic"];
          const tripTypes = ["Solo", "Group", "Family", "Couple", "Honeymoon"];
          const leadStatuses = ["Hot", "Warm", "Cold", "Converted", "Lost"];
          const tripDurations = [
              "1n/2d",
              "2n/3d",
              "3n/4d",
              "4n/5d",
              "5n/6d",
              "6n/7d",
              "7n/8d",
              "8n/9d",
              "9n/10d",
              "10n/11d",
              "11n/12d",
              "12n/13d",
              "13n/14d",
              "14n/15d",
              "Others",
          ];

          const toDateInputValue = (d) => {
              try {
                  const dt = d ? new Date(d) : null;
                  if (!dt || Number.isNaN(dt.getTime())) return "";
                  const y = dt.getFullYear();
                  const m = String(dt.getMonth() + 1).padStart(2, "0");
                  const day = String(dt.getDate()).padStart(2, "0");
                  return `${y}-${m}-${day}`;
              } catch {
                  return "";
              }
          };

          return (
              <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                  onClick={onClose}
              >
                  <div
                      className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-lg"
                      onClick={(e) => e.stopPropagation()}
                  >
                      <div className="flex items-center justify-between border-b p-4">
                          <h2 className="text-lg font-bold text-gray-900">Edit Lead</h2>
                          <button
                              onClick={onClose}
                              className="font-bold text-gray-500 hover:text-gray-900"
                          >
                              ×
                          </button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4">
                          <form
                              onSubmit={handleSubmit}
                              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                          >
                              {[
                                  { key: "name", type: "text" },
                                  { key: "email", type: "email" },
                                  { key: "phone", type: "text" },
                                  { key: "whatsAppNo", type: "text" },
                                  { key: "company", type: "text" },
                                  { key: "value", type: "text" },
                                  { key: "departureCity", type: "text" },
                                  { key: "destination", type: "text" },
                              ].map(({ key, type }) => (
                                  <div
                                      key={key}
                                      className="h-[4.5rem]"
                                  >
                                      <label className="mb-0.5 block text-xs font-medium text-gray-700">{key.replace(/([A-Z])/g, " $1")}</label>
                                      <input
                                          type={type}
                                          name={key}
                                          value={formData[key] || ""}
                                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                          className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                      />
                                  </div>
                              ))}

                              <div className="h-[4.5rem]">
                                  <label className="mb-0.5 block text-xs font-medium text-gray-700">Expected Travel Date</label>
                                  <input
                                      type="date"
                                      name="expectedTravelDate"
                                      value={toDateInputValue(formData.expectedTravelDate)}
                                      onChange={(e) => setFormData({ ...formData, expectedTravelDate: e.target.value })}
                                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  />
                              </div>

                              <div className="h-[4.5rem]">
                                  <label className="mb-0.5 block text-xs font-medium text-gray-700">No. of Days</label>
                                  <select
                                      name="noOfDays"
                                      value={formData.noOfDays || ""}
                                      onChange={(e) => setFormData({ ...formData, noOfDays: e.target.value })}
                                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  >
                                      <option value="">Select No. of Days</option>
                                      {tripDurations.map((opt) => (
                                          <option
                                              key={opt}
                                              value={opt}
                                          >
                                              {opt}
                                          </option>
                                      ))}
                                  </select>
                              </div>

                              {formData.noOfDays === "Others" && (
                                  <div className="h-[4.5rem]">
                                      <label className="mb-0.5 block text-xs font-medium text-gray-700">Custom Days</label>
                                      <input
                                          name="customNoOfDays"
                                          value={formData.customNoOfDays || ""}
                                          onChange={(e) => setFormData({ ...formData, customNoOfDays: e.target.value })}
                                          className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                      />
                                  </div>
                              )}

                              <div className="sm:col-span-2">
                                  <label className="mb-0.5 block text-xs font-medium text-gray-700">Places to Cover</label>
                                  <input
                                      value={placeInput}
                                      onChange={(e) => setPlaceInput(e.target.value)}
                                      onKeyDown={handleAddPlace}
                                      placeholder="Type and press Enter"
                                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  />
                                  <div className="mt-2 flex flex-wrap gap-2">
                                      {formData.placesToCoverArray.map((p, i) => (
                                          <span
                                              key={`${p}-${i}`}
                                              className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700"
                                          >
                                              {p}
                                              <button
                                                  type="button"
                                                  onClick={() => handleRemovePlace(i)}
                                              >
                                                  x
                                              </button>
                                          </span>
                                      ))}
                                  </div>
                              </div>

                              {[{ key: "noOfPerson" }, { key: "noOfChild" }].map(({ key }) => (
                                  <div
                                      key={key}
                                      className="h-[4.5rem]"
                                  >
                                      <label className="mb-0.5 block text-xs font-medium text-gray-700">{key.replace(/([A-Z])/g, " $1")}</label>
                                      <input
                                          name={key}
                                          value={formData[key] || ""}
                                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                          className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                      />
                                  </div>
                              ))}

                              <div className="sm:col-span-2">
                                  <label className="mb-0.5 block text-xs font-medium text-gray-700">Child Ages</label>
                                  <input
                                      value={childAgeInput}
                                      onChange={(e) => setChildAgeInput(e.target.value)}
                                      onKeyDown={handleAddChildAge}
                                      placeholder="Enter age and press Enter"
                                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  />
                                  <div className="mt-2 flex flex-wrap gap-2">
                                      {formData.childAges.map((age, i) => (
                                          <span
                                              key={`${age}-${i}`}
                                              className="flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-sm text-green-700"
                                          >
                                              {age}
                                              <button
                                                  type="button"
                                                  onClick={() => handleRemoveChildAge(i)}
                                              >
                                                  x
                                              </button>
                                          </span>
                                      ))}
                                  </div>
                              </div>

                              <div className="h-[4.5rem]">
                                  <label className="mb-0.5 block text-xs font-medium text-gray-700">Lead Source</label>
                                  <select
                                      name="leadSource"
                                      value={formData.leadSource || ""}
                                      onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  >
                                      <option value="">Select Lead Source</option>
                                      {leadSources.map((opt) => (
                                          <option
                                              key={opt}
                                              value={opt}
                                          >
                                              {opt}
                                          </option>
                                      ))}
                                  </select>
                              </div>

                              <div className="h-[4.5rem]">
                                  <label className="mb-0.5 block text-xs font-medium text-gray-700">Lead Type</label>
                                  <select
                                      name="leadType"
                                      value={formData.leadType || ""}
                                      onChange={(e) => setFormData({ ...formData, leadType: e.target.value })}
                                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  >
                                      <option value="">Select Lead Type</option>
                                      {leadTypes.map((opt) => (
                                          <option
                                              key={opt}
                                              value={opt}
                                          >
                                              {opt}
                                          </option>
                                      ))}
                                  </select>
                              </div>

                              <div className="h-[4.5rem]">
                                  <label className="mb-0.5 block text-xs font-medium text-gray-700">Trip Type</label>
                                  <select
                                      name="tripType"
                                      value={formData.tripType || ""}
                                      onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
                                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  >
                                      <option value="">Select Trip Type</option>
                                      {tripTypes.map((opt) => (
                                          <option
                                              key={opt}
                                              value={opt}
                                          >
                                              {opt}
                                          </option>
                                      ))}
                                  </select>
                              </div>

                              <div className="h-[4.5rem]">
                                  <label className="mb-0.5 block text-xs font-medium text-gray-700">Lead Status</label>
                                  <select
                                      name="leadStatus"
                                      value={formData.leadStatus || "Cold"}
                                      onChange={(e) => setFormData({ ...formData, leadStatus: e.target.value })}
                                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  >
                                      {leadStatuses.map((opt) => (
                                          <option
                                              key={opt}
                                              value={opt}
                                          >
                                              {opt}
                                          </option>
                                      ))}
                                  </select>
                              </div>

                              <div className="h-[4.5rem]">
                                  <label className="mb-0.5 block text-xs font-medium text-gray-700">Group Number</label>
                                  <input
                                      name="groupNumber"
                                      value={formData.groupNumber || ""}
                                      onChange={(e) => setFormData({ ...formData, groupNumber: e.target.value })}
                                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  />
                              </div>

                              <div className="sm:col-span-2">
                                  <label className="mb-0.5 block text-xs font-medium text-gray-700">Notes</label>
                                  <textarea
                                      name="notes"
                                      value={formData.notes || ""}
                                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  />
                              </div>

                              <div className="mt-2 flex justify-end gap-3 sm:col-span-2">
                                  <button
                                      type="button"
                                      onClick={onClose}
                                      className="rounded bg-gray-200 px-4 py-2"
                                  >
                                      Cancel
                                  </button>
                                  <button
                                      type="submit"
                                      className="rounded bg-blue-600 px-4 py-2 text-white"
                                  >
                                      Save
                                  </button>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          );
      };

      // =========================================================
      // UPDATED VIEW MODAL (individual fields – no JSON)
      // =========================================================
      const ViewModal = ({ lead, onClose }) => {
          if (!lead) return null;

          const fields = [
              { label: "Name", value: lead.name },
              { label: "Email", value: lead.email },
              { label: "Phone", value: lead.phone },
              { label: "WhatsApp No", value: lead.whatsAppNo },
              { label: "Departure City", value: lead.departureCity },
              { label: "Destination", value: lead.destination },
              { label: "Expected Travel Date", value: lead.expectedTravelDate },
              { label: "No. of Days", value: lead.noOfDays },
              {
                  label: "Places to Cover",
                  value: Array.isArray(lead.placesToCover) ? lead.placesToCover.join(", ") : lead.placesToCover,
              },
              { label: "No. of Person", value: lead.noOfPerson },
              { label: "No. of Child", value: lead.noOfChild },
              {
                  label: "Child Ages",
                  value: Array.isArray(lead.childAges) ? lead.childAges.join(", ") : lead.childAges,
              },
              { label: "Lead Source", value: lead.leadSource },
              { label: "Lead Type", value: lead.leadType },
              { label: "Trip Type", value: lead.tripType },
              { label: "Lead Status", value: lead.leadStatus },
              { label: "Group Number", value: lead.groupNumber },
              { label: "Last Contact", value: lead.lastContact },
              { label: "Notes", value: lead.notes },
              { label: "Created At", value: lead.createdAt },
              { label: "Updated At", value: lead.updatedAt },
              { label: "Type", value: lead.type },
              { label: "Employee", value: lead.employee?.fullName || "—" },
          ];

          return (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
                      <h2 className="mb-4 text-center text-lg font-bold">Lead Details</h2>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {fields.map((field, index) => (
                              <div
                                  key={index}
                                  className="rounded border p-3"
                              >
                                  <p className="text-xs font-bold uppercase text-gray-500">{field.label}</p>
                                  <p className="mt-1 text-sm text-gray-800">{field.value || "—"}</p>
                              </div>
                          ))}
                      </div>

                      <button
                          onClick={onClose}
                          className="mt-6 w-full rounded bg-red-500 px-4 py-2 text-white"
                      >
                          Close
                      </button>
                  </div>
              </div>
          );
      };

      // ========================================================
      // TABLE UI (updated with loading states)
      // ========================================================

      const SortableHeader = ({ column, children }) => (
          <th
              className="cursor-pointer px-3 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 sm:px-6"
              onClick={() => handleSort(column)}
          >
              <div className="flex items-center gap-2">
                  {children}
                  <ArrowUpDown className="h-4 w-4" />
              </div>
          </th>
      );

      if (isLoading && leads.length === 0) {
          return (
              <div className="py-12 text-center">
                  <Loader className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-3" />
                  <h3 className="text-lg font-medium">Loading leads...</h3>
                  <p className="text-gray-500 text-sm mt-2">Fetching data from server</p>
              </div>
          );
      }

      if (error) {
          return (
              <div className="py-12 text-center">
                  <h3 className="text-lg font-medium text-red-600">Error loading leads</h3>
                  <p className="text-gray-500 text-sm mt-2">{error}</p>
              </div>
          );
      }

      if (filteredLeads.length === 0 && !isLoading) {
          return (
              <div className="py-12 text-center">
                  <h3 className="text-lg font-medium">No leads found</h3>
                  <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
              </div>
          );
      }

      return (
          <div className="w-full">
              <EmployeeFilter />

              {isLoading && (
                  <div className="mb-3 flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                      <Loader className="h-4 w-4 animate-spin" />
                      Loading leads...
                  </div>
              )}

              <div className="overflow-x-auto relative">
                  {isLoading && <div className="absolute inset-0 bg-white/30 z-10 rounded-lg" />}
                  <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                          <tr>
                              <th className="px-3 py-4">
                                  <input
                                      type="checkbox"
                                      checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
                                      onChange={handleSelectAll}
                                      disabled={isLoading}
                                  />
                              </th>

                              <SortableHeader column="name">Name</SortableHeader>
                              <SortableHeader column="email">Email</SortableHeader>
                              <SortableHeader column="phone">Phone</SortableHeader>
                              <SortableHeader column="groupNumber">Group No</SortableHeader>

                              <SortableHeader column="destination">Destination</SortableHeader>
                              <SortableHeader column="leadSource">Source</SortableHeader>
                              <SortableHeader column="employee">Employee</SortableHeader>

                              <th className="px-3 py-4 text-xs">Actions</th>
                          </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-200 bg-white">
                          {paginatedLeads.map((lead) => (
                              <tr key={lead._id}>
                                  <td className="px-3 py-4">
                                      <input
                                          type="checkbox"
                                          checked={selectedLeads.includes(lead._id)}
                                          onChange={() => handleSelectLead(lead._id)}
                                      />
                                  </td>

                                  <td className="px-3 py-4">{lead.name}</td>
                                  <td className="px-3 py-4">{lead.email}</td>
                                  <td className="px-3 py-4">{lead.phone}</td>
                                  <td className="px-3 py-4">{lead.groupNumber || "—"}</td>

                                  <td className="px-3 py-4">{lead.destination}</td>
                                  <td className="px-3 py-4">{lead.leadSource}</td>

                                  <td className="px-3 py-4">{lead.type === "employee" ? lead.employee?.fullName : "—"}</td>

                                  <td className="flex gap-3 px-3 py-4">
                                      <button
                                          className="text-blue-600"
                                          onClick={() => handleView(lead)}
                                      >
                                          <Eye size={16} />
                                      </button>
                                      <button
                                          className="text-green-600"
                                          onClick={() => handleEdit(lead)}
                                      >
                                          <Edit2 size={16} />
                                      </button>
                                      <button
                                          className="text-red-600"
                                          onClick={() => handleDelete(lead)}
                                      >
                                          <Trash2 size={16} />
                                      </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>

                  {/* Pagination */}
                  <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                      <button
                          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                          disabled={currentPage === 1 || isLoading}
                          className="rounded bg-blue-600 text-white px-4 py-2 disabled:bg-gray-300 transition"
                      >
                          ← Previous
                      </button>

                      <div className="text-sm text-gray-600 text-center">
                          <div>Page <strong>{currentPage}</strong> of <strong>{displayTotalPages}</strong></div>
                          <div className="text-xs mt-1">Total: <strong>{totalRecords}</strong> leads</div>
                      </div>

                      <button
                          onClick={() => setCurrentPage((p) => Math.min(p + 1, displayTotalPages))}
                          disabled={currentPage >= displayTotalPages || isLoading}
                          className="rounded bg-blue-600 text-white px-4 py-2 disabled:bg-gray-300 transition"
                      >
                          Next →
                      </button>
                  </div>
              </div>

              {isEditModalOpen && (
                  <EditModal
                      lead={currentLead}
                      onClose={() => setIsEditModalOpen(false)}
                      onSave={handleUpdateLead}
                  />
              )}

              {isViewModalOpen && (
                  <ViewModal
                      lead={currentLead}
                      onClose={() => setIsViewModalOpen(false)}
                  />
              )}
          </div>
      );
  };

  export default LeadTable;



// import React, { useState, useEffect, useMemo } from "react";
// import { Eye, Edit2, Trash2, ArrowUpDown } from "lucide-react";

// const LeadTable = ({ searchText = "", selectedStatus = "All Status", refreshTrigger }) => {
//     const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//     const [selectedLeads, setSelectedLeads] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(10);
//     const [leads, setLeads] = useState([]);

//     const [employeeList, setEmployeeList] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState("All Employees");

//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//     const [currentLead, setCurrentLead] = useState(null);

//     const fetchLeadData = async () => {
//         try {
//             const [normalRes, empRes] = await Promise.all([
//                 fetch("http://localhost:4000/leads"),
//                 fetch("http://localhost:4000/employeelead/all"),
//             ]);

//             const normalJson = await normalRes.json();
//             const empJson = await empRes.json();

//             const normalData = normalJson.success ? normalJson.data : [];
//             const employeeData = empJson.success ? empJson.leads : [];

//             const empNames = employeeData.map((el) => el.employee?.fullName).filter(Boolean);

//             setEmployeeList([...new Set(empNames)]);

//             const combined = [
//                 ...normalData.map((l) => ({ ...l, type: "normal" })),
//                 ...employeeData.map((l) => ({ ...l, type: "employee" })),
//             ];

//             combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//             setLeads(combined);
//         } catch (error) {
//             console.error("Error:", error);
//         }
//     };

//     useEffect(() => {
//         fetchLeadData();
//     }, [refreshTrigger]);

//     const filteredLeads = useMemo(() => {
//         return leads.filter((lead) => {
//             const statusMatch = selectedStatus === "All Status" || lead.leadStatus === selectedStatus;

//             const employeeMatch =
//                 selectedEmployee === "All Employees" || lead.employee?.fullName === selectedEmployee;

//             const searchMatch =
//                 !searchText ||
//                 lead.name?.toLowerCase().includes(searchText.toLowerCase()) ||
//                 lead.email?.toLowerCase().includes(searchText.toLowerCase()) ||
//                 lead.company?.toLowerCase().includes(searchText.toLowerCase()) ||
//                 `${lead.phone}`.includes(searchText);

//             return statusMatch && employeeMatch && searchMatch;
//         });
//     }, [leads, searchText, selectedStatus, selectedEmployee]);

//     const sortedLeads = useMemo(() => {
//         if (!sortConfig.key) return filteredLeads;

//         return [...filteredLeads].sort((a, b) => {
//             let aValue = a[sortConfig.key];
//             let bValue = b[sortConfig.key];

//             if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
//             if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
//             return 0;
//         });
//     }, [filteredLeads, sortConfig]);

//     const paginatedLeads = useMemo(() => {
//         const startIndex = (currentPage - 1) * itemsPerPage;
//         return sortedLeads.slice(startIndex, startIndex + itemsPerPage);
//     }, [sortedLeads, currentPage, itemsPerPage]);

//     const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);

//     const handleSort = (key) => {
//         setSortConfig((curr) => ({
//             key,
//             direction: curr.key === key && curr.direction === "asc" ? "desc" : "asc",
//         }));
//     };

//     const handleSelectLead = (leadId) => {
//         setSelectedLeads((prev) =>
//             prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
//         );
//     };

//     const handleSelectAll = () => {
//         setSelectedLeads(
//             selectedLeads.length === paginatedLeads.length ? [] : paginatedLeads.map((l) => l._id)
//         );
//     };

//     const handleView = (lead) => {
//         setCurrentLead(lead);
//         setIsViewModalOpen(true);
//     };

//     const handleEdit = (lead) => {
//         setCurrentLead(lead);
//         setIsEditModalOpen(true);
//     };

//     const handleDelete = async (lead) => {
//         if (!window.confirm(`Delete lead ${lead.name}?`)) return;
//         await fetch(`http://localhost:4000/leads/${lead._id}`, { method: "DELETE" });
//         setLeads((prev) => prev.filter((l) => l._id !== lead._id));
//     };

//     const EmployeeFilter = () => (
//         <div className="mb-3">
//             <label className="mr-2 text-sm font-medium">Filter by Employee:</label>
//             <select
//                 value={selectedEmployee}
//                 onChange={(e) => setSelectedEmployee(e.target.value)}
//                 className="rounded border px-3 py-2"
//             >
//                 <option value="All Employees">All Employees</option>
//                 {employeeList.map((emp, i) => (
//                     <option key={i} value={emp}>
//                         {emp}
//                     </option>
//                 ))}
//             </select>
//         </div>
//     );

//     const SortableHeader = ({ column, children }) => (
//         <th
//             className="cursor-pointer px-3 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
//             onClick={() => handleSort(column)}
//         >
//             <div className="flex items-center gap-2">
//                 {children}
//                 <ArrowUpDown size={14} />
//             </div>
//         </th>
//     );

//     return (
//         <div className="w-full">
//             <EmployeeFilter />

//             <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-3 py-4">
//                                 <input
//                                     type="checkbox"
//                                     checked={
//                                         selectedLeads.length === paginatedLeads.length &&
//                                         paginatedLeads.length > 0
//                                     }
//                                     onChange={handleSelectAll}
//                                 />
//                             </th>

//                             <SortableHeader column="name">Name</SortableHeader>
//                             <SortableHeader column="email">Email</SortableHeader>
//                             <SortableHeader column="phone">Phone</SortableHeader>

//                             {/* THIS WAS CORRECTED TO GROUP NUMBER */}
//                             <SortableHeader column="groupNumber">Group No</SortableHeader>

//                             <SortableHeader column="destination">Destination</SortableHeader>
//                             <SortableHeader column="leadSource">Source</SortableHeader>
//                             <SortableHeader column="employee">Employee</SortableHeader>

//                             <th className="px-3 py-4 text-xs">Actions</th>
//                         </tr>
//                     </thead>

//                     <tbody className="divide-y divide-gray-200 bg-white">
//                         {paginatedLeads.map((lead) => (
//                             <tr
//                                 key={lead._id}
//                                 className={
//                                     lead.leadStatus === "Hot"
//                                         ? "bg-red-100"
//                                         : lead.leadStatus === "Warm"
//                                         ? "bg-yellow-100"
//                                         : lead.leadStatus === "Cold"
//                                         ? "bg-blue-100"
//                                         : ""
//                                 }
//                             >
//                                 <td className="px-3 py-4">
//                                     <input
//                                         type="checkbox"
//                                         checked={selectedLeads.includes(lead._id)}
//                                         onChange={() => handleSelectLead(lead._id)}
//                                     />
//                                 </td>

//                                 <td className="px-3 py-4">{lead.name}</td>
//                                 <td className="px-3 py-4">{lead.email}</td>
//                                 <td className="px-3 py-4">{lead.phone}</td>
//                                 <td className="px-3 py-4">{lead.groupNumber || "—"}</td>

//                                 <td className="px-3 py-4">{lead.destination}</td>
//                                 <td className="px-3 py-4">{lead.leadSource}</td>

//                                 <td className="px-3 py-4">
//                                     {lead.type === "employee" ? lead.employee?.fullName : "—"}
//                                 </td>

//                                 <td className="px-3 py-4 flex gap-3">
//                                     <button className="text-blue-600" onClick={() => handleView(lead)}>
//                                         <Eye size={16} />
//                                     </button>
//                                     <button
//                                         className="text-green-600"
//                                         onClick={() => handleEdit(lead)}
//                                     >
//                                         <Edit2 size={16} />
//                                     </button>
//                                     <button
//                                         className="text-red-600"
//                                         onClick={() => handleDelete(lead)}
//                                     >
//                                         <Trash2 size={16} />
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//                 <div className="mt-4 flex justify-between">
//                     <button
//                         onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                         disabled={currentPage === 1}
//                         className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
//                     >
//                         Previous
//                     </button>

//                     <span>
//                         Page {currentPage} of {totalPages}
//                     </span>

//                     <button
//                         onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                         disabled={currentPage === totalPages}
//                         className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
//                     >
//                         Next
//                     </button>
//                 </div>
//             </div>

//             {/* Modals */}
//             {isEditModalOpen && (
//                 <EditModal
//                     lead={currentLead}
//                     onClose={() => setIsEditModalOpen(false)}
//                     onSave={handleUpdateLead}
//                 />
//             )}

//             {isViewModalOpen && (
//                 <ViewModal lead={currentLead} onClose={() => setIsViewModalOpen(false)} />
//             )}
//         </div>
//     );
// };

// export default LeadTable;



// import React, { useState, useEffect, useMemo } from "react";
// import { Eye, Edit2, Trash2, ArrowUpDown } from "lucide-react";

// const LeadTable = ({ searchText = "", selectedStatus = "All Status", refreshTrigger }) => {
//     const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//     const [selectedLeads, setSelectedLeads] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(10);
//     const [leads, setLeads] = useState([]);

//     const [employeeList, setEmployeeList] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState("All Employees");

//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//     const [currentLead, setCurrentLead] = useState(null);

//     const fetchLeadData = async () => {
//         try {
//             const [normalRes, empRes] = await Promise.all([fetch("http://localhost:4000/leads"), fetch("http://localhost:4000/employeelead/all")]);

//             const normalJson = await normalRes.json();
//             const empJson = await empRes.json();

//             const normalData = normalJson.success ? normalJson.data : [];
//             const employeeData = empJson.success ? empJson.leads : [];

//             const empNames = employeeData.map((el) => el.employee?.fullName).filter(Boolean);

//             setEmployeeList([...new Set(empNames)]);

//             const combined = [...normalData.map((l) => ({ ...l, type: "normal" })), ...employeeData.map((l) => ({ ...l, type: "employee" }))];

//             combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//             setLeads(combined);
//         } catch (error) {
//             console.error("Error:", error);
//         }
//     };

//     useEffect(() => {
//         fetchLeadData();
//     }, [refreshTrigger]);

//     const filteredLeads = useMemo(() => {
//         return leads.filter((lead) => {
//             const statusMatch = selectedStatus === "All Status" || lead.leadStatus === selectedStatus;

//             const employeeMatch = selectedEmployee === "All Employees" || lead.employee?.fullName === selectedEmployee;

//             const searchMatch =
//                 !searchText ||
//                 lead.name?.toLowerCase().includes(searchText.toLowerCase()) ||
//                 lead.email?.toLowerCase().includes(searchText.toLowerCase()) ||
//                 lead.company?.toLowerCase().includes(searchText.toLowerCase()) ||
//                 `${lead.phone}`.includes(searchText);

//             return statusMatch && employeeMatch && searchMatch;
//         });
//     }, [leads, searchText, selectedStatus, selectedEmployee]);

//     const sortedLeads = useMemo(() => {
//         if (!sortConfig.key) return filteredLeads;

//         return [...filteredLeads].sort((a, b) => {
//             let aValue = a[sortConfig.key];
//             let bValue = b[sortConfig.key];

//             if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
//             if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
//             return 0;
//         });
//     }, [filteredLeads, sortConfig]);

//     const paginatedLeads = useMemo(() => {
//         const startIndex = (currentPage - 1) * itemsPerPage;
//         return sortedLeads.slice(startIndex, startIndex + itemsPerPage);
//     }, [sortedLeads, currentPage, itemsPerPage]);

//     const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);

//     const handleSort = (key) => {
//         setSortConfig((curr) => ({
//             key,
//             direction: curr.key === key && curr.direction === "asc" ? "desc" : "asc",
//         }));
//     };

//     const handleSelectLead = (leadId) => {
//         setSelectedLeads((prev) => (prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]));
//     };

//     const handleSelectAll = () => {
//         setSelectedLeads(selectedLeads.length === paginatedLeads.length ? [] : paginatedLeads.map((l) => l._id));
//     };

//     const handleView = (lead) => {
//         setCurrentLead(lead);
//         setIsViewModalOpen(true);
//     };

//     const handleEdit = (lead) => {
//         setCurrentLead(lead);
//         setIsEditModalOpen(true);
//     };

//     const handleDelete = async (lead) => {
//         if (!window.confirm(`Delete lead ${lead.name}?`)) return;
//         await fetch(`http://localhost:4000/leads/${lead._id}`, { method: "DELETE" });
//         setLeads((prev) => prev.filter((l) => l._id !== lead._id));
//     };

//     const EmployeeFilter = () => (
//         <div className="mb-3">
//             <label className="mr-2 text-sm font-medium">Filter by Employee:</label>
//             <select
//                 value={selectedEmployee}
//                 onChange={(e) => setSelectedEmployee(e.target.value)}
//                 className="rounded border px-3 py-2"
//             >
//                 <option value="All Employees">All Employees</option>
//                 {employeeList.map((emp, i) => (
//                     <option
//                         key={i}
//                         value={emp}
//                     >
//                         {emp}
//                     </option>
//                 ))}
//             </select>
//         </div>
//     );

//     const SortableHeader = ({ column, children }) => (
//         <th
//             className="cursor-pointer px-3 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
//             onClick={() => handleSort(column)}
//         >
//             <div className="flex items-center gap-2">
//                 {children}
//                 <ArrowUpDown size={14} />
//             </div>
//         </th>
//     );

//     return (
//         <div className="w-full">
//             <EmployeeFilter />

//             <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-3 py-4">
//                                 <input
//                                     type="checkbox"
//                                     checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
//                                     onChange={handleSelectAll}
//                                 />
//                             </th>

//                             <SortableHeader column="name">Name</SortableHeader>
//                             <SortableHeader column="email">Email</SortableHeader>
//                             <SortableHeader column="phone">Phone</SortableHeader>

//                             <SortableHeader column="groupNumber">Group No</SortableHeader>

//                             <SortableHeader column="destination">Destination</SortableHeader>
//                             <SortableHeader column="leadSource">Source</SortableHeader>
//                             <SortableHeader column="employee">Employee</SortableHeader>

//                             {/* NEW STATUS COLUMN */}
//                             <SortableHeader column="leadStatus">Status</SortableHeader>

//                             <th className="px-3 py-4 text-xs">Actions</th>
//                         </tr>
//                     </thead>

//                     <tbody className="divide-y divide-gray-200 bg-white">
//                         {paginatedLeads.map((lead) => (
//                             <tr
//                                 key={lead._id}
//                                 className=""
//                             >
//                                 <td className="px-3 py-4">
//                                     <input
//                                         type="checkbox"
//                                         checked={selectedLeads.includes(lead._id)}
//                                         onChange={() => handleSelectLead(lead._id)}
//                                     />
//                                 </td>

//                                 <td className="px-3 py-4">{lead.name}</td>
//                                 <td className="px-3 py-4">{lead.email}</td>
//                                 <td className="px-3 py-4">{lead.phone}</td>
//                                 <td className="px-3 py-4">{lead.groupNumber || "—"}</td>

//                                 <td className="px-3 py-4">{lead.destination}</td>
//                                 <td className="px-3 py-4">{lead.leadSource}</td>

//                                 <td className="px-3 py-4">{lead.type === "employee" ? lead.employee?.fullName : "—"}</td>

//                                 {/* STATUS COLUMN WITH DOT */}
//                                 <td className="px-3 py-4">
//                                     <div className="flex items-center gap-2">
//                                         <span
//                                             className={`h-6 w-8 rounded-full ${
//                                                 lead.leadStatus === "Hot"
//                                                     ? "bg-red-600"
//                                                     : lead.leadStatus === "Warm"
//                                                       ? "bg-yellow-500"
//                                                       : "bg-blue-600"
//                                             }`}
//                                         ></span>

//                                         <span className="text-sm font-bold text-gray-800">{/* {lead.leadStatus} */}</span>
//                                     </div>
//                                 </td>

//                                 <td className="flex gap-3 px-3 py-4">
//                                     <button
//                                         className="text-blue-600"
//                                         onClick={() => handleView(lead)}
//                                     >
//                                         <Eye size={16} />
//                                     </button>
//                                     <button
//                                         className="text-green-600"
//                                         onClick={() => handleEdit(lead)}
//                                     >
//                                         <Edit2 size={16} />
//                                     </button>
//                                     <button
//                                         className="text-red-600"
//                                         onClick={() => handleDelete(lead)}
//                                     >
//                                         <Trash2 size={16} />
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//                 <div className="mt-4 flex justify-between">
//                     <button
//                         onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                         disabled={currentPage === 1}
//                         className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
//                     >
//                         Previous
//                     </button>

//                     <span>
//                         Page {currentPage} of {totalPages}
//                     </span>

//                     <button
//                         onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                         disabled={currentPage === totalPages}
//                         className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
//                     >
//                         Next
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LeadTable;

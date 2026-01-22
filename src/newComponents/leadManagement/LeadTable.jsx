


//   import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
//   import { Eye, Edit2, Trash2, ArrowUpDown, X, Loader } from "lucide-react";

//   const LeadTable = ({ searchText = "", selectedStatus = "All Status", refreshTrigger }) => {
//       const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//       const [selectedLeads, setSelectedLeads] = useState([]);
//       const [currentPage, setCurrentPage] = useState(1);
//       const [itemsPerPage] = useState(50); // Fetch larger chunks from API
      
//       // Optimized lead state - store all pages' data with cache
//       const [leads, setLeads] = useState([]);
//       const [totalRecords, setTotalRecords] = useState(0);
//       const [totalPages, setTotalPages] = useState(0);
//       const [isLoading, setIsLoading] = useState(false);
//       const [error, setError] = useState(null);

//       // Cache for API calls - avoid redundant requests
//       const cacheRef = useRef({
//           normal: {},
//           employee: {}
//       });
//       const lastFetchRef = useRef({
//           search: "",
//           status: "",
//           page: 1
//       });

//       // Employee list filter
//       const [employeeList, setEmployeeList] = useState([]);
//       const [selectedEmployee, setSelectedEmployee] = useState("All Employees");

//       // Modal states
//       const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//       const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//       const [currentLead, setCurrentLead] = useState(null);

//       // ================================================
//       // FETCH ALL EMPLOYEE NAMES FROM ENTIRE DATASET
//       // ================================================
//       const fetchAllEmployees = useCallback(async () => {
//           try {
//               // Fetch all employee leads to extract unique employee names
//               const response = await fetch("http://localhost:4000/employeelead/all");
//               const result = await response.json();
              
//               console.log("Employee leads response:", result);
              
//               if (result.success && result.leads && Array.isArray(result.leads)) {
//                   // Extract unique employee names from all leads
//                   const empNames = result.leads
//                       .map((lead) => lead.employee?.fullName || lead.employee?.name)
//                       .filter((name) => name && name.trim() !== "");
                  
//                   const uniqueEmployees = [...new Set(empNames)];
//                   const sortedEmployees = uniqueEmployees.sort();
                  
//                   console.log("Extracted employees:", sortedEmployees);
//                   setEmployeeList(sortedEmployees);
//               } else {
//                   console.warn("Unexpected response structure:", result);
//               }
//           } catch (error) {
//               console.error("Error fetching all employees:", error);
//           }
//       }, []);

//       // ================================================
//       // OPTIMIZED FETCH - Uses pagination & caching
//       // ================================================
//       const fetchLeadData = useCallback(async (pageNum = 1) => {
//           try {
//               setIsLoading(true);
//               setError(null);

//               // Build query strings with filters
//               const normalParams = new URLSearchParams({
//                   page: pageNum,
//                   limit: itemsPerPage,
//                   ...(searchText && { search: searchText }),
//                   ...(selectedStatus !== "All Status" && { status: selectedStatus })
//               });

//               const empParams = new URLSearchParams({
//                   page: pageNum,
//                   limit: itemsPerPage,
//                   ...(searchText && { search: searchText }),
//                   ...(selectedStatus !== "All Status" && { status: selectedStatus })
//               });

//               // Fetch both normal and employee leads in parallel
//               const [normalRes, empRes] = await Promise.all([
//                   fetch(`http://localhost:4000/leads?${normalParams.toString()}`),
//                   fetch(`http://localhost:4000/employeelead/all?${empParams.toString()}`)
//               ]);

//               const normalJson = await normalRes.json();
//               const empJson = await empRes.json();

//               // Process normal leads
//               const normalData = normalJson.success ? normalJson.data : [];
//               const normalPagination = normalJson.pagination || {};

//               // Process employee leads
//               const empData = empJson.success ? empJson.leads : [];
//               const empPagination = empJson.pagination || {};

//               // Combine leads with type indicator
//               const combinedLeads = [
//                   ...normalData.map((l) => ({ ...l, type: "normal" })),
//                   ...empData.map((l) => ({ ...l, type: "employee" }))
//               ];

//               // Sort by creation date
//               combinedLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//               setLeads(combinedLeads);
              
//               // Use total from API - add both normal and employee lead totals
//               const normalTotal = normalPagination.totalRecords || 0;
//               const empTotal = empPagination.totalRecords || 0;
//               const totalFromApi = normalTotal + empTotal;
              
//               setTotalRecords(totalFromApi);
//               setTotalPages(Math.ceil(totalFromApi / itemsPerPage));

//               lastFetchRef.current = {
//                   search: searchText,
//                   status: selectedStatus,
//                   page: pageNum
//               };
//           } catch (error) {
//               console.error("Error fetching leads:", error);
//               setError(error.message);
//               setLeads([]);
//           } finally {
//               setIsLoading(false);
//           }
//       }, [searchText, selectedStatus, itemsPerPage]);

//       // Trigger fetch when search, status, or refresh changes
//       useEffect(() => {
//           setCurrentPage(1);
//           fetchLeadData(1);
//       }, [searchText, selectedStatus, refreshTrigger, fetchLeadData]);

//       // Fetch all employees once on mount
//       useEffect(() => {
//           fetchAllEmployees();
//       }, [fetchAllEmployees]);

//       // Fetch new page when pagination changes
//       useEffect(() => {
//           if (currentPage !== lastFetchRef.current.page) {
//               fetchLeadData(currentPage);
//           }
//       }, [currentPage, fetchLeadData]);

//       // Filter leads by employee (client-side, after API provides data)
//       const filteredLeads = useMemo(() => {
//           return leads.filter((lead) => {
//               const employeeMatch =
//                   selectedEmployee === "All Employees" ||
//                   (lead.type === "employee" && lead.employee?.fullName === selectedEmployee) ||
//                   (lead.type === "normal" && selectedEmployee === "All Employees");
//               return employeeMatch;
//           });
//       }, [leads, selectedEmployee]);

//       // Sorting
//       const sortedLeads = useMemo(() => {
//           if (!sortConfig.key) return filteredLeads;

//           return [...filteredLeads].sort((a, b) => {
//               let aValue = a[sortConfig.key];
//               let bValue = b[sortConfig.key];

//               if (sortConfig.key === "value") {
//                   aValue = parseFloat(aValue?.replace(/[$,]/g, "") || 0);
//                   bValue = parseFloat(bValue?.replace(/[$,]/g, "") || 0);
//               }

//               if (sortConfig.key === "lastContact" || sortConfig.key === "createdAt") {
//                   aValue = new Date(aValue);
//                   bValue = new Date(bValue);
//               }

//               if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
//               if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
//               return 0;
//           });
//       }, [filteredLeads, sortConfig]);

//       // Use API paginated data directly
//       const paginatedLeads = sortedLeads;
//       // Use the actual totalPages from API response, not calculated from current page data
//       const displayTotalPages = totalPages || 1;

//       // ================================
//       // Handlers
//       // ================================
//       const handleSort = (key) => {
//           setSortConfig((current) => ({
//               key,
//               direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
//           }));
//       };

//       const handleSelectLead = (leadId) => {
//           setSelectedLeads((current) => (current.includes(leadId) ? current.filter((id) => id !== leadId) : [...current, leadId]));
//       };

//       const handleSelectAll = () => {
//           setSelectedLeads(selectedLeads.length === paginatedLeads.length ? [] : paginatedLeads.map((lead) => lead._id));
//       };

//       const handleView = (lead) => {
//           setCurrentLead(lead);
//           setIsViewModalOpen(true);
//       };

//       const handleEdit = (lead) => {
//           setCurrentLead(lead);
//           setIsEditModalOpen(true);
//       };

//       const handleDelete = async (lead) => {
//           if (!window.confirm(`Delete lead ${lead.name}?`)) return;
//           try {
//               await fetch(`http://localhost:4000/leads/${lead._id}`, { method: "DELETE" });
//               setLeads((prev) => prev.filter((l) => l._id !== lead._id));
//           } catch (e) {
//               console.log(e);
//           }
//       };

//       const handleUpdateLead = async (updatedLead) => {
//           try {
//               const isEmployeeLead = updatedLead?.type === "employee" || currentLead?.type === "employee";
//               const url = isEmployeeLead ? `http://localhost:4000/employeelead/${updatedLead._id}` : `http://localhost:4000/leads/${updatedLead._id}`;
//               const method = isEmployeeLead ? "PUT" : "PATCH";

//               const response = await fetch(url, {
//                   method,
//                   headers: { "Content-Type": "application/json" },
//                   body: JSON.stringify(updatedLead),
//               });

//               const result = await response.json();
//               if (result?.success) {
//                   const next = result.data ?? updatedLead;
//                   setLeads((prev) => prev.map((l) => (l._id === next._id ? { ...l, ...next } : l)));
//                   setIsEditModalOpen(false);
//               }
//           } catch (e) {
//               console.error("Update error:", e);
//           }
//       };

//       // ================================================
//       // EMPLOYEE FILTER
//       // ================================================
//       const EmployeeFilter = () => {
//           console.log("EmployeeList in dropdown:", employeeList);
//           return (
//           <div className="mb-3">
//               <label className="mr-2 text-sm font-medium">Filter by Employee:</label>
//               <select
//                   value={selectedEmployee}
//                   onChange={(e) => setSelectedEmployee(e.target.value)}
//                   className="rounded border px-3 py-2"
//               >
//                   <option value="All Employees">All Employees</option>
//                   {employeeList && employeeList.length > 0 ? (
//                       employeeList.map((emp, i) => (
//                           <option
//                               key={i}
//                               value={emp}
//                           >
//                               {emp}
//                           </option>
//                       ))
//                   ) : (
//                       <option disabled>No employees found</option>
//                   )}
//               </select>
//           </div>
//       );
//       };

//       // ==================================================
//       // EDIT MODAL (unchanged)
//       // ==================================================
//       // *** keeping your full edit modal exactly as you posted ***
//       const EditModal = ({ lead, onClose, onSave }) => {
//           const [formData, setFormData] = useState({
//               ...lead,
//               placesToCoverArray: lead.placesToCover?.split(",").map((p) => p.trim()) || [],
//               childAges: lead.childAges || [],
//               customNoOfDays: "",
//           });

//           const [placeInput, setPlaceInput] = useState("");
//           const [childAgeInput, setChildAgeInput] = useState("");

//           const handleAddPlace = (e) => {
//               if (e.key === "Enter" && placeInput.trim()) {
//                   setFormData((p) => ({
//                       ...p,
//                       placesToCoverArray: [...p.placesToCoverArray, placeInput.trim()],
//                   }));
//                   setPlaceInput("");
//               }
//           };

//           const handleRemovePlace = (idx) => {
//               setFormData((p) => ({
//                   ...p,
//                   placesToCoverArray: p.placesToCoverArray.filter((_, i) => i !== idx),
//               }));
//           };

//           const handleAddChildAge = (e) => {
//               if (e.key === "Enter" && childAgeInput.trim()) {
//                   setFormData((p) => ({
//                       ...p,
//                       childAges: [...p.childAges, childAgeInput.trim()],
//                   }));
//                   setChildAgeInput("");
//               }
//           };

//           const handleRemoveChildAge = (idx) => {
//               setFormData((p) => ({
//                   ...p,
//                   childAges: p.childAges.filter((_, i) => i !== idx),
//               }));
//           };

//           const handleSubmit = (e) => {
//               e.preventDefault();
//               const isEmployeeLead = lead?.type === "employee";

//               const normalized = { ...formData };

//               normalized.placesToCover = formData.placesToCoverArray.join(", ");

//               if (formData.expectedTravelDate) {
//                   const dt = new Date(formData.expectedTravelDate);
//                   normalized.expectedTravelDate = Number.isNaN(dt.getTime()) ? undefined : dt;
//               }

//               const toNum = (v) => (v === "" || v === null || v === undefined ? undefined : Number(v));
//               normalized.noOfPerson = toNum(formData.noOfPerson);
//               normalized.noOfChild = toNum(formData.noOfChild);

//               const ages = Array.isArray(formData.childAges) ? formData.childAges.map((a) => Number(a)).filter((n) => !Number.isNaN(n)) : [];
//               normalized.childAges = ages;

//               if (isEmployeeLead) {
//                   normalized.noOfDays = formData.noOfDays === "Others" ? formData.customNoOfDays : formData.noOfDays;
//               } else {
//                   const nd = formData.noOfDays === "Others" ? formData.customNoOfDays : formData.noOfDays;
//                   normalized.noOfDays = nd ? Number(nd) : undefined;
//               }

//               onSave(normalized);
//           };

//           if (!lead) return null;

//           const leadSources = [
//               "Cold Call",
//               "Website",
//               "Referral",
//               "LinkedIn",
//               "Trade Show",
//               "Email Campaign",
//               "Social Media",
//               "Event",
//               "Organic Search",
//               "Paid Ads",
//           ];
//           const leadTypes = ["International", "Domestic"];
//           const tripTypes = ["Solo", "Group", "Family", "Couple", "Honeymoon"];
//           const leadStatuses = ["Hot", "Warm", "Cold", "Converted", "Lost"];
//           const tripDurations = [
//               "1n/2d",
//               "2n/3d",
//               "3n/4d",
//               "4n/5d",
//               "5n/6d",
//               "6n/7d",
//               "7n/8d",
//               "8n/9d",
//               "9n/10d",
//               "10n/11d",
//               "11n/12d",
//               "12n/13d",
//               "13n/14d",
//               "14n/15d",
//               "Others",
//           ];

//           const toDateInputValue = (d) => {
//               try {
//                   const dt = d ? new Date(d) : null;
//                   if (!dt || Number.isNaN(dt.getTime())) return "";
//                   const y = dt.getFullYear();
//                   const m = String(dt.getMonth() + 1).padStart(2, "0");
//                   const day = String(dt.getDate()).padStart(2, "0");
//                   return `${y}-${m}-${day}`;
//               } catch {
//                   return "";
//               }
//           };

//           return (
//               <div
//                   className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
//                   onClick={onClose}
//               >
//                   <div
//                       className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-lg"
//                       onClick={(e) => e.stopPropagation()}
//                   >
//                       <div className="flex items-center justify-between border-b p-4">
//                           <h2 className="text-lg font-bold text-gray-900">Edit Lead</h2>
//                           <button
//                               onClick={onClose}
//                               className="font-bold text-gray-500 hover:text-gray-900"
//                           >
//                               ×
//                           </button>
//                       </div>
//                       <div className="flex-1 overflow-y-auto p-4">
//                           <form
//                               onSubmit={handleSubmit}
//                               className="grid grid-cols-1 gap-4 sm:grid-cols-2"
//                           >
//                               {[
//                                   { key: "name", type: "text" },
//                                   { key: "email", type: "email" },
//                                   { key: "phone", type: "text" },
//                                   { key: "whatsAppNo", type: "text" },
//                                   { key: "company", type: "text" },
//                                   { key: "value", type: "text" },
//                                   { key: "departureCity", type: "text" },
//                                   { key: "destination", type: "text" },
//                               ].map(({ key, type }) => (
//                                   <div
//                                       key={key}
//                                       className="h-[4.5rem]"
//                                   >
//                                       <label className="mb-0.5 block text-xs font-medium text-gray-700">{key.replace(/([A-Z])/g, " $1")}</label>
//                                       <input
//                                           type={type}
//                                           name={key}
//                                           value={formData[key] || ""}
//                                           onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
//                                           className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                       />
//                                   </div>
//                               ))}

//                               <div className="h-[4.5rem]">
//                                   <label className="mb-0.5 block text-xs font-medium text-gray-700">Expected Travel Date</label>
//                                   <input
//                                       type="date"
//                                       name="expectedTravelDate"
//                                       value={toDateInputValue(formData.expectedTravelDate)}
//                                       onChange={(e) => setFormData({ ...formData, expectedTravelDate: e.target.value })}
//                                       className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                   />
//                               </div>

//                               <div className="h-[4.5rem]">
//                                   <label className="mb-0.5 block text-xs font-medium text-gray-700">No. of Days</label>
//                                   <select
//                                       name="noOfDays"
//                                       value={formData.noOfDays || ""}
//                                       onChange={(e) => setFormData({ ...formData, noOfDays: e.target.value })}
//                                       className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                   >
//                                       <option value="">Select No. of Days</option>
//                                       {tripDurations.map((opt) => (
//                                           <option
//                                               key={opt}
//                                               value={opt}
//                                           >
//                                               {opt}
//                                           </option>
//                                       ))}
//                                   </select>
//                               </div>

//                               {formData.noOfDays === "Others" && (
//                                   <div className="h-[4.5rem]">
//                                       <label className="mb-0.5 block text-xs font-medium text-gray-700">Custom Days</label>
//                                       <input
//                                           name="customNoOfDays"
//                                           value={formData.customNoOfDays || ""}
//                                           onChange={(e) => setFormData({ ...formData, customNoOfDays: e.target.value })}
//                                           className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                       />
//                                   </div>
//                               )}

//                               <div className="sm:col-span-2">
//                                   <label className="mb-0.5 block text-xs font-medium text-gray-700">Places to Cover</label>
//                                   <input
//                                       value={placeInput}
//                                       onChange={(e) => setPlaceInput(e.target.value)}
//                                       onKeyDown={handleAddPlace}
//                                       placeholder="Type and press Enter"
//                                       className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                   />
//                                   <div className="mt-2 flex flex-wrap gap-2">
//                                       {formData.placesToCoverArray.map((p, i) => (
//                                           <span
//                                               key={`${p}-${i}`}
//                                               className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-700"
//                                           >
//                                               {p}
//                                               <button
//                                                   type="button"
//                                                   onClick={() => handleRemovePlace(i)}
//                                               >
//                                                   x
//                                               </button>
//                                           </span>
//                                       ))}
//                                   </div>
//                               </div>

//                               {[{ key: "noOfPerson" }, { key: "noOfChild" }].map(({ key }) => (
//                                   <div
//                                       key={key}
//                                       className="h-[4.5rem]"
//                                   >
//                                       <label className="mb-0.5 block text-xs font-medium text-gray-700">{key.replace(/([A-Z])/g, " $1")}</label>
//                                       <input
//                                           name={key}
//                                           value={formData[key] || ""}
//                                           onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
//                                           className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                       />
//                                   </div>
//                               ))}

//                               <div className="sm:col-span-2">
//                                   <label className="mb-0.5 block text-xs font-medium text-gray-700">Child Ages</label>
//                                   <input
//                                       value={childAgeInput}
//                                       onChange={(e) => setChildAgeInput(e.target.value)}
//                                       onKeyDown={handleAddChildAge}
//                                       placeholder="Enter age and press Enter"
//                                       className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                   />
//                                   <div className="mt-2 flex flex-wrap gap-2">
//                                       {formData.childAges.map((age, i) => (
//                                           <span
//                                               key={`${age}-${i}`}
//                                               className="flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-sm text-green-700"
//                                           >
//                                               {age}
//                                               <button
//                                                   type="button"
//                                                   onClick={() => handleRemoveChildAge(i)}
//                                               >
//                                                   x
//                                               </button>
//                                           </span>
//                                       ))}
//                                   </div>
//                               </div>

//                               <div className="h-[4.5rem]">
//                                   <label className="mb-0.5 block text-xs font-medium text-gray-700">Lead Source</label>
//                                   <select
//                                       name="leadSource"
//                                       value={formData.leadSource || ""}
//                                       onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
//                                       className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                   >
//                                       <option value="">Select Lead Source</option>
//                                       {leadSources.map((opt) => (
//                                           <option
//                                               key={opt}
//                                               value={opt}
//                                           >
//                                               {opt}
//                                           </option>
//                                       ))}
//                                   </select>
//                               </div>

//                               <div className="h-[4.5rem]">
//                                   <label className="mb-0.5 block text-xs font-medium text-gray-700">Lead Type</label>
//                                   <select
//                                       name="leadType"
//                                       value={formData.leadType || ""}
//                                       onChange={(e) => setFormData({ ...formData, leadType: e.target.value })}
//                                       className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                   >
//                                       <option value="">Select Lead Type</option>
//                                       {leadTypes.map((opt) => (
//                                           <option
//                                               key={opt}
//                                               value={opt}
//                                           >
//                                               {opt}
//                                           </option>
//                                       ))}
//                                   </select>
//                               </div>

//                               <div className="h-[4.5rem]">
//                                   <label className="mb-0.5 block text-xs font-medium text-gray-700">Trip Type</label>
//                                   <select
//                                       name="tripType"
//                                       value={formData.tripType || ""}
//                                       onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
//                                       className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                   >
//                                       <option value="">Select Trip Type</option>
//                                       {tripTypes.map((opt) => (
//                                           <option
//                                               key={opt}
//                                               value={opt}
//                                           >
//                                               {opt}
//                                           </option>
//                                       ))}
//                                   </select>
//                               </div>

//                               <div className="h-[4.5rem]">
//                                   <label className="mb-0.5 block text-xs font-medium text-gray-700">Lead Status</label>
//                                   <select
//                                       name="leadStatus"
//                                       value={formData.leadStatus || "Cold"}
//                                       onChange={(e) => setFormData({ ...formData, leadStatus: e.target.value })}
//                                       className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                   >
//                                       {leadStatuses.map((opt) => (
//                                           <option
//                                               key={opt}
//                                               value={opt}
//                                           >
//                                               {opt}
//                                           </option>
//                                       ))}
//                                   </select>
//                               </div>

//                               <div className="h-[4.5rem]">
//                                   <label className="mb-0.5 block text-xs font-medium text-gray-700">Group Number</label>
//                                   <input
//                                       name="groupNumber"
//                                       value={formData.groupNumber || ""}
//                                       onChange={(e) => setFormData({ ...formData, groupNumber: e.target.value })}
//                                       className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                   />
//                               </div>

//                               <div className="sm:col-span-2">
//                                   <label className="mb-0.5 block text-xs font-medium text-gray-700">Notes</label>
//                                   <textarea
//                                       name="notes"
//                                       value={formData.notes || ""}
//                                       onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//                                       className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                                   />
//                               </div>

//                               <div className="mt-2 flex justify-end gap-3 sm:col-span-2">
//                                   <button
//                                       type="button"
//                                       onClick={onClose}
//                                       className="rounded bg-gray-200 px-4 py-2"
//                                   >
//                                       Cancel
//                                   </button>
//                                   <button
//                                       type="submit"
//                                       className="rounded bg-blue-600 px-4 py-2 text-white"
//                                   >
//                                       Save
//                                   </button>
//                               </div>
//                           </form>
//                       </div>
//                   </div>
//               </div>
//           );
//       };

//       // =========================================================
//       // UPDATED VIEW MODAL (individual fields – no JSON)
//       // =========================================================
//       const ViewModal = ({ lead, onClose }) => {
//           if (!lead) return null;

//           const fields = [
//               { label: "Name", value: lead.name },
//               { label: "Email", value: lead.email },
//               { label: "Phone", value: lead.phone },
//               { label: "WhatsApp No", value: lead.whatsAppNo },
//               { label: "Departure City", value: lead.departureCity },
//               { label: "Destination", value: lead.destination },
//               { label: "Expected Travel Date", value: lead.expectedTravelDate },
//               { label: "No. of Days", value: lead.noOfDays },
//               {
//                   label: "Places to Cover",
//                   value: Array.isArray(lead.placesToCover) ? lead.placesToCover.join(", ") : lead.placesToCover,
//               },
//               { label: "No. of Person", value: lead.noOfPerson },
//               { label: "No. of Child", value: lead.noOfChild },
//               {
//                   label: "Child Ages",
//                   value: Array.isArray(lead.childAges) ? lead.childAges.join(", ") : lead.childAges,
//               },
//               { label: "Lead Source", value: lead.leadSource },
//               { label: "Lead Type", value: lead.leadType },
//               { label: "Trip Type", value: lead.tripType },
//               { label: "Lead Status", value: lead.leadStatus },
//               { label: "Group Number", value: lead.groupNumber },
//               { label: "Last Contact", value: lead.lastContact },
//               { label: "Notes", value: lead.notes },
//               { label: "Created At", value: lead.createdAt },
//               { label: "Updated At", value: lead.updatedAt },
//               { label: "Type", value: lead.type },
//               { label: "Employee", value: lead.employee?.fullName || "—" },
//           ];

//           return (
//               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//                   <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
//                       <h2 className="mb-4 text-center text-lg font-bold">Lead Details</h2>

//                       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                           {fields.map((field, index) => (
//                               <div
//                                   key={index}
//                                   className="rounded border p-3"
//                               >
//                                   <p className="text-xs font-bold uppercase text-gray-500">{field.label}</p>
//                                   <p className="mt-1 text-sm text-gray-800">{field.value || "—"}</p>
//                               </div>
//                           ))}
//                       </div>

//                       <button
//                           onClick={onClose}
//                           className="mt-6 w-full rounded bg-red-500 px-4 py-2 text-white"
//                       >
//                           Close
//                       </button>
//                   </div>
//               </div>
//           );
//       };

//       // ========================================================
//       // TABLE UI (updated with loading states)
//       // ========================================================

//       const SortableHeader = ({ column, children }) => (
//           <th
//               className="cursor-pointer px-3 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 sm:px-6"
//               onClick={() => handleSort(column)}
//           >
//               <div className="flex items-center gap-2">
//                   {children}
//                   <ArrowUpDown className="h-4 w-4" />
//               </div>
//           </th>
//       );

//       if (isLoading && leads.length === 0) {
//           return (
//               <div className="py-12 text-center">
//                   <Loader className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-3" />
//                   <h3 className="text-lg font-medium">Loading leads...</h3>
//                   <p className="text-gray-500 text-sm mt-2">Fetching data from server</p>
//               </div>
//           );
//       }

//       if (error) {
//           return (
//               <div className="py-12 text-center">
//                   <h3 className="text-lg font-medium text-red-600">Error loading leads</h3>
//                   <p className="text-gray-500 text-sm mt-2">{error}</p>
//               </div>
//           );
//       }

//       if (filteredLeads.length === 0 && !isLoading) {
//           return (
//               <div className="py-12 text-center">
//                   <h3 className="text-lg font-medium">No leads found</h3>
//                   <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
//               </div>
//           );
//       }

//       return (
//           <div className="w-full">
//               <EmployeeFilter />

//               {isLoading && (
//                   <div className="mb-3 flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
//                       <Loader className="h-4 w-4 animate-spin" />
//                       Loading leads...
//                   </div>
//               )}

//               <div className="overflow-x-auto relative">
//                   {isLoading && <div className="absolute inset-0 bg-white/30 z-10 rounded-lg" />}
//                   <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                           <tr>
//                               <th className="px-3 py-4">
//                                   <input
//                                       type="checkbox"
//                                       checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
//                                       onChange={handleSelectAll}
//                                       disabled={isLoading}
//                                   />
//                               </th>

//                               <SortableHeader column="name">Name</SortableHeader>
//                               <SortableHeader column="email">Email</SortableHeader>
//                               <SortableHeader column="phone">Phone</SortableHeader>
//                               <SortableHeader column="groupNumber">Group No</SortableHeader>

//                               <SortableHeader column="destination">Destination</SortableHeader>
//                               <SortableHeader column="leadSource">Source</SortableHeader>
//                               <SortableHeader column="employee">Employee</SortableHeader>

//                               <th className="px-3 py-4 text-xs">Actions</th>
//                           </tr>
//                       </thead>

//                       <tbody className="divide-y divide-gray-200 bg-white">
//                           {paginatedLeads.map((lead) => (
//                               <tr key={lead._id}>
//                                   <td className="px-3 py-4">
//                                       <input
//                                           type="checkbox"
//                                           checked={selectedLeads.includes(lead._id)}
//                                           onChange={() => handleSelectLead(lead._id)}
//                                       />
//                                   </td>

//                                   <td className="px-3 py-4">{lead.name}</td>
//                                   <td className="px-3 py-4">{lead.email}</td>
//                                   <td className="px-3 py-4">{lead.phone}</td>
//                                   <td className="px-3 py-4">{lead.groupNumber || "—"}</td>

//                                   <td className="px-3 py-4">{lead.destination}</td>
//                                   <td className="px-3 py-4">{lead.leadSource}</td>

//                                   <td className="px-3 py-4">{lead.type === "employee" ? lead.employee?.fullName : "—"}</td>

//                                   <td className="flex gap-3 px-3 py-4">
//                                       <button
//                                           className="text-blue-600"
//                                           onClick={() => handleView(lead)}
//                                       >
//                                           <Eye size={16} />
//                                       </button>
//                                       <button
//                                           className="text-green-600"
//                                           onClick={() => handleEdit(lead)}
//                                       >
//                                           <Edit2 size={16} />
//                                       </button>
//                                       <button
//                                           className="text-red-600"
//                                           onClick={() => handleDelete(lead)}
//                                       >
//                                           <Trash2 size={16} />
//                                       </button>
//                                   </td>
//                               </tr>
//                           ))}
//                       </tbody>
//                   </table>

//                   {/* Pagination */}
//                   <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
//                       <button
//                           onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                           disabled={currentPage === 1 || isLoading}
//                           className="rounded bg-blue-600 text-white px-4 py-2 disabled:bg-gray-300 transition"
//                       >
//                           ← Previous
//                       </button>

//                       <div className="text-sm text-gray-600 text-center">
//                           <div>Page <strong>{currentPage}</strong> of <strong>{displayTotalPages}</strong></div>
//                           <div className="text-xs mt-1">Total: <strong>{totalRecords}</strong> leads</div>
//                       </div>

//                       <button
//                           onClick={() => setCurrentPage((p) => Math.min(p + 1, displayTotalPages))}
//                           disabled={currentPage >= displayTotalPages || isLoading}
//                           className="rounded bg-blue-600 text-white px-4 py-2 disabled:bg-gray-300 transition"
//                       >
//                           Next →
//                       </button>
//                   </div>
//               </div>

//               {isEditModalOpen && (
//                   <EditModal
//                       lead={currentLead}
//                       onClose={() => setIsEditModalOpen(false)}
//                       onSave={handleUpdateLead}
//                   />
//               )}

//               {isViewModalOpen && (
//                   <ViewModal
//                       lead={currentLead}
//                       onClose={() => setIsViewModalOpen(false)}
//                   />
//               )}
//           </div>
//       );
//   };

//   export default LeadTable;



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
              <label className="mr-2 text-sm px-2 font-medium">Filter by Employee:</label>
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

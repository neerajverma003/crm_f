
import React, { useState, useEffect, useRef } from "react";
import { Plus, AlertCircle, Eye, Edit2, X } from "lucide-react";
import DestinationSearchBox from "../../components/DestinationSearchBox";
import { handleDestinationBasedRouting, fetchLeadsAssignedByDestination, findEmployeeByDestination } from "../../utils/destinationRouting";

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

const pageSize = 100;

// 🧩 Input Field Component
const InputField = ({ name, type = "text", placeholder, required, value, error, onChange, disabled = false }) => (
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
      disabled={disabled}
      className={`w-full px-3 py-1.5 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
        disabled ? "bg-gray-100 cursor-not-allowed border-gray-300 text-gray-500" : ""
      } ${
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
const LeadForm = ({ initialData, onSubmit, onClose, isEditing = false }) => {
  useEffect(() => {
    console.log("LeadForm mounted/initialData:", initialData);
  }, [initialData]);
  const normalizeDateForInput = (val) => {
    if (!val) return "";
    // If already in YYYY-MM-DD form, return as-is
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return "";
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    } catch (e) {
      return "";
    }
  };

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
    expectedTravelDate: normalizeDateForInput(initialData?.expectedTravelDate),
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
      expectedTravelDate: normalizeDateForInput(initialData?.expectedTravelDate),
      noOfDays: "",
      customNoOfDays: "",
      placesToCover: "",
      placesToCoverArray: initialData?.placesToCoverArray || (initialData?.placesToCover ? initialData.placesToCover.split(",").map(p => p.trim()).filter(Boolean) : []),
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

  // Local input for adding places (supports Add button and comma-separated paste)
  const [placeInput, setPlaceInput] = useState("");

  useEffect(() => {
    // reset small place input when initial data changes
    setPlaceInput("");
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
    if (e && e.type === "keydown" && e.key !== "Enter") return;
    if (e && e.preventDefault) e.preventDefault();

    const inputVal = (placeInput || "").trim();
    if (!inputVal) return;

    // allow comma-separated multiple places
    const parts = inputVal.split(",").map(p => p.trim()).filter(Boolean);
    if (parts.length === 0) return;

    setFormData((prev) => {
      const current = prev.placesToCoverArray || [];
      const merged = [...current];
      parts.forEach(p => { if (!merged.includes(p)) merged.push(p); });
      return { ...prev, placesToCoverArray: merged };
    });
    setPlaceInput("");
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

    // Normalize date to ISO if user supplied a YYYY-MM-DD (input[type=date])
    if (payload.expectedTravelDate && /^\d{4}-\d{2}-\d{2}$/.test(payload.expectedTravelDate)) {
      try {
        const iso = new Date(payload.expectedTravelDate);
        if (!isNaN(iso.getTime())) payload.expectedTravelDate = iso.toISOString();
      } catch (err) {
        // ignore conversion error, send as-is
      }
    }

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
        <InputField name="phone" value={formData.phone} onChange={handleChange} required error={errors.phone} disabled={isEditing} />
        <InputField name="whatsAppNo" value={formData.whatsAppNo} onChange={handleChange} />
        <InputField name="departureCity" value={formData.departureCity} onChange={handleChange} />
        <DestinationSearchBox
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          placeholder="Search destination..."
          error={errors.destination}
        />
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
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a place, press Enter or click Add"
              value={placeInput}
              onChange={(e) => setPlaceInput(e.target.value)}
              onKeyDown={(e) => handleAddPlace(e)}
              className="flex-1 px-3 py-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <button type="button" onClick={handleAddPlace} className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
          </div>
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
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [destinationAssignedLeads, setDestinationAssignedLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignedLoading, setAssignedLoading] = useState(false);
  const [destAssignedLoading, setDestAssignedLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewLead, setViewLead] = useState(null);
  const [editLead, setEditLead] = useState(null);
  const [editAssignedLead, setEditAssignedLead] = useState(null);
  const [editDestAssignedLead, setEditDestAssignedLead] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("my-leads");
  const [transferLeads, setTransferLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const selectAllRef = useRef(null);

  const employeeId = localStorage.getItem("userId");

  // Fetch employee's own leads
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
      console.log("📥 All leads from API:", data.leads);
      // Show leads that are: (1) created by this employee OR (2) routed to them AND they've taken action
      const ownLeads = (data.leads || []).filter((lead) => {
        const shouldInclude = !lead.routedFromEmployee || (lead.routedFromEmployee && lead.isActioned);
        console.log(`Lead: ${lead.name}, routedFromEmployee: ${lead.routedFromEmployee}, isActioned: ${lead.isActioned}, shouldInclude: ${shouldInclude}`);
        return shouldInclude;
      });
      console.log("📊 Filtered own leads:", ownLeads);
      setLeads(ownLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      setError(err.message || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  // Fetch assigned leads for this employee
  const fetchAssignedLeads = async () => {
    if (!employeeId) return;
    setAssignedLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/assignlead/${employeeId}`);
      const data = await res.json();
      if (res.ok) {
        setAssignedLeads(data.data || []);
        setCurrentPage(1);
      } else {
        console.error("Failed to fetch assigned leads:", data.message);
        setAssignedLeads([]);
      }
    } catch (err) {
      console.error("Error fetching assigned leads:", err);
      setAssignedLeads([]);
    } finally {
      setAssignedLoading(false);
    }
  };

  // Fetch leads assigned by destination (leads routed to this employee)
  const fetchDestinationAssignedLeads = async () => {
    if (!employeeId) return;
    setDestAssignedLoading(true);
    try {
      const leads = await fetchLeadsAssignedByDestination(employeeId);
      // Show only leads that were routed from another employee AND have NOT been actioned yet
      const routedLeads = leads.filter((lead) => 
        lead.routedFromEmployee && 
        lead.routedFromEmployee !== employeeId && 
        !lead.isActioned
      );
      setDestinationAssignedLeads(routedLeads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Error fetching destination-assigned leads:", err);
      setDestinationAssignedLeads([]);
    } finally {
      setDestAssignedLoading(false);
    }
  };

  // Fetch transfer-to-operation leads for current employee
  const fetchTransferLeads = async () => {
    if (!employeeId) return;
    try {
      const res = await fetch(`http://localhost:4000/employeelead/transfer/employee/${employeeId}`);
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setTransferLeads(data.data || []);
      } else {
        console.error("Failed to fetch transfer leads:", data.message);
        setTransferLeads([]);
      }
    } catch (err) {
      console.error("Error fetching transfer leads:", err);
      setTransferLeads([]);
    }
  };

  useEffect(() => { 
    fetchLeads(); 
  }, []);

  // Refetch leads when "my-leads" tab is activated
  useEffect(() => {
    if (activeTab === "my-leads") {
      console.log("📱 'My Leads' tab activated, refetching...");
      fetchLeads();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "assigned") {
      fetchAssignedLeads();
    } else if (activeTab === "destination-assigned") {
      fetchDestinationAssignedLeads();
    } else if (activeTab === "transfer") {
      fetchTransferLeads();
    }
  }, [activeTab]);

  // Adjust page if length changes
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil((assignedLeads && assignedLeads.length) / pageSize));
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [assignedLeads, currentPage]);

  // Filter assigned leads to exclude those with phone numbers already in My Leads
  const filteredAssignedLeads = (assignedLeads || []).filter((assignedLead) => {
    const assignedPhone = assignedLead.phone;
    return !leads.some((myLead) => myLead.phone === assignedPhone);
  });

  // Compute visible assigned leads
  const visibleAssignedLeads = (filteredAssignedLeads || []).slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Select-all handler
  const handleSelectAllVisible = () => {
    const ids = visibleAssignedLeads.map((l) => String(l._id));
    if (ids.length === 0) return;
    // Could implement selection logic here if needed
  };

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = false;
    }
  }, [visibleAssignedLeads]);

  const handleView = (lead) => setViewLead(lead);
  const handleEdit = (lead) => setEditLead(lead);
  const handleEditAssigned = (lead) => setEditAssignedLead(lead);
  
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:4000/employeelead/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadInterestStatus: newStatus }),
      });
      if (!res.ok) {
        throw new Error("Failed to update status");
      }
      // Update lead in state
      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === leadId ? { ...lead, leadInterestStatus: newStatus } : lead
        )
      );
      console.log(`✅ Lead status updated to: ${newStatus}`);
    } catch (err) {
      console.error("Error updating lead status:", err);
      alert("Failed to update lead status");
    }
  };
  
  const handleEditDestAssigned = async (lead) => {
    console.log("handleEditDestAssigned called with lead:", lead);
    // Mark lead as actioned when employee takes action on routed lead
    try {
      await fetch(`http://localhost:4000/employeelead/action/${lead._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      console.log("✅ Lead marked as actioned");
    } catch (err) {
      console.error("Error marking lead as actioned:", err);
    }
    setEditDestAssignedLead(lead);
  };
  
  const closeModal = () => {
    setViewLead(null);
    setEditLead(null);
    setEditAssignedLead(null);
    setEditDestAssignedLead(null);
    setIsAddModalOpen(false);
  };
  // Save assigned lead as my lead and remove from assigned
  const handleSaveAssignedLead = async (data) => {
    if (!employeeId) throw new Error("Employee ID missing, please login again");
    const assignedLeadId = data.assignmentId; // Use assignmentId from backend response
    
    console.log("💾 Saving assigned lead with assignmentId:", assignedLeadId);
    
    // 1. Check for destination-based routing
    const leadData = { ...data };
    delete leadData._id; // Remove _id so a new one is created
    
    const routingResult = await handleDestinationBasedRouting(leadData, employeeId);
    
    if (!routingResult.routed) {
      // Not routed, add to My Leads
      console.log("➡️ Lead not routed, adding to My Leads");
      const payload = { ...leadData, employee: employeeId, employeeId };
      const res = await fetch("http://localhost:4000/employeelead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create lead");
      }
    } else {
      // Lead was routed to another employee
      console.log("✅ Lead routed to:", routingResult.targetEmployeeName);
    }
    
    // 2. Remove from assigned leads (happens whether routed or not)
    console.log("🗑️ Deleting from assigned leads:", assignedLeadId);
    try {
      const deleteRes = await fetch(`http://localhost:4000/assignlead/${assignedLeadId}`, {
        method: "DELETE",
      });
      if (!deleteRes.ok) {
        console.error("❌ Failed to delete from assigned leads:", deleteRes.status, deleteRes.statusText);
        throw new Error("Failed to remove from assigned leads");
      } else {
        console.log("✅ Successfully deleted from assigned leads");
      }
    } catch (err) {
      console.error("❌ Error removing from assigned leads:", err);
      throw err;
    }
    
    // 3. Immediately update state to remove from assigned leads list
    console.log("📋 Updating state to remove lead from display");
    setAssignedLeads((prev) => {
      const updated = prev.filter((lead) => lead.assignmentId !== assignedLeadId);
      console.log("Assigned leads count - Before:", prev.length, "After:", updated.length);
      return updated;
    });
    
    // 4. Reset pagination
    setCurrentPage(1);
    
    // 5. Refresh My Leads and Destination-Assigned tabs (assignedLeads already updated above)
    console.log("🔄 Refreshing data");
    await Promise.all([fetchLeads(), fetchDestinationAssignedLeads()]);
    
    // 6. Close modal
    setEditAssignedLead(null);
    
    console.log("✅ Transfer complete");
  };

  const handleAddLead = async (data) => {
    if (!employeeId) throw new Error("Employee ID missing, please login again");
    
    // Check for destination-based routing
    const routingResult = await handleDestinationBasedRouting(data, employeeId);
    
    if (routingResult.routed) {
      // Lead was routed to another employee
      console.log("Lead routed:", routingResult.message);
      // No need to add to current employee's leads
    } else {
      // Save to current employee
      const payload = { ...data, employee: employeeId, employeeId };
      const res = await fetch("http://localhost:4000/employeelead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create lead");
      }
    }
    
    await fetchLeads();
  };

  const handleUpdateLead = async (data) => {
    if (!editLead) return;
    
    // Check for destination-based routing
    const routingResult = await handleDestinationBasedRouting(data, employeeId, editLead._id);
    
    if (routingResult.routed) {
      // Lead was routed to another employee
      console.log("Lead routed:", routingResult.message);
      // Remove from current employee's list (the routing function already updated it)
      setLeads((prev) => prev.filter((lead) => lead._id !== editLead._id));
    } else {
      // Update current employee's lead
      const payload = { ...data, employee: employeeId, employeeId };
      const res = await fetch(`http://localhost:4000/employeelead/${editLead._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update lead");
      }
      await fetchLeads();
    }
    
    // refresh assigned leads as well in case edited data appears there
    await fetchAssignedLeads();
    setEditLead(null);
  };

  const handleUpdateDestAssignedLead = async (data) => {
    if (!editDestAssignedLead) return;
    
    try {
      // Check if destination has changed
      const destinationChanged = editDestAssignedLead.destination !== data.destination;
      console.log("🔍 Checking lead update...");
      console.log("Old destination:", editDestAssignedLead.destination);
      console.log("New destination:", data.destination);
      console.log("Destination changed?:", destinationChanged);
      
      if (destinationChanged && data.destination) {
        // DESTINATION HAS CHANGED → Check for transfer
        console.log("🔄 Destination changed, checking for routing...");
        
        // Find employee assigned to the new destination
        const targetEmployee = await findEmployeeByDestination(data.destination, employeeId);
        
        if (targetEmployee && targetEmployee._id !== employeeId) {
          // New destination assigned to DIFFERENT employee → TRANSFER lead
          console.log("✅ Different employee assigned, transferring to:", targetEmployee.fullName);
          
          const payload = {
            ...data,
            employee: targetEmployee._id,
            routedFromEmployee: editDestAssignedLead.routedFromEmployee || employeeId,
            isActioned: false,
          };
          
          const res = await fetch(`http://localhost:4000/employeelead/${editDestAssignedLead._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || "Failed to transfer lead");
          }
          
          console.log("✅ Lead transferred successfully");
          
          // Remove from destination-assigned list
          setDestinationAssignedLeads((prev) => 
            prev.filter((lead) => lead._id !== editDestAssignedLead._id)
          );
          setEditDestAssignedLead(null);
          return;
        } else if (targetEmployee && targetEmployee._id === employeeId) {
          // New destination assigned to SAME employee → MOVE to "My Leads"
          console.log("✅ Same employee assigned to destination, moving to My Leads");
          
          const payload = {
            ...data,
            employee: employeeId,
            routedFromEmployee: null, // Clear routing since it's now personal lead
            isActioned: false,
          };
          
          const res = await fetch(`http://localhost:4000/employeelead/${editDestAssignedLead._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || "Failed to update lead");
          }
          
          console.log("✅ Lead moved to My Leads");
          
          // Remove from destination-assigned list
          setDestinationAssignedLeads((prev) => 
            prev.filter((lead) => lead._id !== editDestAssignedLead._id)
          );
          
          // Refetch "My Leads" to show the newly moved lead
          await fetchLeads();
          setEditDestAssignedLead(null);
          return;
        } else {
          // NO employee assigned to this destination → show error
          console.warn("⚠️ No employee assigned to destination:", data.destination);
          alert(`No employee is assigned to the destination "${data.destination}". Please select a destination with an assigned employee.`);
          return;
        }
      } else {
        // DESTINATION NOT CHANGED → Move to "My Leads" (convert from routed to personal lead)
        console.log("📝 No destination change, moving to My Leads...");
        
        const payload = {
          ...data,
          employee: employeeId,
          routedFromEmployee: null, // Clear routing metadata
          isActioned: false,
        };
        
        const res = await fetch(`http://localhost:4000/employeelead/${editDestAssignedLead._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to update lead");
        }
        
        console.log("✅ Lead moved to My Leads");
        
        // Remove from destination-assigned list
        setDestinationAssignedLeads((prev) => 
          prev.filter((lead) => lead._id !== editDestAssignedLead._id)
        );
        
        // Refetch "My Leads" to show the newly moved lead
        await fetchLeads();
        setEditDestAssignedLead(null);
      }
    } catch (err) {
      console.error("Error updating destination-assigned lead:", err);
      throw err;
    }
  };

  // Confirm transfer of a lead from My Leads to "Transfer to Operation"
  const handleConfirmTransfer = async (lead) => {
    if (!lead || !lead._id) return;
    if (!window.confirm(`Confirm transfer of lead "${lead.name || lead.phone}" to Transfer to Operation?`)) return;

    try {
      // Call backend transfer endpoint which moves the document into Operation collection
      const res = await fetch(`http://localhost:4000/employeelead/transfer/${lead._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert("Failed to transfer lead: " + (data.message || res.statusText));
        return;
      }

      // Update local state: remove from My Leads, add to Transfer list (use returned op document)
      setLeads((prev) => prev.filter((l) => l._id !== lead._id));
      setTransferLeads((prev) => [data.data, ...(prev || [])]);
      alert("Lead transferred to Transfer to Operation.");
    } catch (err) {
      console.error("Error transferring lead:", err);
      alert("Error transferring lead. Check console for details.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="p-4">
      {/* Modern Tab Navigation */}
      <nav className="flex items-center justify-between mb-6">
        <div className="flex space-x-2 bg-white/60 backdrop-blur rounded-full px-2 py-1 shadow-sm">
          <button
            onClick={() => setActiveTab("my-leads")}
            className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'my-leads' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            My Leads
            {activeTab === 'my-leads' && <span className="absolute -bottom-2 left-3 right-3 h-0.5 bg-blue-600 rounded" />}
          </button>

          <button
            onClick={() => setActiveTab("assigned")}
            className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'assigned' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            My Assigned Lead
            {activeTab === 'assigned' && <span className="absolute -bottom-2 left-3 right-3 h-0.5 bg-blue-600 rounded" />}
          </button>

          <button
            onClick={() => setActiveTab("destination-assigned")}
            className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'destination-assigned' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Assigned by Destination
            {activeTab === 'destination-assigned' && <span className="absolute -bottom-2 left-3 right-3 h-0.5 bg-blue-600 rounded" />}
          </button>

          <button
            onClick={() => setActiveTab("transfer")}
            className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'transfer' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Transfer to Operation
            {activeTab === 'transfer' && <span className="absolute -bottom-2 left-3 right-3 h-0.5 bg-blue-600 rounded" />}
          </button>
        </div>
        <div className="hidden sm:block text-sm text-gray-500">&nbsp;</div>
      </nav>

      {/* My Leads Tab */}
      {activeTab === "my-leads" && (
        <>
          <button onClick={() => setIsAddModalOpen(true)} className=" ml-auto flex items-center gap-2 bg-black hover:bg-black text-white px-4 py-2 rounded-lg font-medium transition">
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
                      <div className="flex justify-center gap-2 flex-col sm:flex-row">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleView(lead)} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200" title="View Lead"><Eye size={16} /></button>
                          <button onClick={() => handleEdit(lead)} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200" title="Edit Lead"><Edit2 size={16} /></button>
                          <button onClick={() => handleConfirmTransfer(lead)} className="px-3 py-1 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200" title="Confirm Transfer">Confirm</button>
                        </div>
                        <select
                          value={lead.leadInterestStatus || ""}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                        >
                          <option value="">Select Status</option>
                          <option value="Interested">Interested</option>
                          <option value="Not Interested">Not Interested</option>
                          <option value="Connected">Connected</option>
                          <option value="Not Connected">Not Connected</option>
                          <option value="Follow Up">Follow Up</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>}
          </div>
        </>
      )}

      {/* My Assigned Lead Tab */}
      {activeTab === "assigned" && (
        <>
          {assignedLoading ? (
            <p>Loading assigned leads...</p>
          ) : assignedLeads.length === 0 ? (
            <p className="text-gray-600">You have no assigned leads yet.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
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
                    {visibleAssignedLeads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2 border">{lead.name}</td>
                        <td className="px-4 py-2 border">{lead.email}</td>
                        <td className="px-4 py-2 border">{lead.phone}</td>
                        <td className="px-4 py-2 border">{lead.departureCity || "-"}</td>
                        <td className="px-4 py-2 border">{lead.destination}</td>
                        <td className="px-4 py-2 border">{formatDate(lead.expectedTravelDate)}</td>
                        <td className="px-4 py-2 border text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleView(lead)} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200" title="View Lead"><Eye size={16} /></button>
                            <button onClick={() => handleEditAssigned(lead)} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200" title="Edit Lead"><Edit2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                        {/* Edit Assigned Lead Modal */}
                        {editAssignedLead && (
                          <Modal isOpen={true} onClose={closeModal} size="large">
                            <div className="flex flex-col h-full max-h-[95vh]">
                              <div className="p-4 border-b flex justify-between items-center">
                                <h2 className="text-lg font-bold text-gray-900">Edit Assigned Lead</h2>
                                <button onClick={closeModal} className="text-gray-600 hover:text-gray-800"><X size={20} /></button>
                              </div>
                              <div className="flex-1 overflow-y-auto p-4">
                                <LeadForm
                                  initialData={editAssignedLead}
                                  onSubmit={handleSaveAssignedLead}
                                  onClose={closeModal}
                                  isEditing={true}
                                />
                                <div className="text-xs text-gray-500 mt-2">On save, this lead will move to My Leads and be removed from assigned leads.</div>
                              </div>
                            </div>
                          </Modal>
                        )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="flex items-center justify-between mt-3">
                <div className="text-sm text-gray-600">
                  Showing {Math.min((currentPage - 1) * pageSize + 1, filteredAssignedLeads.length || 0)} to {Math.min(currentPage * pageSize, filteredAssignedLeads.length || 0)} of {filteredAssignedLeads.length || 0} leads
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border'}`}
                  >
                    Previous
                  </button>
                  <div className="text-sm">Page {currentPage} of {Math.max(1, Math.ceil((filteredAssignedLeads.length || 0) / pageSize))}</div>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(Math.max(1, Math.ceil((filteredAssignedLeads.length || 0) / pageSize)), p + 1))}
                    disabled={currentPage >= Math.ceil((filteredAssignedLeads.length || 0) / pageSize)}
                    className={`px-3 py-1 rounded ${currentPage >= Math.ceil((filteredAssignedLeads.length || 0) / pageSize) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}

          {/* Transfer to Operation Tab */}
          {activeTab === "transfer" && (
            <>
              {transferLeads.length === 0 ? (
                <p className="text-gray-600">No leads in Transfer to Operation.</p>
              ) : (
                <>
                  <div className="mt-6 overflow-x-auto">
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
                        {transferLeads.map((lead) => (
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
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}

      {/* Assigned by Destination Tab */}
      {activeTab === "destination-assigned" && (
        <>
          {destAssignedLoading ? (
            <p>Loading destination-assigned leads...</p>
          ) : destinationAssignedLeads.length === 0 ? (
            <p className="text-gray-600">You have no leads assigned by destination yet.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
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
                    {destinationAssignedLeads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2 border">{lead.name}</td>
                        <td className="px-4 py-2 border">{lead.email}</td>
                        <td className="px-4 py-2 border">{lead.phone}</td>
                        <td className="px-4 py-2 border">{lead.departureCity || "-"}</td>
                        <td className="px-4 py-2 border">{lead.destination}</td>
                        <td className="px-4 py-2 border">{formatDate(lead.expectedTravelDate)}</td>
                        <td className="px-4 py-2 border text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleView(lead)} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200" title="View Lead"><Eye size={16} /></button>
                            <button onClick={() => handleEditDestAssigned(lead)} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200" title="Edit Lead"><Edit2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                        {/* Edit Destination Assigned Lead Modal */}
                        {editDestAssignedLead && (
                          <Modal isOpen={true} onClose={closeModal} size="large">
                            <div className="flex flex-col h-full max-h-[95vh]">
                              <div className="p-4 border-b flex justify-between items-center">
                                <h2 className="text-lg font-bold text-gray-900">Edit Lead (Assigned by Destination)</h2>
                                <button onClick={closeModal} className="text-gray-600 hover:text-gray-800"><X size={20} /></button>
                              </div>
                              <div className="flex-1 overflow-y-auto p-4">
                                <LeadForm
                                  initialData={editDestAssignedLead}
                                  onSubmit={handleUpdateDestAssignedLead}
                                  onClose={closeModal}
                                  isEditing={true}
                                />
                                <div className="text-xs text-gray-500 mt-2">This lead was automatically assigned to you based on destination matching.</div>
                              </div>
                            </div>
                          </Modal>
                        )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

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
                isEditing={!!editLead}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* View Lead Modal (read-only form) */}
      {viewLead && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"><X size={20} /></button>
            <h3 className="text-lg font-semibold mb-4 text-center">Lead Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-xs text-gray-600">Name</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.name || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">Email</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.email || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">Phone</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.phone || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">WhatsApp</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.whatsAppNo || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">Departure City</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.departureCity || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">Destination</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.destination || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">Expected Travel Date</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={formatDate(viewLead.expectedTravelDate)} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">No. of Days</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.noOfDays || viewLead.customNoOfDays || "-"} readOnly />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-600">Places To Cover</label>
                <textarea className="w-full px-3 py-1.5 border rounded bg-gray-50" rows={2} value={(viewLead.placesToCoverArray && viewLead.placesToCoverArray.join(", ")) || viewLead.placesToCover || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">No. of Persons</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.noOfPerson || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">No. of Children</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.noOfChild || "-"} readOnly />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-600">Child Ages</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={(viewLead.childAges && viewLead.childAges.length ? viewLead.childAges.join(", ") : "-")} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">Group Number</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.groupNumber || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">Lead Source</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.leadSource || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">Lead Type</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.leadType || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">Trip Type</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.tripType || "-"} readOnly />
              </div>

              <div>
                <label className="block text-xs text-gray-600">Lead Status</label>
                <input className="w-full px-3 py-1.5 border rounded bg-gray-50" value={viewLead.leadStatus || "-"} readOnly />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-600">Notes</label>
                <textarea className="w-full px-3 py-1.5 border rounded bg-gray-50" rows={4} value={viewLead.notes || "-"} readOnly />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeLeads;

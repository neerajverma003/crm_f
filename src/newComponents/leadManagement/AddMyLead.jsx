
import React, { useState, useEffect, useRef } from "react";
import { Plus, AlertCircle, Eye, Edit2, X, MessageSquare } from "lucide-react";
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
  const [allEmployees, setAllEmployees] = useState([]); // 🆕 For superadmin employee dropdown
  const [employeesLoading, setEmployeesLoading] = useState(false); // 🆕

  // UI state: search and filter for My Leads
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [statusSavingId, setStatusSavingId] = useState(null); // Track which lead is saving status
  const [subNavFilter, setSubNavFilter] = useState("all"); // Sub-navbar filter: "all", "follow-up", "interested", etc.
  const [messageModal, setMessageModal] = useState({ isOpen: false, lead: null }); // Track message modal state
  const [messageText, setMessageText] = useState(""); // Message text content
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, lead: null }); // Track details modal state
  const [pendingStatus, setPendingStatus] = useState(null); // { leadId, newStatus } when message required before saving
  const [detailsForm, setDetailsForm] = useState({
    itinerary: "",
    inclusion: "",
    specialInclusions: "",
    exclusion: "",
    tokenAmount: "",
    totalAmount: "",
    advanceRequired: "",
    discount: "",
    totalAirfare: "",
    advanceAirfare: "",
    discountAirfare: ""
  });
  const [viewingPdfUrl, setViewingPdfUrl] = useState(null); // State for PDF viewer modal
  const [assignEmployeeModal, setAssignEmployeeModal] = useState({ isOpen: false, lead: null }); // 🆕 Modal for assigning to employee
  const [selectedEmployeeForAssign, setSelectedEmployeeForAssign] = useState(""); // 🆕

  // Messages UI state for viewing message history
  const [messages, setMessages] = useState([]);
  const [messagesPage, setMessagesPage] = useState(1);
  const [messagesLimit] = useState(10);
  const [messagesHasMore, setMessagesHasMore] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const employeeId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");

  // 🆕 Fetch all employees (for superadmin only)
  const fetchAllEmployees = async () => {
    setEmployeesLoading(true);
    try {
      const res = await fetch("http://localhost:4000/employee/allEmployee");
      if (res.ok) {
        const data = await res.json();
        // Use data.employees like AssignLead does
        const empList = data.employees || data.data || [];
        setAllEmployees(empList);
        console.log("📥 Fetched all employees:", empList);
      } else {
        console.error("Failed to fetch employees:", res.status);
        setAllEmployees([]);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      setAllEmployees([]);
    } finally {
      setEmployeesLoading(false);
    }
  };

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
    // 🆕 Fetch all employees for superadmin
    if (userRole && userRole.toLowerCase() === "superadmin") {
      fetchAllEmployees();
    }
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

  // Filtered leads for the My Leads tab (search by name, destination, phone and filter by interest status)
  const filteredLeads = (leads || []).filter((l) => {
    const q = (searchQuery || "").toString().trim().toLowerCase();
    const matchesSearch = !q || (
      (l.name || "").toString().toLowerCase().includes(q) ||
      (l.destination || "").toString().toLowerCase().includes(q) ||
      (l.phone || "").toString().toLowerCase().includes(q)
    );
    const matchesFilter = !statusFilter || ((l.leadInterestStatus || "").toString() === statusFilter);
    
    // Apply sub-navbar filter
    let matchesSubNav = true;
    if (subNavFilter === "follow-up") {
      matchesSubNav = (l.leadInterestStatus || "").toString() === "Follow Up";
    } else if (subNavFilter === "interested") {
      matchesSubNav = (l.leadInterestStatus || "").toString() === "Interested";
    } else if (subNavFilter === "connected") {
      matchesSubNav = (l.leadInterestStatus || "").toString() === "Connected";
    } else if (subNavFilter === "not-interested") {
      matchesSubNav = (l.leadInterestStatus || "").toString() === "Not Interested";
    } else if (subNavFilter === "not-connected") {
      matchesSubNav = (l.leadInterestStatus || "").toString() === "Not Connected";
    }
    // "all" matches everything
    
    return matchesSearch && matchesFilter && matchesSubNav;
  });

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

  const handleView = (lead) => {
    setViewLead(lead);
    // load first page of messages for this lead
    fetchMessages(lead._id, 1);
  };
  
  // Robust PDF open/download helper (mirrors CreateCustomer behavior)
  const handleOpenPdf = async (url) => {
    if (!url) {
      alert('PDF URL not available');
      return;
    }

    try {
      console.log('Attempting to fetch PDF for inline view:', url);
      const res = await fetch(url);
      if (!res.ok) {
        console.warn('Fetch PDF failed, status:', res.status);
        window.open(url, '_blank');
        return;
      }

      const blob = await res.blob();
      if (blob.size > 0) {
        const blobUrl = window.URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
        // revoke after a while
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60 * 1000);
        return;
      }

      console.warn('Fetched blob empty, opening original URL');
      window.open(url, '_blank');
    } catch (error) {
      console.error('Fetch failed, trying XMLHttpRequest fallback:', error);

      try {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';

        xhr.onload = () => {
          if (xhr.status === 200) {
            const blob = xhr.response;
            if (blob.size > 0) {
              const blobUrl = window.URL.createObjectURL(blob);
              window.open(blobUrl, '_blank');
              setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60 * 1000);
              return;
            } else {
              console.error('Downloaded file is empty');
              window.open(url, '_blank');
            }
          } else {
            console.error('XMLHttpRequest failed with status:', xhr.status);
            window.open(url, '_blank');
          }
        };

        xhr.onerror = () => {
          console.error('XMLHttpRequest error');
          window.open(url, '_blank');
        };

        xhr.open('GET', url);
        xhr.send();
      } catch (xhrError) {
        console.error('XMLHttpRequest also failed, opening original URL:', xhrError);
        window.open(url, '_blank');
      }
    }
  };
  const handleEdit = (lead) => setEditLead(lead);
  const handleEditAssigned = (lead) => setEditAssignedLead(lead);
  
  const handleAddMessage = (lead) => {
    setMessageModal({ isOpen: true, lead });
    setMessageText("");
  };

  const handleAddDetails = async (lead) => {
    try {
      // Fetch full lead details to get pre-stored data
      const res = await fetch(`http://localhost:4000/employeelead/${lead._id}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch lead: ${res.status}`);
      }
      const data = await res.json();
      const fullLead = data.data || lead;
      
      console.log("Fetched lead details:", fullLead);
      console.log("Itinerary:", fullLead.itinerary);
      
      setDetailsModal({ isOpen: true, lead: fullLead });
      setDetailsForm({
        itinerary: fullLead.itinerary || "",
        inclusion: fullLead.inclusion || "",
        specialInclusions: fullLead.specialInclusions || "",
        exclusion: fullLead.exclusion || "",
        tokenAmount: fullLead.tokenAmount || "",
        totalAmount: fullLead.totalAmount || "",
        advanceRequired: fullLead.advanceRequired || "",
        discount: fullLead.discount || "",
        totalAirfare: fullLead.totalAirfare || "",
        advanceAirfare: fullLead.advanceAirfare || "",
        discountAirfare: fullLead.discountAirfare || ""
      });
    } catch (err) {
      console.error("Error fetching lead details:", err);
      // Fallback to just opening modal with current lead
      setDetailsModal({ isOpen: true, lead });
      setDetailsForm({
        itinerary: lead.itinerary || "",
        inclusion: lead.inclusion || "",
        specialInclusions: lead.specialInclusions || "",
        exclusion: lead.exclusion || "",
        tokenAmount: lead.tokenAmount || "",
        totalAmount: lead.totalAmount || "",
        advanceRequired: lead.advanceRequired || "",
        discount: lead.discount || "",
        totalAirfare: lead.totalAirfare || "",
        advanceAirfare: lead.advanceAirfare || "",
        discountAirfare: lead.discountAirfare || ""
      });
    }
  };
  
  const handleStatusChange = async (leadId, newStatus) => {
    // Skip if no status selected
    if (!newStatus) return;

    // If selecting Follow Up, require message first: open message modal and store pending status
    if (newStatus === "Follow Up") {
      const lead = leads.find((l) => l._id === leadId);
      setPendingStatus({ leadId, newStatus });
      setMessageModal({ isOpen: true, lead });
      setMessageText("");
      return;
    }

    // For other statuses, save immediately
    setStatusSavingId(leadId);
    try {
      const res = await fetch(`http://localhost:4000/employeelead/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadInterestStatus: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      setLeads((prev) => prev.map((lead) => (lead._id === leadId ? { ...lead, leadInterestStatus: newStatus } : lead)));
      console.log(`✅ Lead status updated to: ${newStatus}`);
    } catch (err) {
      console.error("Error updating lead status:", err);
      alert("Failed to update lead status");
    } finally {
      setStatusSavingId(null);
    }
  };

  const handleSendMessage = async (leadId) => {
    if (!messageText.trim()) {
      alert("Please enter a message");
      return;
    }

    try {
      // Save message to backend (assuming there's a message endpoint)
      const res = await fetch(`http://localhost:4000/employeelead/${leadId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: messageText,
          sender: employeeId,
          sentAt: new Date().toISOString()
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save message");
      }

      const resJson = await res.json();
      const updatedLeadFromServer = resJson && (resJson.data || resJson);

      console.log("✅ Message saved successfully", updatedLeadFromServer);
      alert("Message saved successfully!");

      // Update local leads state with returned lead (contains messages array)
      if (updatedLeadFromServer && updatedLeadFromServer._id) {
        setLeads((prev) => prev.map((l) => (l._id === updatedLeadFromServer._id ? updatedLeadFromServer : l)));
      }

      // Refresh messages in view (first page)
      fetchMessages(leadId, 1);
      // If there is a pending status (like Follow Up), save it now
      if (pendingStatus && pendingStatus.leadId === leadId) {
        setStatusSavingId(leadId);
        try {
          const r2 = await fetch(`http://localhost:4000/employeelead/${leadId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ leadInterestStatus: pendingStatus.newStatus }),
          });
          if (!r2.ok) throw new Error("Failed to update pending status");
          setLeads((prev) => prev.map((lead) => (lead._id === leadId ? { ...lead, leadInterestStatus: pendingStatus.newStatus } : lead)));
          console.log(`✅ Pending status ${pendingStatus.newStatus} saved for lead ${leadId}`);
        } catch (err) {
          console.error("Error saving pending status:", err);
          alert("Message saved but failed to update status");
        } finally {
          setStatusSavingId(null);
          setPendingStatus(null);
        }
      }
      closeModal();
    } catch (err) {
      console.error("Error saving message:", err);
      // If endpoint doesn't exist yet, just show success for now
      console.log("Message would be saved:", messageText);
      alert("Message saved!");
      // try to save pending status even if message endpoint missing
      if (pendingStatus && pendingStatus.leadId === leadId) {
        try {
          const r2 = await fetch(`http://localhost:4000/employeelead/${leadId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ leadInterestStatus: pendingStatus.newStatus }),
          });
          if (r2.ok) {
            setLeads((prev) => prev.map((lead) => (lead._id === leadId ? { ...lead, leadInterestStatus: pendingStatus.newStatus } : lead)));
            setPendingStatus(null);
          }
        } catch (err2) {
          console.error("Failed to save pending status after message error:", err2);
        }
      }
      closeModal();
    }
  };

  // Fetch paginated messages for a lead (latest first). If append=true, append to existing list.
  const fetchMessages = async (leadId, page = 1, append = false) => {
    if (!leadId) return;
    setMessagesLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/employeelead/${leadId}/messages?page=${page}&limit=${messagesLimit}`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      const json = await res.json();
      const fetched = json.data || [];
      if (append) {
        setMessages((prev) => [...prev, ...fetched]);
      } else {
        setMessages(fetched);
      }
      setMessagesPage(page);
      const total = json.total || 0;
      setMessagesHasMore(page * messagesLimit < total);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const loadMoreMessages = () => {
    if (!viewLead) return;
    const next = messagesPage + 1;
    fetchMessages(viewLead._id, next, true);
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
    setMessageModal({ isOpen: false, lead: null });
    setMessageText("");
    setDetailsModal({ isOpen: false, lead: null });
    setAssignEmployeeModal({ isOpen: false, lead: null }); // 🆕 Close assign modal
    setDetailsForm({
      itinerary: "",
      inclusion: "",
      specialInclusions: "",
      exclusion: "",
      tokenAmount: "",
      totalAmount: "",
      advanceRequired: "",
      discount: "",
      totalAirfare: "",
      advanceAirfare: "",
      discountAirfare: ""
    });
    setPendingStatus(null);
    setSelectedEmployeeForAssign(""); // 🆕
    // reset messages view
    setMessages([]);
    setMessagesPage(1);
    setMessagesHasMore(false);
    setMessagesLoading(false);
  };

  // 🆕 Handle assigning lead to employee (superadmin only)
  const handleAssignToEmployee = async () => {
    if (!selectedEmployeeForAssign || !assignEmployeeModal.lead) {
      alert("Please select an employee");
      return;
    }

    try {
      const leadData = {
        ...assignEmployeeModal.lead,
        employee: selectedEmployeeForAssign,
        employeeId: selectedEmployeeForAssign,
      };

      const res = await fetch(`http://localhost:4000/employeelead/${assignEmployeeModal.lead._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to assign lead");
      }

      alert("Lead assigned successfully to employee!");
      await fetchLeads(); // Refresh the list
      closeModal();
    } catch (err) {
      console.error("Error assigning lead:", err);
      alert("Failed to assign lead: " + err.message);
    }
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, destination or phone"
                className="w-full sm:w-72 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-white"
              >
                <option value="">All Statuses</option>
                <option value="Interested">Interested</option>
                <option value="Not Interested">Not Interested</option>
                <option value="Connected">Connected</option>
                <option value="Not Connected">Not Connected</option>
                <option value="Follow Up">Follow Up</option>
              </select>
              <button onClick={() => { setSearchQuery(""); setStatusFilter(""); }} className="flex items-center gap-2 bg-black hover:bg-black text-white px-3 py-2 rounded-lg font-medium transition">Clear</button>
            </div>

            <div className="flex items-center gap-2">
              {/* <button onClick={() => { setSearchQuery(""); setStatusFilter(""); }} className="text-sm text-gray-500 hover:underline">Clear</button> */}
              <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-black hover:bg-black text-white px-4 py-2 rounded-lg font-medium transition">
                <Plus className="w-4 h-4" /> Add Lead
              </button>
            </div>
          </div>

          {/* Sub-Navbar for Status Filters */}
          <div className="mt-4 flex space-x-2 bg-white/60 backdrop-blur rounded-full px-2 py-1 shadow-sm w-fit">
            <button
              onClick={() => setSubNavFilter("all")}
              className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                subNavFilter === "all"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All
              {subNavFilter === "all" && <span className="absolute -bottom-2 left-3 right-3 h-0.5 bg-blue-600 rounded" />}
            </button>
            <button
              onClick={() => setSubNavFilter("follow-up")}
              className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                subNavFilter === "follow-up"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Follow Up
              {subNavFilter === "follow-up" && <span className="absolute -bottom-2 left-3 right-3 h-0.5 bg-blue-600 rounded" />}
            </button>
            <button
              onClick={() => setSubNavFilter("interested")}
              className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                subNavFilter === "interested"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Interested
              {subNavFilter === "interested" && <span className="absolute -bottom-2 left-3 right-3 h-0.5 bg-blue-600 rounded" />}
            </button>
            <button
              onClick={() => setSubNavFilter("connected")}
              className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                subNavFilter === "connected"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Connected
              {subNavFilter === "connected" && <span className="absolute -bottom-2 left-3 right-3 h-0.5 bg-blue-600 rounded" />}
            </button>
            <button
              onClick={() => setSubNavFilter("not-interested")}
              className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                subNavFilter === "not-interested"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Not Interested
              {subNavFilter === "not-interested" && <span className="absolute -bottom-2 left-3 right-3 h-0.5 bg-blue-600 rounded" />}
            </button>
            <button
              onClick={() => setSubNavFilter("not-connected")}
              className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                subNavFilter === "not-connected"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Not Connected
              {subNavFilter === "not-connected" && <span className="absolute -bottom-2 left-3 right-3 h-0.5 bg-blue-600 rounded" />}
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            {loading ? <p>Loading leads...</p> :
            error || filteredLeads.length === 0 ? <p className="text-gray-600">Please Enter Leads</p> :
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
                {filteredLeads.map((lead) => (
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
                          {lead.leadInterestStatus === "Follow Up" && (
                            <button onClick={() => handleConfirmTransfer(lead)} className="px-3 py-1 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200" title="Confirm Transfer">Confirm</button>
                          )}
                          {lead.leadInterestStatus === "Follow Up" && (
                            <>
                              <button onClick={() => handleAddMessage(lead)} className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200" title="Add Message"><MessageSquare size={16} /></button>
                              <button onClick={() => handleAddDetails(lead)} className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-sm font-medium" title="Add Details">Details</button>
                            </>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <select
                            value={lead.leadInterestStatus || ""}
                            onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                            disabled={statusSavingId === lead._id}
                            className={`px-2 py-1 border rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition ${
                              statusSavingId === lead._id
                                ? 'bg-blue-50 border-blue-400 text-gray-600 cursor-not-allowed opacity-70'
                                : 'border-gray-300'
                            } ${
                              lead.leadInterestStatus ? 'font-semibold text-blue-600' : 'text-gray-500'
                            }`}
                          >
                            <option value="">Select Status</option>
                            <option value="Interested">Interested</option>
                            <option value="Not Interested">Not Interested</option>
                            <option value="Connected">Connected</option>
                            <option value="Not Connected">Not Connected</option>
                            <option value="Follow Up">Follow Up</option>
                          </select>
                          {/* 🆕 Employee assignment dropdown for superadmin only */}
                          {userRole && userRole.toLowerCase() === "superadmin" && (
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  setAssignEmployeeModal({ isOpen: true, lead });
                                  setSelectedEmployeeForAssign(e.target.value);
                                }
                              }}
                              className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 cursor-pointer transition bg-green-50"
                              defaultValue=""
                            >
                              <option value="">Assign to Employee</option>
                              {allEmployees.map((emp) => (
                                <option key={emp._id} value={emp._id}>
                                  {emp.fullName || emp.name || "Unknown"}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
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

              {/* Message history */}
              <div className="sm:col-span-2 mt-2">
                <label className="block text-xs text-gray-600">Messages</label>
                <div className="border rounded bg-white p-3 max-h-48 overflow-y-auto">
                  {messagesLoading && <p className="text-sm text-gray-500">Loading messages...</p>}
                  {!messagesLoading && messages.length === 0 && <p className="text-sm text-gray-500">No messages yet.</p>}
                  {!messagesLoading && messages.map((m, idx) => (
                    <div key={idx} className="mb-2">
                      <div className="text-xs text-gray-500">
                        <span className="font-medium text-gray-700">{m.senderName ? m.senderName : (m.sender === employeeId ? 'You' : (m.sender || 'Unknown'))}</span>
                        <span className="ml-2">• {new Date(m.sentAt).toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">{m.text}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-2">
                  {messagesHasMore && (
                    <button onClick={loadMoreMessages} className="text-sm text-blue-600 hover:underline">Load more</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {messageModal.isOpen && messageModal.lead && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"><X size={20} /></button>
            <h3 className="text-lg font-semibold mb-4 text-center">Add Message for {messageModal.lead.name}</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded p-3 text-sm">
                <p className="text-gray-600"><strong>Phone:</strong> {messageModal.lead.phone}</p>
                <p className="text-gray-600"><strong>Destination:</strong> {messageModal.lead.destination || "-"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value.slice(0, 8000))}
                  placeholder="Type your message here... (max 8000 characters)"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="mt-1 text-xs text-gray-500 text-right">
                  {messageText.length}/8000 characters
                </div>
              </div>

              <div className="flex gap-2 justify-end mt-4">
                <button onClick={closeModal} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium">
                  Cancel
                </button>
                <button onClick={() => handleSendMessage(messageModal.lead._id)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium" disabled={messageText.trim() === ""}>
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModal.isOpen && detailsModal.lead && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto" onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"><X size={20} /></button>
            <h3 className="text-lg font-semibold mb-4 text-center">Add Details for {detailsModal.lead.name}</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded p-3 text-sm">
                <p className="text-gray-600"><strong>Phone:</strong> {detailsModal.lead.phone}</p>
                <p className="text-gray-600"><strong>Destination:</strong> {detailsModal.lead.destination || "-"}</p>
                <p className="text-gray-600"><strong>Travel Date:</strong> {formatDate(detailsModal.lead.expectedTravelDate) || "-"}</p>
              </div>

              {/* Upload Itinerary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Itinerary (PDF)</label>
                {!detailsForm.itinerary ? (
                  <input
                    type="file"
                    accept=".pdf"
                    key={`pdf-${detailsForm.itinerary || 'empty'}`}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const formData = new FormData();
                          formData.append("file", file);
                          formData.append("leadName", detailsModal.lead.name);
                          
                          const res = await fetch("http://localhost:4000/upload", {
                            method: "POST",
                            body: formData,
                          });
                          const data = await res.json();
                          console.log("Upload response:", data);
                          if (res.ok && data.fileUrl) {
                            console.log("Setting itinerary to:", data.fileUrl);
                            setDetailsForm((prev) => ({
                              ...prev,
                              itinerary: data.fileUrl,
                            }));
                          } else {
                            alert("Failed to upload PDF: " + (data.message || res.statusText));
                          }
                        } catch (err) {
                          console.error("Upload error:", err);
                          alert("Error uploading PDF. Check console.");
                        }
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex gap-2 items-center bg-green-50 border border-green-300 rounded-lg p-3">
                    <span className="text-sm text-gray-800 font-medium flex-1 truncate">✓ PDF Uploaded</span>
                    <button
                      type="button"
                      onClick={() => setViewingPdfUrl(detailsForm.itinerary)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDetailsForm({ ...detailsForm, itinerary: "" });
                      }}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Inclusion */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inclusions</label>
                <textarea
                  value={detailsForm.inclusion}
                  onChange={(e) => setDetailsForm({ ...detailsForm, inclusion: e.target.value })}
                  placeholder="List what's included in the package..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Special Inclusions (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Inclusions <span className="text-xs text-gray-500">(optional)</span></label>
                <textarea
                  value={detailsForm.specialInclusions}
                  onChange={(e) => setDetailsForm({ ...detailsForm, specialInclusions: e.target.value })}
                  placeholder="Add any special inclusions or premium offerings..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Exclusion */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exclusions</label>
                <textarea
                  value={detailsForm.exclusion}
                  onChange={(e) => setDetailsForm({ ...detailsForm, exclusion: e.target.value })}
                  placeholder="List what's not included in the package..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Token Amount and Total Amount */}
              <div className="grid grid-cols-2 gap-4">
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Token Amount (₹)</label>
                  <input
                    type="number"
                    value={detailsForm.tokenAmount}
                    onChange={(e) => setDetailsForm({ ...detailsForm, tokenAmount: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Land Package Cost (₹)</label>
                  <input
                    type="number"
                    value={detailsForm.totalAmount}
                    onChange={(e) => setDetailsForm({ ...detailsForm, totalAmount: e.target.value })}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Advance Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Advance Required (₹)</label>
                <input
                  type="number"
                  value={detailsForm.advanceRequired}
                  onChange={(e) => setDetailsForm({ ...detailsForm, advanceRequired: e.target.value })}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount (₹)</label>
                <input
                  type="number"
                  value={detailsForm.discount}
                  onChange={(e) => setDetailsForm({ ...detailsForm, discount: e.target.value })}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Total Calculation - Land Package */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-sm font-semibold text-gray-800 mb-3">Land Package Calculation:</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Land Package Cost:</span>
                    <span className="font-medium">₹ {detailsForm.totalAmount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">- Advance Required:</span>
                    <span className="font-medium">₹ {detailsForm.advanceRequired || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">- Discount:</span>
                    <span className="font-medium">₹ {detailsForm.discount || 0}</span>
                  </div>
                  <div className="border-t border-blue-300 pt-2 flex justify-between">
                    <span className="text-gray-900 font-semibold">Final Amount:</span>
                    <span className="font-bold text-blue-700">₹ {Math.max(0, (parseFloat(detailsForm.totalAmount || 0) - parseFloat(detailsForm.advanceRequired || 0) - parseFloat(detailsForm.discount || 0)).toFixed(2))}</span>
                  </div>
                </div>
              </div>

              {/* Airfare/Train Fare Fields */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Total Airfare / Train Fare Cost</h4>
              </div>

              {/* Total Airfare */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Airfare / Train Fare Cost (₹)</label>
                <input
                  type="number"
                  value={detailsForm.totalAirfare}
                  onChange={(e) => setDetailsForm({ ...detailsForm, totalAirfare: e.target.value })}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Advance Airfare */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Advance Required (₹)</label>
                <input
                  type="number"
                  value={detailsForm.advanceAirfare}
                  onChange={(e) => setDetailsForm({ ...detailsForm, advanceAirfare: e.target.value })}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Discount Airfare */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount (₹)</label>
                <input
                  type="number"
                  value={detailsForm.discountAirfare}
                  onChange={(e) => setDetailsForm({ ...detailsForm, discountAirfare: e.target.value })}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Total Calculation - Airfare */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-sm font-semibold text-gray-800 mb-3">Airfare / Train Fare Calculation:</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Airfare / Train Fare Cost:</span>
                    <span className="font-medium">₹ {detailsForm.totalAirfare || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">- Advance Required:</span>
                    <span className="font-medium">₹ {detailsForm.advanceAirfare || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">- Discount:</span>
                    <span className="font-medium">₹ {detailsForm.discountAirfare || 0}</span>
                  </div>
                  <div className="border-t border-green-300 pt-2 flex justify-between">
                    <span className="text-gray-900 font-semibold">Final Amount:</span>
                    <span className="font-bold text-green-700">₹ {Math.max(0, (parseFloat(detailsForm.totalAirfare || 0) - parseFloat(detailsForm.advanceAirfare || 0) - parseFloat(detailsForm.discountAirfare || 0)).toFixed(2))}</span>
                  </div>
                </div>
              </div>

              {/* Overall Calculation - Land + Airfare */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 mt-4">
                <div className="text-sm font-semibold text-gray-800 mb-3">Overall Calculation (Discount Applied to Total):</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Land Package Cost:</span>
                    <span className="font-medium">₹ {parseFloat(detailsForm.totalAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Airfare / Train Fare Cost:</span>
                    <span className="font-medium">₹ {parseFloat(detailsForm.totalAirfare || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold bg-white bg-opacity-50 px-2 py-1 rounded">
                    <span className="text-gray-800">Combined Total Cost:</span>
                    <span className="text-purple-700">₹ {(parseFloat(detailsForm.totalAmount || 0) + parseFloat(detailsForm.totalAirfare || 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">- Total Advance Collected:</span>
                    <span className="font-medium">₹ {(parseFloat(detailsForm.advanceRequired || 0) + parseFloat(detailsForm.advanceAirfare || 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">- Total Discount:</span>
                    <span className="font-medium">₹ {(parseFloat(detailsForm.discount || 0) + parseFloat(detailsForm.discountAirfare || 0)).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-purple-300 pt-2 flex justify-between">
                    <span className="text-gray-900 font-semibold">Grand Total (Payable):</span>
                    <span className="font-bold text-purple-700">₹ {(
                      Math.max(0, (parseFloat(detailsForm.totalAmount || 0) + parseFloat(detailsForm.totalAirfare || 0)) - (parseFloat(detailsForm.advanceRequired || 0) + parseFloat(detailsForm.advanceAirfare || 0)) - (parseFloat(detailsForm.discount || 0) + parseFloat(detailsForm.discountAirfare || 0)))
                    ).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button onClick={closeModal} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium">
                  Cancel
                </button>
                <button onClick={async () => {
                  try {
                    const res = await fetch(`http://localhost:4000/employeelead/${detailsModal.lead._id}/details`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(detailsForm),
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      alert("Failed to save details: " + (data.message || res.statusText));
                      return;
                    }
                    console.log("Saved lead:", data.lead);
                    // Update local leads state with the updated lead from server
                    setLeads((prev) =>
                      prev.map((l) => (l._id === detailsModal.lead._id ? data.lead : l))
                    );
                    // Also update destination-assigned leads if it exists
                    setDestinationAssignedLeads((prev) =>
                      prev.map((l) => (l._id === detailsModal.lead._id ? data.lead : l))
                    );
                    alert("Details saved successfully!");
                    closeModal();
                  } catch (err) {
                    console.error("Error saving details:", err);
                    alert("Error saving details. Check console for details.");
                  }
                }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium">
                  Save Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal (Google Docs Viewer - same as CreateCustomer) */}
      {viewingPdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Itinerary PDF</h3>
              <button 
                onClick={() => setViewingPdfUrl(null)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-4">
              {(() => {
                const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(viewingPdfUrl)}&embedded=true`;
                return (
                  <div className="border border-gray-300 rounded p-4">
                    <div className="space-y-4">
                      <iframe
                        src={googleViewerUrl}
                        width="100%"
                        height="600px"
                        frameBorder="0"
                        className="rounded"
                        title="PDF Document"
                      />
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => handleOpenPdf(viewingPdfUrl)}
                          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium"
                        >
                          ⬇️ Download PDF
                        </button>
                        <a
                          href={viewingPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition font-medium"
                        >
                          🔗 Open in New Tab
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* 🆕 Assign Employee Modal (Superadmin only) */}
      {assignEmployeeModal.isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Assign Lead to Employee</h2>
              <button onClick={closeModal} className="text-gray-600 hover:text-gray-800"><X size={20} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Lead:</strong> {assignEmployeeModal.lead?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Phone:</strong> {assignEmployeeModal.lead?.phone || "N/A"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
                <select
                  value={selectedEmployeeForAssign}
                  onChange={(e) => setSelectedEmployeeForAssign(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="">-- Choose Employee --</option>
                  {employeesLoading ? (
                    <option disabled>Loading employees...</option>
                  ) : (
                    allEmployees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.fullName || emp.name || "Unknown"}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex gap-2 justify-end mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignToEmployee}
                  disabled={!selectedEmployeeForAssign}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeLeads;

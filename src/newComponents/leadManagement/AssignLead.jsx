import { useState, useEffect } from "react";

export default function AssignLeads() {
  const [employees, setEmployees] = useState([]);
  const [leads, setLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 100; // number of leads per page
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [activeTab, setActiveTab] = useState("assign"); // 'assign' or 'assigned'
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [loadingAssigned, setLoadingAssigned] = useState(false);
  const [assignedIds, setAssignedIds] = useState([]); // ids already assigned to selected employee

  // Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://localhost:4000/employee/allEmployee");
        const data = await res.json();
        if (data.employees) {
          setEmployees(data.employees);
        } else {
          setEmployees([]);
          console.error("Failed to fetch employees:", data.message);
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        setEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch all leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch("http://localhost:4000/leads/");
        const data = await res.json();
        if (data.data) {
          setLeads(data.data);
          // reset to first page when leads change
          setCurrentPage(1);
        } else {
          setLeads([]);
          console.error("Failed to fetch leads:", data.message);
        }
      } catch (err) {
        console.error("Error fetching leads:", err);
        setLeads([]);
      } finally {
        setLoadingLeads(false);
      }
    };
    fetchLeads();
  }, []);

  // adjust current page if leads length changes and current page becomes out of range
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil((leads && leads.length) / pageSize));
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [leads, currentPage]);

  // Handle lead checkbox toggle
  const handleLeadCheck = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  // Assign leads to employee
  const assignLeads = async () => {
    if (!selectedEmployee) {
      alert("Please select an employee.");
      return;
    }
    if (selectedLeads.length === 0) {
      alert("Please select at least one lead.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/assignlead/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: selectedEmployee,
          leadIds: selectedLeads,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Assigned ${selectedLeads.length} lead(s) successfully!`);
        setSelectedLeads([]);
        // switch to Assigned tab and refresh assigned leads for the selected employee
        setActiveTab("assigned");
        fetchAssignedLeads(selectedEmployee);
        // remove assigned leads from the local leads list to show only unassigned data
        setLeads((prev) => prev.filter((l) => !selectedLeads.includes(String(l._id))));
        // update assignedIds cache so UI reflects assignment immediately (normalize to strings)
        setAssignedIds((prev) => Array.from(new Set([...(prev || []).map(String), ...selectedLeads.map(String)])));
      } else {
        alert("Failed to assign leads: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error assigning leads:", err);
      alert("Error assigning leads. Check console for details.");
    }
  };

  // Fetch assigned leads for an employee
  const fetchAssignedLeads = async (employeeId) => {
    if (!employeeId) {
      setAssignedLeads([]);
      return;
    }
    setLoadingAssigned(true);
    try {
      const res = await fetch(`http://localhost:4000/assignlead/${employeeId}`);
      const data = await res.json();
      if (res.ok) {
        const arr = data.data || [];
        setAssignedLeads(arr);
        // normalize ids to strings for consistent comparisons
        setAssignedIds(arr.map((x) => String(x._id)));
      } else {
        console.error('Failed to fetch assigned leads:', data.message);
        setAssignedLeads([]);
      }
    } catch (err) {
      console.error('Error fetching assigned leads:', err);
      setAssignedLeads([]);
    } finally {
      setLoadingAssigned(false);
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Top nav: Assigned Lead first as requested */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setActiveTab("assigned")}
          className={`px-4 py-2 rounded ${activeTab === 'assigned' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
        >
          Assigned Lead
        </button>
        <button
          onClick={() => setActiveTab("assign")}
          className={`px-4 py-2 rounded ${activeTab === 'assign' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
        >
          Assign Leads to Employee
        </button>
      </div>

      {activeTab === 'assign' ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Assign Leads to Employee</h2>

          <label className="block mb-2 font-medium">Select Employee</label>
          {loadingEmployees ? (
            <p>Loading employees...</p>
          ) : (
            <select
              className="w-full border px-3 py-2 rounded mb-5"
              value={selectedEmployee}
              onChange={(e) => {
                const empId = e.target.value;
                setSelectedEmployee(empId);
                // when an employee is selected in Assign tab, fetch their already-assigned leads
                if (empId) fetchAssignedLeads(empId);
              }}
            >
              <option value="">-- Select an Employee --</option>
              {employees?.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.fullName}
                </option>
              ))}
            </select>
          )}

          <h3 className="font-medium mb-2">Select Leads</h3>
          {loadingLeads ? (
            <p>Loading leads...</p>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-3 py-2">Select</th>
                      <th className="border px-3 py-2">Name</th>
                      <th className="border px-3 py-2">Email</th>
                      <th className="border px-3 py-2">Phone</th>
                      <th className="border px-3 py-2">WhatsApp No</th>
                      <th className="border px-3 py-2">Destination</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(
                      // client-side pagination: show only current page items and exclude already-assigned leads
                      (leads || []).filter((l) => !assignedIds.includes(String(l._id)))
                    )
                      .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                      .map((lead) => (
                        <tr key={lead._id}>
                          <td className="border px-3 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={selectedLeads.includes(lead._id)}
                              onChange={() => handleLeadCheck(lead._id)}
                            />
                          </td>
                          <td className="border px-3 py-2">{lead.name}</td>
                          <td className="border px-3 py-2">{lead.email}</td>
                          <td className="border px-3 py-2">{lead.phone}</td>
                          <td className="border px-3 py-2">{lead.whatsAppNo}</td>
                          <td className="border px-3 py-2">{lead.destination}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="flex items-center justify-between mt-3">
                <div className="text-sm text-gray-600">
                  Showing {Math.min((currentPage - 1) * pageSize + 1, leads.length || 0)} to {Math.min(currentPage * pageSize, leads.length || 0)} of {leads.length || 0} leads
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border'}`}
                  >
                    Previous
                  </button>
                  <div className="text-sm">Page {currentPage} of {Math.max(1, Math.ceil((leads.length || 0) / pageSize))}</div>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(Math.max(1, Math.ceil((leads.length || 0) / pageSize)), p + 1))}
                    disabled={currentPage >= Math.ceil((leads.length || 0) / pageSize)}
                    className={`px-3 py-1 rounded ${currentPage >= Math.ceil((leads.length || 0) / pageSize) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white border'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={assignLeads}
            className="mt-5 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Assign Selected Leads
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Assigned Leads</h2>

          <label className="block mb-2 font-medium">Select Employee</label>
          {loadingEmployees ? (
            <p>Loading employees...</p>
          ) : (
            <select
              className="w-full border px-3 py-2 rounded mb-5"
              value={selectedEmployee}
              onChange={(e) => {
                setSelectedEmployee(e.target.value);
                fetchAssignedLeads(e.target.value);
              }}
            >
              <option value="">-- Select an Employee --</option>
              {employees?.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.fullName}
                </option>
              ))}
            </select>
          )}

          {loadingAssigned ? (
            <p>Loading assigned leads...</p>
          ) : (
            <div>
              {assignedLeads.length === 0 ? (
                <p>No assigned leads for the selected employee.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-3 py-2">Name</th>
                        <th className="border px-3 py-2">Email</th>
                        <th className="border px-3 py-2">Phone</th>
                        <th className="border px-3 py-2">WhatsApp No</th>
                        <th className="border px-3 py-2">Destination</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedLeads.map((lead) => (
                        <tr key={lead._id}>
                          <td className="border px-3 py-2">{lead.name}</td>
                          <td className="border px-3 py-2">{lead.email}</td>
                          <td className="border px-3 py-2">{lead.phone}</td>
                          <td className="border px-3 py-2">{lead.whatsAppNo}</td>
                          <td className="border px-3 py-2">{lead.destination}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

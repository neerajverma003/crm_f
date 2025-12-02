import { useState, useEffect } from "react";

export default function AssignLeads() {
  const [employees, setEmployees] = useState([]);
  const [leads, setLeads] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingLeads, setLoadingLeads] = useState(true);

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
      } else {
        alert("Failed to assign leads: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error assigning leads:", err);
      alert("Error assigning leads. Check console for details.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Assign Leads to Employee</h2>

      <label className="block mb-2 font-medium">Select Employee</label>
      {loadingEmployees ? (
        <p>Loading employees...</p>
      ) : (
        <select
          className="w-full border px-3 py-2 rounded mb-5"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
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
              {leads?.map((lead) => (
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
      )}

      <button
        onClick={assignLeads}
        className="mt-5 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
      >
        Assign Selected Leads
      </button>
    </div>
  );
}

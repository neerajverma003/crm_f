import React, { useEffect, useState } from "react";

function AssignDestination() {
  const [employees, setEmployees] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDestinations, setSelectedDestinations] = useState([]);

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:4000/employee/allEmployee", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "api_key": localStorage.getItem("api_key") || "test_key",
        },
      });

      const data = await res.json();
      console.log("EMPLOYEES RESPONSE:", data);

      if (Array.isArray(data.employees)) {
        setEmployees(data.employees);
      } else {
        console.error("Employees not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Fetch all destinations
  const fetchDestinations = async () => {
    try {
      const res = await fetch("http://localhost:4000/employeedestination");

      const data = await res.json();
      console.log("DESTINATIONS RESPONSE:", data);

      if (Array.isArray(data.destinations)) {
        setDestinations(
          data.destinations.map((d) => ({
            id: d._id,
            name: d.destination,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDestinations();
  }, []);

  // Toggle checkbox
  const toggleDestination = (id) => {
    setSelectedDestinations((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  // Submit assignment
  const handleSubmit = async () => {
    if (!selectedEmployee) {
      alert("Please select an employee");
      return;
    }

    if (selectedDestinations.length === 0) {
      alert("Please select at least one destination");
      return;
    }

    try {
      // Call backend assignDestination API
      const res = await fetch("http://localhost:4000/employeedestination/assign-destination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api_key": localStorage.getItem("api_key") || "test_key",
        },
        body: JSON.stringify({
          employeeId: selectedEmployee,
          destinationIds: selectedDestinations, // sending array of destination IDs
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Destination(s) assigned successfully!");
        setSelectedEmployee("");
        setSelectedDestinations([]);
      } else {
        alert(result.message || "Assignment failed");
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Assign Destination to Employee</h2>

      {/* Employee Dropdown */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Select Employee</label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Select Employee --</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.fullName || emp.firstName + " " + emp.lastName}
            </option>
          ))}
        </select>
      </div>

      {/* Destination Checkboxes */}
      {selectedEmployee && (
        <div className="mb-4">
          <label className="block font-semibold mb-2">Select Destinations</label>
          <div className="space-y-2 border p-3 rounded bg-gray-50">
            {destinations.length === 0 ? (
              <p className="text-gray-500">No destinations found.</p>
            ) : (
              destinations.map((d) => (
                <label key={d.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedDestinations.includes(d.id)}
                    onChange={() => toggleDestination(d.id)}
                  />
                  {d.name}
                </label>
              ))
            )}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Assign
      </button>
    </div>
  );
}

export default AssignDestination;

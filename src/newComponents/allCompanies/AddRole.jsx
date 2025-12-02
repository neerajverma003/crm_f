import React, { useEffect, useState } from "react";

const AddRole = () => {
  const [role, setRole] = useState("");
  const [subroles, setSubroles] = useState([{ name: "", points: [""] }]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  // ✅ Fetch all roles
  const fetchRoles = async () => {
    try {
      const res = await fetch("http://localhost:4000/role/getrole");
      const data = await res.json();
      console.log(data)
      const fetchedRoles = Array.isArray(data.data) ? data.data : [];
      setRoles(fetchedRoles);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // ✅ Subrole handlers
  const handleSubroleChange = (index, value) => {
    const updated = [...subroles];
    updated[index].name = value;
    setSubroles(updated);
  };

  const handlePointChange = (subIndex, pointIndex, value) => {
    const updated = [...subroles];
    updated[subIndex].points[pointIndex] = value;
    setSubroles(updated);
  };

  const addSubroleField = () =>
    setSubroles([...subroles, { name: "", points: [""] }]);

  const removeSubroleField = (index) =>
    setSubroles(subroles.filter((_, i) => i !== index));

  const addPointField = (subIndex) => {
    const updated = [...subroles];
    updated[subIndex].points.push("");
    setSubroles(updated);
  };

  const removePointField = (subIndex, pointIndex) => {
    const updated = [...subroles];
    updated[subIndex].points = updated[subIndex].points.filter(
      (_, i) => i !== pointIndex
    );
    setSubroles(updated);
  };

  // ✅ Submit role
  const handleAddRole = async () => {
    if (!role.trim()) return alert("Please enter a role name.");

    setLoading(true);
    try {
      const formattedSubRoles = subroles
        .filter((s) => s.name.trim() !== "")
        .map((s) => ({
          subRoleName: s.name.trim(),
          points: s.points.filter((p) => p.trim() !== ""),
        }));

      const res = await fetch("http://localhost:4000/role/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, subRole: formattedSubRoles }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Role added successfully ✅");
        setRole("");
        setSubroles([{ name: "", points: [""] }]);
        fetchRoles();
      } else {
        alert(data.message || "Failed to add role ❌");
      }
    } catch (error) {
      console.error("Add Role Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index) =>
    setExpandedRow(expandedRow === index ? null : index);

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Add Role, Subrole & Points
      </h2>

      {/* Role Input Form */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Role Name *</label>
          <input
            type="text"
            placeholder="Enter role name (e.g., HR, Manager)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Subroles Section */}
        <div className="flex flex-col gap-3">
          <label className="font-medium text-gray-700">Subroles</label>

          {subroles.map((sub, subIndex) => (
            <div
              key={subIndex}
              className="border border-gray-200 p-4 rounded-lg bg-gray-50"
            >
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  placeholder={`Subrole ${subIndex + 1}`}
                  value={sub.name}
                  onChange={(e) => handleSubroleChange(subIndex, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                {subroles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubroleField(subIndex)}
                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Points */}
              <div className="ml-3">
                <label className="text-sm text-gray-600">Points</label>
                {sub.points.map((point, pointIndex) => (
                  <div key={pointIndex} className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      placeholder={`Point ${pointIndex + 1}`}
                      value={point}
                      onChange={(e) =>
                        handlePointChange(subIndex, pointIndex, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    {sub.points.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removePointField(subIndex, pointIndex)
                        }
                        className="text-red-500 hover:text-red-700 font-bold text-lg"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addPointField(subIndex)}
                  className="mt-2 text-sm text-blue-600 font-medium hover:underline"
                >
                  + Add another point
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSubroleField}
            className="text-sm text-blue-600 font-medium hover:underline self-start"
          >
            + Add another subrole
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={handleAddRole}
          disabled={loading}
          className={`px-6 py-2 rounded-md text-white font-semibold ${
            loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
          } transition-colors`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Roles Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 px-4 py-2 text-left">#</th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Role
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Subroles
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {roles.length > 0 ? (
              roles.map((r, index) => (
                <React.Fragment key={r._id}>
                  <tr
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleExpand(index)}
                  >
                    <td className="border border-gray-200 px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {r.role}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {r.subRole?.length || 0} subroles
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {r.subRole?.reduce(
                        (acc, s) => acc + (s.points?.length || 0),
                        0
                      )}{" "}
                      points
                    </td>
                  </tr>

                  {/* Expanded Details */}
                  {expandedRow === index && (
                    <tr>
                      <td></td>
                      <td
                        colSpan="3"
                        className="border border-gray-200 px-4 py-3 bg-gray-50"
                      >
                        {Array.isArray(r.subRole) && r.subRole.length > 0 ? (
                          <ul className="list-disc pl-5 text-gray-700 space-y-1">
                            {r.subRole.map((sub, i) => (
                              <li key={i}>
                                <span className="font-semibold">
                                  {sub.subRoleName}
                                </span>
                                {sub.points?.length > 0 && (
                                  <ul className="list-circle pl-5 text-gray-600">
                                    {sub.points.map((p, pi) => (
                                      <li key={pi}>{p}</li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">No subroles available</p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-gray-500 py-4 border border-gray-200"
                >
                  No roles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddRole;

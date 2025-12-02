import React, { useState, useEffect } from "react";

const TrainingMaterial = () => {
  const [tutorials, setTutorials] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");

  // Fetch tutorials on component mount
  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const res = await fetch("http://localhost:4000/tutorials/all");
        const data = await res.json();
        setTutorials(data.tutorials || []);

        // Extract unique companies from tutorials
        const uniqueCompanies = Array.from(
          new Map(
            (data.tutorials || []).map((tut) => [tut.company._id, tut.company])
          ).values()
        );
        setCompanies(uniqueCompanies);
      } catch (err) {
        console.error("Failed to fetch tutorials:", err);
      }
    };

    fetchTutorials();
  }, []);

  // Filter tutorials by selected company
  const filteredTutorials = selectedCompany
    ? tutorials.filter((tut) => tut.company._id === selectedCompany)
    : tutorials;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Training Materials</h2>

      {/* Company Filter */}
      <div className="mb-4">
        <label className="font-semibold mr-2">Filter by Company:</label>
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Companies</option>
          {companies.map((c) => (
            <option key={c._id} value={c._id}>
              {c.companyName}
            </option>
          ))}
        </select>
      </div>

      {/* Tutorials List */}
      {filteredTutorials.length === 0 ? (
        <p className="text-center text-gray-500">No tutorials found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTutorials.map((tut) => (
            <div
              key={tut._id}
              className="border border-gray-300 rounded-md p-4 flex flex-col items-center"
            >
              <h3 className="font-semibold mb-2 text-center">{tut.title}</h3>
              <p className="text-sm text-gray-500 mb-2">
                Company: {tut.company.companyName}
              </p>

              {tut.fileType === "image" && (
                <img
                  src={tut.fileUrl}
                  alt={tut.originalName}
                  className="w-full max-h-48 object-cover rounded-md"
                />
              )}

              {tut.fileType === "video" && (
                <video
                  src={tut.fileUrl}
                  controls
                  className="w-full max-h-48 rounded-md"
                />
              )}

              {(tut.fileType === "pdf" || tut.fileType === "ppt") && (
                <a
                  href={tut.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline mt-2"
                >
                  {tut.originalName}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainingMaterial;

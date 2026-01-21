import React, { useState, useEffect } from "react";

const UploadMaterial = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("http://localhost:4000/company/all");
        const data = await res.json();
        const list = Array.isArray(data.companies)
          ? data.companies
          : Array.isArray(data.data)
          ? data.data
          : [];
        setCompanies(list);
      } catch (err) {
        console.error("Failed to fetch companies:", err);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch departments dynamically based on selected company
  const getDepartments = async (companyId) => {
    if (!companyId) {
      setDepartments([]);
      return;
    }

    try {
      const url = `http://localhost:4000/department/department?company=${companyId}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch departments");

      const data = await response.json();

      const finalDepartments = (data.departments || []).map((d) => ({
        _id: d._id,
        dep: d.dep,
      }));

      setDepartments(finalDepartments);
    } catch (err) {
      console.error(err);
      setDepartments([]);
    }
  };

  // Trigger fetching departments when company changes
  useEffect(() => {
    getDepartments(selectedCompany);
    setSelectedDepartment(""); // Reset department selection
  }, [selectedCompany]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !file || !fileType || !selectedCompany || !selectedDepartment) {
      return alert("Please fill all fields!");
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("company", selectedCompany);
      formData.append("department", selectedDepartment);
      formData.append("fileType", fileType);
      formData.append("file", file);

      const res = await fetch("http://localhost:4000/tutorials", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        alert("Tutorial uploaded successfully!");
        setTitle("");
        setFile(null);
        setFileType("");
        setSelectedCompany("");
        setSelectedDepartment("");
        setDepartments([]);
      } else {
        alert(result.message || "Upload failed!");
      }
    } catch (err) {
      console.error("Error uploading tutorial:", err);
      alert("Upload failed!");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Upload Tutorial Material</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label className="block font-semibold mb-1">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Company */}
        <div>
          <label className="block font-semibold mb-1">Company:</label>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Company</option>
            {companies.map((c) => (
              <option key={c._id} value={c._id}>
                {c.companyName}
              </option>
            ))}
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="block font-semibold mb-1">Department:</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.dep}
              </option>
            ))}
          </select>
        </div>

        {/* File Type */}
        <div>
          <label className="block font-semibold mb-1">File Type:</label>
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select File Type</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="pdf">PDF</option>
            <option value="ppt">PPT</option>
          </select>
        </div>

        {/* File */}
        <div>
          <label className="block font-semibold mb-1">File:</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full"
            required
          />
        </div>

        {/* File Preview */}
        {file && fileType === "image" && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="mt-2 max-h-48 w-full object-cover rounded-md"
          />
        )}
        {file && fileType === "video" && (
          <video
            src={URL.createObjectURL(file)}
            controls
            className="mt-2 max-h-48 w-full object-cover rounded-md"
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadMaterial;

// // 📁 src/pages/CompanyDashboard.jsx
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import Sidebar from "../dashboard/CompanySidebar"; // ✅ Import Sidebar

// function CompanyDashboard() {
//   const { id } = useParams(); // Company ID from URL
//   const [company, setCompany] = useState(null);
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ Fetch adminId from localStorage (key: userId)
//   const adminId = localStorage.getItem("userId");

//   useEffect(() => {
//     if (id) fetchCompanyDetails(id);
//   }, [id]);

//   useEffect(() => {
//     if (adminId && id) fetchRoles(adminId, id);
//   }, [adminId, id]);

//   const fetchCompanyDetails = async (companyId) => {
//     try {
//       const res = await axios.get(`http://localhost:4000/company/${companyId}`);
//       console.log("Company API Response:", res.data);
//       if (res.data && res.data.company) {
//         setCompany(res.data.company);
//       } else {
//         console.error("Company not found");
//         setCompany(null);
//       }
//     } catch (error) {
//       console.error("Error fetching company:", error);
//       setCompany(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRoles = async (adminId, companyId) => {
//     try {
//       const res = await axios.get(
//         `http://localhost:4000/getAssignedRoles/${adminId}/${companyId}`
//       );
//       console.log("Assigned Roles API Response:", res.data);
//       if (res.data && res.data.assignedRoles) {
//         setRoles(res.data.assignedRoles);
//       }
//     } catch (error) {
//       console.error("Error fetching roles:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-gray-600 text-lg">Loading company details...</p>
//       </div>
//     );
//   }

//   if (!company) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-red-500 text-lg">Company not found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* 🧭 Sidebar */}
//       <Sidebar roles={roles} />

//       {/* 🧩 Main content */}
//       <main className="flex-1 overflow-y-auto p-8">
//         <div className="bg-white rounded-xl shadow-md p-6">
//           <h1 className="text-3xl font-semibold text-gray-800 mb-4">
//             {company.companyName || company.name}
//           </h1>
//           <p className="text-gray-600 mb-6">
//             Industry: <span className="font-medium">{company.industry || "N/A"}</span>
//           </p>

//           {/* 🧾 Company info grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <p><strong>Email:</strong> {company.email || "N/A"}</p>
//               <p><strong>Phone:</strong> {company.phoneNumber || "N/A"}</p>
//               <p><strong>Website:</strong> {company.website || "N/A"}</p>
//               <p><strong>Status:</strong> {company.status || "Active"}</p>
//             </div>
//             <div className="space-y-2">
//               <p><strong>Address:</strong> {company.address || "N/A"}</p>
//               <p><strong>Employees:</strong> {company.numberOfEmployees || "N/A"}</p>
//               <p>
//                 <strong>Created On:</strong>{" "}
//                 {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : "N/A"}
//               </p>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default CompanyDashboard;





import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function CompanyDashboard() {
  const { id } = useParams(); // Company ID from URL
  const [company, setCompany] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch adminId from localStorage (key: userId)
  const adminId = localStorage.getItem("userId");

  useEffect(() => {
    if (id) fetchCompanyDetails(id);
  }, [id]);

  useEffect(() => {
    if (adminId && id) fetchRoles(adminId, id);
  }, [adminId, id]);

  const fetchCompanyDetails = async (companyId) => {
    try {
      const res = await axios.get(`http://localhost:4000/company/${companyId}`);
      console.log("Company API Response:", res.data);
      if (res.data && res.data.company) {
        setCompany(res.data.company);
      } else {
        console.error("Company not found");
        setCompany(null);
      }
    } catch (error) {
      console.error("Error fetching company:", error);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async (adminId, companyId) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/getAssignedRoles/${adminId}/${companyId}`
      );
      console.log("Assigned Roles API Response:", res.data);
      if (res.data && res.data.assignedRoles) {
        setRoles(res.data.assignedRoles);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-500 text-lg font-semibold">Company not found</p>
          <p className="text-gray-500 mt-2">The requested company could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 📌 Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-1">View and manage company information</p>
      </div>

      {/* 🧩 Company Details Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Company Header */}
        <div className="bg-black  px-6 py-8 text-white">
          <h2 className="text-3xl font-bold mb-2">
            {company.companyName || company.name}
          </h2>
          <p className="text-blue-100">
            Industry: <span className="font-semibold">{company.industry || "Technology"}</span>
          </p>
        </div>

        {/* Company Information Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-500 font-medium">Email</p>
                <p className="text-gray-800 font-semibold">{company.email || "N/A"}</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-500 font-medium">Phone</p>
                <p className="text-gray-800 font-semibold">{company.phoneNumber || "N/A"}</p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-500 font-medium">Website</p>
                <a 
                  href={company.website || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  {company.website || "N/A"}
                </a>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-500 font-medium">Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  company.status === "Active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {company.status || "Active"}
                </span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="text-sm text-gray-500 font-medium">Address</p>
                <p className="text-gray-800 font-semibold">{company.address || "Dwarka Mor"}</p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="text-sm text-gray-500 font-medium">Employees</p>
                <p className="text-gray-800 font-semibold">{company.numberOfEmployees || 30}</p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="text-sm text-gray-500 font-medium">Created On</p>
                <p className="text-gray-800 font-semibold">
                  {company.createdAt 
                    ? new Date(company.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : "29/10/2025"}
                </p>
              </div>
            </div>
          </div>

          {/* Assigned Roles Section */}
          {roles.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Assigned Roles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {roles.map((role, index) => (
                  <div 
                    key={index}
                    className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-blue-800 font-medium"
                  >
                    {role.roleName || role.name || "Unknown SubRole"}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyDashboard;
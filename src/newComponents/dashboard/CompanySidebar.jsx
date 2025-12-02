// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { FiHome, FiBriefcase, FiMenu, FiX } from "react-icons/fi";

// function CompanySidebar({ roles }) {
//   const location = useLocation();
//   const [selectedCompany, setSelectedCompany] = useState(null);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     const storedCompany = localStorage.getItem("selectedCompany");
//     if (storedCompany) {
//       setSelectedCompany(JSON.parse(storedCompany));
//     }
//   }, []);

//   // Close mobile menu when route changes
//   useEffect(() => {
//     setIsMobileMenuOpen(false);
//   }, [location.pathname]);

//   // Map names to routes
//   const generateRoutePath = (point) => {
//     const routeMap = {
//       "lead management": "/lead-management",
//       "user management": "/user-management",
//       "employee list": "/user-management",
//       "attendance": "/attendance",
//       "attendence": "/attendance",
//       "settings": "/settings",
//       "assign lead": "/assignlead",
//       "todays leads": "/todaysleads",
//       "followup leads": "/followupleads",
//       "leaves": "/leaves",
//       "leave management": "/leaves",
//       "daily expenses": "/dailyexpenses",
//       "expense": "/dailyexpenses",
//       "expenses": "/dailyexpenses",
//       "cheque": "/cheque",
//       "assign role": "/assignrole",
//       "add role": "/addrole",
//       "assign company": "/assigncompany",
//       "add admin": "/add-admin",
//       "add user": "/add-user",
//       "department": "/department",
//       "designation": "/designation",
//       "create state": "/createstate",
//       "create destination": "/createdestination",
//       "create hotel": "/createhotel",
//     };

//     const normalized = point.trim().toLowerCase();
//     return routeMap[normalized] || `/${normalized.replace(/\s+/g, "-")}`;
//   };

//   return (
//     <>
//       {/* Mobile Hamburger Button */}
//       <button
//         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
//         aria-label="Toggle menu"
//       >
//         {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//       </button>

//       {/* Overlay for mobile */}
//       {isMobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`
//           fixed lg:relative
//           w-64 bg-white h-screen border-r border-gray-200 shadow-lg 
//           overflow-y-auto transition-all duration-300 z-40
//           ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
//         `}
//       >
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200 bg-black text-white flex items-center gap-3">
//           <div className="flex size-12 items-center justify-center rounded-lg bg-white text-black text-xl font-bold shadow-md">
//             {selectedCompany?.companyName?.[0]?.toUpperCase() || "C"}
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold">
//               {selectedCompany?.companyName || "Company Dashboard"}
//             </h2>
//             <p className="text-gray-300 text-xs mt-1">Company Management</p>
//           </div>
//         </div>

//         {/* Sidebar Content */}
//         <div className="p-4">
//           {/* Dashboard */}
//           <ul className="space-y-2">
//             <li>
//               <Link
//                 to="/dashboard"
//                 className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all ${
//                   location.pathname === "/dashboard"
//                     ? "bg-black text-white shadow-md"
//                     : "text-gray-800 hover:bg-gray-100"
//                 }`}
//               >
//                 <FiHome size={18} />
//                 <span>Dashboard</span>
//               </Link>
//             </li>
//           </ul>

//           {/* Roles (flat list, no dropdowns) */}
//           {roles && roles.length > 0 ? (
//             <ul className="space-y-2 mt-6">
//               {roles.map((role, index) => {
//                 const route = generateRoutePath(role.roleName || role.name);
//                 const isActive = location.pathname === route;

//                 return (
//                   <li key={index}>
//                     <Link
//                       to={route}
//                       className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all ${
//                         isActive
//                           ? "bg-black text-white"
//                           : "text-gray-800 hover:bg-gray-100"
//                       }`}
//                     >
//                       <FiBriefcase size={18} />
//                       <span>{role.roleName || role.name || "Unknown Role"}</span>
//                     </Link>
//                   </li>
//                 );
//               })}
//             </ul>
//           ) : (
//             <div className="text-center py-10 text-gray-400">
//               <svg
//                 className="w-10 h-10 mx-auto mb-3"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                 />
//               </svg>
//               <p className="text-sm">No roles assigned yet.</p>
//             </div>
//           )}
//         </div>
//       </aside>
//     </>
//   );
// }

// export default CompanySidebar;



// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { FiHome, FiBriefcase, FiMenu, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";

// function CompanySidebar({ roles }) {
//   const location = useLocation();
//   const [selectedCompany, setSelectedCompany] = useState(null);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [openDropdowns, setOpenDropdowns] = useState({});

//   useEffect(() => {
//     const storedCompany = localStorage.getItem("selectedCompany");
//     if (storedCompany) {
//       setSelectedCompany(JSON.parse(storedCompany));
//     }
//   }, []);

//   useEffect(() => {
//     setIsMobileMenuOpen(false);
//   }, [location.pathname]);

//   const toggleDropdown = (index) => {
//     setOpenDropdowns((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   const generateRoutePath = (point) => {
//     const routeMap = {
//       "lead management": "/lead-management",
//       "user management": "/user-management",
//       "employee list": "/user-management",
//       "attendance": "/attendance",
//       "attendence": "/attendance",
//       "settings": "/settings",
//       "assign lead": "/assignlead",
//       "todays leads": "/todaysleads",
//       "followup leads": "/followupleads",
//       "leaves": "/leaves",
//       "leave management": "/leaves",
//       "daily expenses": "/dailyexpenses",
//       "expense": "/dailyexpenses",
//       "expenses": "/dailyexpenses",
//       "cheque": "/cheque",
//       "assign role": "/assignrole",
//       "add role": "/addrole",
//       "assign company": "/assigncompany",
//       "add admin": "/add-admin",
//       "add user": "/add-user",
//       "department": "/department",
//       "designation": "/designation",
//       "create state": "/createstate",
//       "create destination": "/createdestination",
//       "create hotel": "/createhotel",
//     };

//     const normalized = point?.trim()?.toLowerCase() || "";
//     return routeMap[normalized] || `/${normalized.replace(/\s+/g, "-")}`;
//   };

//   return (
//     <>
//       {/* Mobile Toggle */}
//       <button
//         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
//         aria-label="Toggle menu"
//       >
//         {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//       </button>

//       {/* Overlay for mobile */}
//       {isMobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed lg:relative w-64 bg-white h-screen border-r border-gray-200 shadow-lg overflow-y-auto transition-all duration-300 z-40 ${
//           isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//         }`}
//       >
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200 bg-black text-white flex items-center gap-3">
//           <div className="flex size-12 items-center justify-center rounded-lg bg-white text-black text-xl font-bold shadow-md">
//             {selectedCompany?.companyName?.[0]?.toUpperCase() || "C"}
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold">
//               {selectedCompany?.companyName || "Company Dashboard"}
//             </h2>
//             <p className="text-gray-300 text-xs mt-1">Company Management</p>
//           </div>
//         </div>

//         {/* Sidebar Content */}
//         <div className="p-4">
//           {/* Dashboard Link */}
//           <ul className="space-y-2">
//             <li>
//               <Link
//                 to="/dashboard"
//                 className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all ${
//                   location.pathname === "/dashboard"
//                     ? "bg-black text-white shadow-md"
//                     : "text-gray-800 hover:bg-gray-100"
//                 }`}
//               >
//                 <FiHome size={18} />
//                 <span>Dashboard</span>
//               </Link>
//             </li>
//           </ul>

//           {/* Roles with dropdowns */}
//           {roles && roles.length > 0 ? (
//             <ul className="space-y-3 mt-6">
//               {roles.map((role, index) => {
//                 const route = generateRoutePath(role.roleName || role.name);
//                 const isActive = location.pathname === route;
//                 const isOpen = openDropdowns[index];

//                 return (
//                   <li key={index}>
//                     <button
//                       onClick={() => toggleDropdown(index)}
//                       className={`flex justify-between items-center w-full px-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
//                         isOpen
//                           ? "bg-black text-white border-black"
//                           : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100"
//                       }`}
//                     >
//                       <div className="flex items-center gap-2">
//                         <FiBriefcase size={18} />
//                         {role.roleName || role.name || "Unknown Role"}
//                       </div>
//                       <span>{isOpen ? <FiChevronUp /> : <FiChevronDown />}</span>
//                     </button>

//                     {/* SubRoles Dropdown */}
//                     {isOpen && role.subRoles?.length > 0 && (
//                       <ul className="ml-4 mt-2 space-y-1 border-l border-gray-300 pl-3">
//                         {role.subRoles.map((sub, i) => {
//                           const subRoute = generateRoutePath(sub.subRoleName);
//                           return (
//                             <li key={i}>
//                               <Link
//                                 to={subRoute}
//                                 className={`block px-3 py-2 rounded-md text-sm transition ${
//                                   location.pathname === subRoute
//                                     ? "bg-gray-900 text-white"
//                                     : "text-gray-700 hover:bg-gray-100"
//                                 }`}
//                               >
//                                 {sub.subRoleName}
//                               </Link>
//                             </li>
//                           );
//                         })}
//                       </ul>
//                     )}
//                   </li>
//                 );
//               })}
//             </ul>
//           ) : (
//             <div className="text-center py-10 text-gray-400">
//               <p className="text-sm">No roles assigned yet.</p>
//             </div>
//           )}
//         </div>
//       </aside>
//     </>
//   );
// }

// export default CompanySidebar;





// import React, { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { FiHome, FiBriefcase, FiMenu, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";

// function CompanySidebar({ roles }) {
//   const location = useLocation();
//   const [selectedCompany, setSelectedCompany] = useState(null);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [openDropdowns, setOpenDropdowns] = useState({});

//   useEffect(() => {
//     const storedCompany = localStorage.getItem("selectedCompany");
//     if (storedCompany) {
//       setSelectedCompany(JSON.parse(storedCompany));
//     }
//   }, []);

//   useEffect(() => {
//     setIsMobileMenuOpen(false);
//   }, [location.pathname]);

//   const toggleDropdown = (index) => {
//     setOpenDropdowns((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   // Map specific subroles to custom routes
//   const customSubRoutes = {
//     "my leads": "/addmylead",
//   };

//   const generateRoutePath = (point) => {
//     if (!point) return "/";
//     const normalized = point.trim().toLowerCase();

//     if (customSubRoutes[normalized]) {
//       return customSubRoutes[normalized];
//     }

//     const routeMap = {
//       "lead management": "/lead-management",
//       "user management": "/user-management",
//       "employee list": "/user-management",
//       "attendance": "/attendance",
//       "attendence": "/attendance",
//       "settings": "/settings",
//       "assign lead": "/assignlead",
//       "todays leads": "/todaysleads",
//       "followup leads": "/followupleads",
//       "leaves": "/leaves",
//       "leave management": "/leaves",
//       "daily expenses": "/dailyexpenses",
//       "expense": "/dailyexpenses",
//       "expenses": "/dailyexpenses",
//       "cheque": "/cheque",
//       "assign role": "/assignrole",
//       "add role": "/addrole",
//       "assign company": "/assigncompany",
//       "add admin": "/add-admin",
//       "add user": "/add-user",
//       "department": "/department",
//       "designation": "/designation",
//       "create state": "/createstate",
//       "create destination": "/createdestination",
//       "create hotel": "/createhotel",
//     };

//     return routeMap[normalized] || `/${normalized.replace(/\s+/g, "-")}`;
//   };

//   return (
//     <>
//       {/* Mobile Toggle */}
//       <button
//         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
//         aria-label="Toggle menu"
//       >
//         {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//       </button>

//       {/* Overlay for mobile */}
//       {isMobileMenuOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed lg:relative w-64 bg-white h-screen border-r border-gray-200 shadow-lg overflow-y-auto transition-all duration-300 z-40 ${
//           isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//         }`}
//       >
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200 bg-black text-white flex items-center gap-3">
//           <div className="flex size-12 items-center justify-center rounded-lg bg-white text-black text-xl font-bold shadow-md">
//             {selectedCompany?.companyName?.[0]?.toUpperCase() || "C"}
//           </div>
//           <div>
//             <h2 className="text-lg font-semibold">
//               {selectedCompany?.companyName || "Company Dashboard"}
//             </h2>
//             <p className="text-gray-300 text-xs mt-1">Company Management</p>
//           </div>
//         </div>

//         {/* Sidebar Content */}
//         <div className="p-4">
//           {/* Dashboard Link */}
//           <ul className="space-y-2">
//             <li>
//               <Link
//                 to="/dashboard"
//                 className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all ${
//                   location.pathname === "/dashboard"
//                     ? "bg-black text-white shadow-md"
//                     : "text-gray-800 hover:bg-gray-100"
//                 }`}
//               >
//                 <FiHome size={18} />
//                 <span>Dashboard</span>
//               </Link>
//             </li>
//           </ul>

//           {/* Roles with dropdowns */}
//           {roles && roles.length > 0 ? (
//             <ul className="space-y-3 mt-6">
//               {roles.map((role, index) => {
//                 const isOpen = openDropdowns[index];
//                 return (
//                   <li key={index}>
//                     <button
//                       onClick={() => toggleDropdown(index)}
//                       className={`flex justify-between items-center w-full px-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
//                         isOpen
//                           ? "bg-black text-white border-black"
//                           : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100"
//                       }`}
//                     >
//                       <div className="flex items-center gap-2">
//                         <FiBriefcase size={18} />
//                         {role.roleName || role.name || "Unknown Role"}
//                       </div>
//                       <span>{isOpen ? <FiChevronUp /> : <FiChevronDown />}</span>
//                     </button>

//                     {/* SubRoles Dropdown */}
//                     {isOpen && role.subRoles?.length > 0 && (
//                       <ul className="ml-4 mt-2 space-y-1 border-l border-gray-300 pl-3">
//                         {role.subRoles.map((sub, i) => {
//                           const subRoute = generateRoutePath(sub.subRoleName);
//                           return (
//                             <li key={i}>
//                               <Link
//                                 to={subRoute}
//                                 className={`block px-3 py-2 rounded-md text-sm transition ${
//                                   location.pathname === subRoute
//                                     ? "bg-gray-900 text-white"
//                                     : "text-gray-700 hover:bg-gray-100"
//                                 }`}
//                               >
//                                 {sub.subRoleName}
//                               </Link>
//                             </li>
//                           );
//                         })}
//                       </ul>
//                     )}
//                   </li>
//                 );
//               })}
//             </ul>
//           ) : (
//             <div className="text-center py-10 text-gray-400">
//               <p className="text-sm">No roles assigned yet.</p>
//             </div>
//           )}
//         </div>
//       </aside>
//     </>
//   );
// }

// export default CompanySidebar;




import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiBriefcase, FiMenu, FiX, FiChevronDown, FiChevronUp, FiLock } from "react-icons/fi";

function CompanySidebar({ roles }) {
  const location = useLocation();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    const storedCompany = localStorage.getItem("selectedCompany");
    if (storedCompany) setSelectedCompany(JSON.parse(storedCompany));
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleDropdown = (index) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Map specific subroles to custom routes
//   const customSubRoutes = {
//     "my leads": "/addmylead",
//   };

// const routeMap = {
//   "lead management": "/lead-management",
//   "user management": "/user-management",
//   "employee list": "/user-management",
//   attendance: "/attendance",
//   attendence: "/attendance",
//   settings: "/settings",
//   "assign lead": "/assignlead",
//   "todays leads": "/todaysleads",
//   "followup leads": "/followupleads",
//   leaves: "/leaves",
//   "leave management": "/leaves",
//   "daily expenses": "/dailyexpenses",
//   expense: "/dailyexpenses",
//   expenses: "/dailyexpenses",
//   cheque: "/cheque",              // keep this
//   "cheque entry": "/cheque",      // <-- add this
//   "assign role": "/assignrole",
//   "add role": "/addrole",
//   "assign company": "/assigncompany",
//   "add admin": "/add-admin",
//   "add user": "/add-user",
//   department: "/department",
//   designation: "/designation",
//   "Add state": "/createstate",
//   "Add destination": "/createdestination",
//   "Add hotel": "/createhotel",
// };


//   const generateRoutePath = (subRoleName) => {
//     if (!subRoleName) return "/";
//     const normalized = subRoleName.trim().toLowerCase();
//     return customSubRoutes[normalized] || routeMap[normalized] || `/${normalized.replace(/\s+/g, "-")}`;
//   };


const generateRoutePath = (subRoleName) => {
  if (!subRoleName) return "/";
  const normalized = subRoleName.trim().toLowerCase(); // case-insensitive match

  // Map lowercased subRole names to URLs
  const lowerCaseRouteMap = {
    "lead management": "/lead-management",
    "user management": "/user-management",
    "employee list": "/user-management",
    attendance: "/attendance",
    attendence: "/attendance",
    settings: "/settings",
    "assign lead": "/assignlead",
    "todays leads": "/todaysleads",
    "followup leads": "/followupleads",
    leaves: "/leaves",
    "leave management": "/leaves",
    "daily expenses": "/dailyexpenses",
    expense: "/dailyexpenses",
    expenses: "/dailyexpenses",
    cheque: "/cheque",
    "cheque entry": "/cheque",
    "assign role": "/assignrole",
    "add role": "/addrole",
    "assign company": "/assigncompany",
    "add admin": "/add-admin",
    "add user": "/add-user",
    department: "/department",
    designation: "/designation",
    "add state": "/createstate",
    "add destination": "/createdestination",
    "add hotel": "/createhotel",
    "add transport": "/createtransport",
    "customer creation": "/customer-creation",
    "customer data": "/customer-data",
  };

  // Custom subroutes
  const customSubRoutes = {
    "my leads": "/addmylead",
  };

  return customSubRoutes[normalized] || lowerCaseRouteMap[normalized] || `/${normalized.replace(/\s+/g, "-")}`;
};


  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative w-64 bg-white h-screen border-r border-gray-200 shadow-lg overflow-y-auto transition-transform duration-300 z-40 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-black text-white flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white text-black text-xl font-bold shadow-md">
            {selectedCompany?.companyName?.[0]?.toUpperCase() || "C"}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{selectedCompany?.companyName || "Company Dashboard"}</h2>
            <p className="text-gray-300 text-xs mt-1">Company Management</p>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="p-4">
          {/* Dashboard Link */}
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all ${
                  location.pathname === "/dashboard"
                    ? "bg-black text-white shadow-md"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                <FiHome size={18} />
                <span>Dashboard</span>
              </Link>
            </li>
          </ul>

          {/* Roles with dropdowns */}
          {roles && roles.length > 0 ? (
            <ul className="space-y-3 mt-6">
              {roles.map((role, index) => {
                const isOpen = openDropdowns[index];
                return (
                  <li key={index}>
                    <button
                      onClick={() => toggleDropdown(index)}
                      className={`flex justify-between items-center w-full px-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                        isOpen
                          ? "bg-black text-white border-black"
                          : "bg-white border-gray-300 text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FiBriefcase size={18} />
                        {role.roleName || role.name || "Unknown Role"}
                      </div>
                      <span>{isOpen ? <FiChevronUp /> : <FiChevronDown />}</span>
                    </button>

                    {/* SubRoles Dropdown */}
                    {isOpen && role.subRoles?.length > 0 && (
                      <ul className="ml-4 mt-2 space-y-1 border-l border-gray-300 pl-3">
                        {role.subRoles.map((sub, i) => {
                          const subRoute = generateRoutePath(sub.subRoleName);
                          return (
                            <li key={i}>
                              <Link
                                to={subRoute}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-sm transition ${
                                  location.pathname.startsWith(subRoute)
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {sub.subRoleName}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <p className="text-sm">No roles assigned yet.</p>
            </div>
          )}

          {/* Account actions */}
          <div className="mt-8 border-t border-gray-200 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Account</p>
            <Link
              to="/change-password"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition ${
                location.pathname === "/change-password"
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-800 hover:bg-gray-100"
              }`}
            >
              <FiLock size={18} />
              Change Password
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

export default CompanySidebar;

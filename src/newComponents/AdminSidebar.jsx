import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiUserPlus,
  FiClock,
  FiBriefcase,
  FiSettings,
  FiMenu,
  FiX,
  FiDollarSign,
  FiChevronDown,
  FiChevronUp,
  FiLock,
  FiLogOut,
} from "react-icons/fi";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [department, setDepartment] = useState("");
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [adminData, setAdminData] = useState(null);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [selectedSubRole, setSelectedSubRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    if (storedRole) {
      const lowerRole = storedRole.toLowerCase();
      setRole(lowerRole);
      console.log("Role set to:", lowerRole);
    }
    if (userId && storedRole) {
      fetchDepartment(userId, storedRole.toLowerCase());
      if (storedRole.toLowerCase() === "admin") {
        fetchAdminRolesAndCompanies(userId);
      }
    }
  }, []);

  const fetchDepartment = async (userId, role) => {
    if (role === "admin") {
      setDepartment("Admin");
      return;
    }
    setDepartment("N/A"); // Only superadmin has sidebar
  };

  const fetchAdminRolesAndCompanies = async (userId) => {
    setLoadingCompanies(true);
    try {
      const response = await fetch(`http://localhost:4000/getassignedroles/${userId}`);
      const data = await response.json();
      
      if (data.admin) {
        setAdminData(data.admin);
        console.log("Fetched admin data:", data.admin);
      }
    } catch (error) {
      console.error("Error fetching admin roles and companies:", error);
      setAdminData(null);
    } finally {
      setLoadingCompanies(false);
    }
  };

  // 🔹 Build company dropdown items with roles and subroles nested
  const buildCompanyDropdowns = () => {
    if (!adminData || !adminData.assignedRoles || adminData.assignedRoles.length === 0) {
      return [];
    }

    // Group roles and subroles by company
    const companyMap = {};
    
    adminData.assignedRoles.forEach((roleAssignment) => {
      if (roleAssignment.companyIds && Array.isArray(roleAssignment.companyIds)) {
        roleAssignment.companyIds.forEach((company) => {
          const companyId = company._id || company;
          const companyName = company.companyName || "Unknown Company";
          
          if (!companyMap[companyId]) {
            companyMap[companyId] = {
              id: companyId,
              name: companyName,
              rolesMap: {} // Use object to group subroles by role
            };
          }
          
          // Add role with its sub-roles
          if (roleAssignment.roleId) {
            const roleId = roleAssignment.roleId._id;
            const roleLabel = roleAssignment.roleId.role || "Unknown Role";
            
            if (!companyMap[companyId].rolesMap[roleId]) {
              companyMap[companyId].rolesMap[roleId] = {
                id: roleId,
                label: roleLabel,
                subroles: [],
                roleObj: roleAssignment.roleId // Store the full role object to access subRole array
              };
            }
            
            // Add sub-roles for this role
            // Extract subRole names from the Role's subRole array
            if (roleAssignment.subRoles && Array.isArray(roleAssignment.subRoles)) {
              roleAssignment.subRoles.forEach((subRoleId) => {
                let subRoleName = "Unknown SubRole";
                let finalSubRoleId = subRoleId;
                
                // If roleObj has subRole array, find the matching subRole by ID
                if (roleAssignment.roleId.subRole && Array.isArray(roleAssignment.roleId.subRole)) {
                  const foundSubRole = roleAssignment.roleId.subRole.find(
                    (sr) => sr._id === subRoleId || sr._id.toString() === subRoleId.toString()
                  );
                  
                  if (foundSubRole) {
                    subRoleName = foundSubRole.subRoleName || "Unknown SubRole";
                    finalSubRoleId = foundSubRole._id;
                  }
                }
                
                // Avoid duplicates
                const isDuplicate = companyMap[companyId].rolesMap[roleId].subroles.some(
                  sr => sr.id === finalSubRoleId || sr.id.toString() === finalSubRoleId.toString()
                );
                
                if (!isDuplicate) {
                  companyMap[companyId].rolesMap[roleId].subroles.push({
                    id: finalSubRoleId,
                    label: subRoleName,
                    url: "#"
                  });
                }
              });
            }
          }
        });
      }
    });

    console.log("Company Map:", companyMap);
    console.log("Admin Data:", adminData);

    // Convert to array of dropdown items with proper nesting
    return Object.values(companyMap).map((company) => ({
      id: `company-${company.id}`,
      label: company.name,
      icon: <FiBriefcase size={20} />,
      type: "dropdown",
      children: Object.values(company.rolesMap).map((role) => ({
        id: `role-${role.id}`,
        label: role.label,
        type: role.subroles.length > 0 ? "dropdown" : undefined,
        url: role.subroles.length === 0 ? "#" : undefined,
        children: role.subroles.length > 0 ? role.subroles : undefined
      }))
    }));
  };
  
  // 🔹 Sidebar items
  const allItems = loadingCompanies 
    ? [{ id: "loading", label: "Loading Companies...", icon: <FiBriefcase size={20} />, url: "#" }]
    : [
        // Dashboard at the top
        { id: "dashboard", label: "Dashboard", icon: <FiGrid size={20} />, url: "/dashboard" },
        // Companies and roles follow
        ...buildCompanyDropdowns()
      ];
//   const allItems = [
//     // 1️⃣ Dashboard
//     { id: 1, label: "Dashboard", icon: <FiGrid size={20} />, url: "/dashboard" },

//     // 2️⃣ Lead Dashboard
//     {
//       id: 2,
//       label: "Lead Dashboard",
//       icon: <FiUsers size={20} />,
//       type: "dropdown",
//       url: "/lead-management",
//       children: [
//         { id: "2-1", label: "Lead Management", url: "/lead-management" },
//         { id: "2-2", label: "Assign Lead", url: "/assignlead" },
//         { id: "2-3", label: "My Leads", url: "/addmylead" },
//         { id: "2-4", label: "Today's Leads", url: "/todaysleads" },
//         { id: "2-5", label: "Follow-Up Leads", url: "/followupleads" },
//         { id: "2-6", label: "Lead Reports", url: "/leadreports" },
//         { id: "2-7", label: "Assign Destination", url: "/assigndestination" },
//       ],
//     },

//     // 3️⃣ Company Overview
//     { id: 3, label: "Company Overview", icon: <FiBriefcase size={20} />, url: "/company-overview" },

//     // 4️⃣ Companies
//     {
//       id: 4,
//       label: "Companies",
//       icon: <FiBriefcase size={20} />,
//       type: "dropdown",
//       children: [
//         { id: "4-1", label: "All Companies", url: "/companies" },
//         { id: "4-2", label: "Department", url: "/department" },
//         { id: "4-3", label: "Designation", url: "/designation" },
//         { id: "4-4", label: "Add Role", url: "/addrole" },
//       ],
//     },

//     // 5️⃣ Tutorials
//     {
//       id: 5,
//       label: "Tutorials",
//       icon: <FiBriefcase size={20} />,
//       type: "dropdown",
//       children: [
//         { id: "5-1", label: "Upload Material", url: "/upload-material" },
//         { id: "5-2", label: "Training Material", url: "/training-material" },
//       ],
//     },

//     // 6️⃣ Admin Management (Standalone outside HRMS)
//     {
//       id: 6,
//       label: "Admin Management",
//       icon: <FiUsers size={20} />,
//       type: "dropdown",
//       url: "/admin-management",
//       children: [
//         { id: "6-1", label: "Add Admin", url: "/add-admin" },
//         { id: "6-2", label: "Assign Role", url: "/assignrole" },
//         { id: "6-3", label: "Assign Company", url: "/assigncompany" },
//         { id: "6-4", label: "Assigned Roles", url: "/assigned-roles" },
//       ],
//     },

//     // 7️⃣ HRMS (NEW SECTION)
//     {
//       id: 7,
//       label: "HRMS",
//       icon: <FiUsers size={20} />,
//       type: "dropdown",
//       children: [
//         // 1️⃣ User Management
//         { id: "hrms-1", label: "User Management", url: "/user-management" },

//         // 2️⃣ Attendance
//         { id: "hrms-2", label: "Attendance", url: "/attendance" },

//         // 3️⃣ Employee Management
//         { 
//           id: "hrms-3", 
//           label: "Employee Management", 
//           url: "/employee-management", 
//           type: "dropdown", 
//           children: [
//             { id: "hrms-3-1", label: "Add Employee", url: "/user-management" },
//             { id: "hrms-3-2", label: "Assign Company", url: "/employeecompany" },
//             { id: "hrms-3-3", label: "Assign Role", url: "/assignemployeerole" },
//             { id: "hrms-3-4", label: "Create Destination", url: "/createdestinationemployee" },
//           ] 
//         },

//         // 4️⃣ Leave Management
//         { id: "hrms-4", label: "Leave Management", url: "/leaves" },

//         // 5️⃣ Data Management
//         { 
//           id: "hrms-5", 
//           label: "Data Management", 
//           url: "/data-management", 
//           type: "dropdown",
//           children: [
//             { id: "hrms-5-1", label: "Import Data", url: "/import-data" },
//             { id: "hrms-5-2", label: "Export Data", url: "/export-data" },
//           ]
//         },

//         // 6️⃣ Pay Roll
//         { 
//           id: "hrms-6", 
//           label: "Pay Roll", 
//           url: "/payroll", 
//           type: "dropdown",
//           children: [
//             { id: "hrms-6-1", label: "Salary Management", url: "/salary-management" },
//             { id: "hrms-6-2", label: "Generate Payslip", url: "/generate-payslip" },
//           ]
//         },

//         // 7️⃣ Report
//         { 
//           id: "hrms-7", 
//           label: "Report", 
//           url: "/report", 
//           type: "dropdown",
//           children: [
//             { id: "hrms-7-1", label: "Attendance Report", url: "/attendance-report" },
//             { id: "hrms-7-2", label: "Employee Report", url: "/employee-report" },
//             { id: "hrms-7-3", label: "Leave Report", url: "/leave-report" },
//           ]
//         },
//       ],
//     },

//     // Other sections (commented out for now)
//     // 🔹 Lead Dashboard
//     // {
//     //   id: 2,
//     //   label: "Lead Dashboard",
//     //   icon: <FiUsers size={20} />,
//     //   type: "dropdown",
//     //   url: "/lead-management",
//     //   children: [...]
//     // },

//     // 🔹 Itinerary
//     {
//       id: 8.1,
//       label: "Itianary",
//       icon: <FiBriefcase size={20} />,
//       type: "dropdown",
//       children: [
//         { id: "8-1", label: "Add Itinerary", url: "/add-itinerary" },
//         { id: "8-2", label: "All Itinerary", url: "/all-itinerary" },
//       ],
//     },

//     // 🔹 Teams
//     {
//       id: 8.2,
//       label: "Teams",
//       icon: <FiBriefcase size={20} />,
//       type: "dropdown",
//       children: [
//         { id: "b2b-1", label: "All Team", url: "/all-team" },
//         { id: "b2b-1", label: "Create Team", url: "/create-team" },
//         { id: "b2b-2", label: "Assign Team", url: "/b2b-addcompany" },
//       ],
//     },

//     // 🔹 B2B
//     {
//       id: 8.5,
//       label: "B2B",
//       icon: <FiBriefcase size={20} />,
//       type: "dropdown",
//       children: [
//         { id: "b2b-1", label: "Destination", url: "/b2b-destination" },
//         { id: "b2b-2", label: "Add Company", url: "/b2b-addcompany" },
//         { id: "b2b-3", label: "Company Leads", url: "/b2b-company-leads" },
//       ],
//     },

//     // 🔹 Accounts
//     {
//       id: 9,
//       label: "Accounts",
//       icon: <FiDollarSign size={20} />,
//       type: "dropdown",
//       children: [
//         { id: "9-1", label: "Daily Expense", url: "/dailyexpenses" },
//         { id: "9-2", label: "Cheque Expense", url: "/cheque" },
//       ],
//     },

//     // 🔹 All User Report
//     {
//       id: 9.5,
//       label: "All User Report",
//       icon: <FiUsers size={20} />,
//       type: "dropdown",
//       children: [
//         { id: "9-5-1", label: "User Data Reports", url: "/user-data-reports" },
//       ],
//     },

//     // 🔹 Operations
//     {
//       id: 10,
//       label: "Operations",
//       icon: <FiBriefcase size={20} />,
//       type: "dropdown",
//       children: [
//         { id: "10-1", label: "Create State", url: "/createstate" },
//         { id: "10-2", label: "Create Destination", url: "/createdestination" },
//         { id: "10-3", label: "Create Hotel", url: "/createhotel" },
//         { id: "10-4", label: "Create Transport", url: "/createtransport" },
//         { id: "10-5", label: "Customer Creation", url: "/customer-creation" },
//         { id: "10-6", label: "Customer Data", url: "/customer-data" },
//         { id: "10-7", label: "Invoice Creation", url: "/createinvoice" },
//         { id: "10-8", label: "Invoice List", url: "/invoicelist" },
//       ],
//     },

//     { id: 11, label: "Settings", icon: <FiSettings size={20} />, url: "/settings" },
//     { id: 12, label: "Change Password", icon: <FiLock size={20} />, url: "/change-password" },
//   ];

  // 🔹 Only render sidebar for superadmin
  if (role !== "admin") return null;

  const toggleDropdown = (label) => {
    setOpenDropdowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // 🔹 Sidebar content
  const SidebarContent = () => (
    <div className="flex flex-col w-full h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header - Professional Logo Section */}
      <div className="relative px-6 py-8 border-b border-blue-200/60">
        <div className="flex items-center gap-3 select-none group">
          {/* Professional Logo */}
          <div className="flex size-12 items-center justify-center rounded-[12px] bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg shadow-lg shadow-blue-500/35 group-hover:shadow-xl group-hover:shadow-blue-500/50 transition-all duration-300 transform group-hover:scale-110">
            C
          </div>
          
          {/* Brand Text */}
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-gray-900 tracking-tight leading-tight">CRM PRO</h2>
            <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">Management</p>
          </div>
        </div>
        
        {/* Decorative line */}
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent"></div>
      </div>

      {/* Navigation Container */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 scrollbar-hide">
        <div className="space-y-0.5">
          {allItems?.map((item) => (
            <React.Fragment key={item.id}>
              {item.type === "dropdown" ? (
                <NavDropdownItem 
                  item={item} 
                  openDropdowns={openDropdowns}
                  toggleDropdown={toggleDropdown}
                  setIsOpen={setIsOpen}
                />
              ) : (
                <NavMenuItem item={item} setIsOpen={setIsOpen} />
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>

      {/* Professional Footer */}
      <div className="px-4 py-4 border-t border-blue-200/60 bg-gradient-to-t from-blue-50/60 to-transparent">
        <div className="h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent rounded-full"></div>
      </div>
    </div>
  );

  // 🔹 Dropdown Menu Item Component
  const NavDropdownItem = ({ item, openDropdowns, toggleDropdown, setIsOpen }) => (
    <li className="group">
      <button
        onClick={() => toggleDropdown(item.label)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-[9px] text-gray-800 hover:text-blue-700 bg-transparent hover:bg-blue-100/40 transition-all duration-200 relative"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="flex items-center justify-center min-w-max text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
            {item.icon}
          </span>
          <span className="text-sm font-bold truncate group-hover:text-blue-700 transition-colors text-gray-800">{item.label}</span>
        </div>
        <span className={`ml-2 text-gray-500 group-hover:text-blue-600 transition-all duration-300 transform ${openDropdowns[item.label] ? "rotate-180" : ""}`}>
          <FiChevronDown size={16} />
        </span>
      </button>

      {/* Dropdown Children */}
      {openDropdowns[item.label] && (
        <ul className="mt-1 ml-3 pl-4 border-l-2 border-blue-300/60 space-y-0 animate-slideDown">
          {item.children.map((child) => (
            <React.Fragment key={child.id}>
              {child.type === "dropdown" ? (
                <NestedDropdownItem 
                  item={child} 
                  openDropdowns={openDropdowns}
                  toggleDropdown={toggleDropdown}
                  setIsOpen={setIsOpen}
                />
              ) : (
                <li>
                  <NavLink
                    to={child.url}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block px-3.5 py-2 rounded-[7px] text-xs font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-blue-200/50 text-blue-800 border border-blue-400/60 shadow-sm"
                          : "text-gray-700 hover:text-gray-900 hover:bg-blue-100/30"
                      }`
                    }
                  >
                    {child.label}
                  </NavLink>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      )}
    </li>
  );

  // 🔹 Nested Dropdown Item Component
  const NestedDropdownItem = ({ item, openDropdowns, toggleDropdown, setIsOpen }) => (
    <li className="group">
      <button
        onClick={() => toggleDropdown(item.label)}
        className="w-full flex items-center justify-between px-3.5 py-2 rounded-[7px] text-xs text-gray-700 hover:text-blue-700 hover:bg-blue-100/30 transition-all duration-200"
      >
        <span className="font-bold truncate text-gray-800">{item.label}</span>
        <span className={`text-gray-500 hover:text-blue-600 transition-all duration-300 transform ${openDropdowns[item.label] ? "rotate-180" : ""}`}>
          <FiChevronDown size={13} />
        </span>
      </button>

      {/* Nested Children */}
      {openDropdowns[item.label] && item.children && (
        <ul className="mt-0.5 ml-3 pl-3 border-l border-blue-300/50 space-y-0 animate-slideDown">
          {item.children.map((grandchild) => (
            <li key={grandchild.id}>
              <button
                onClick={() => {
                  const subRoleData = {
                    subRoleId: grandchild.id,
                    subRoleName: grandchild.label,
                    roleName: item.label
                  };
                  setSelectedSubRole(subRoleData);
                  // Store in localStorage for persistence
                  localStorage.setItem("selectedSubRole", JSON.stringify(subRoleData));
                  console.log("Selected SubRole:", subRoleData);
                  // Navigate to cheque expense with subrole data
                  navigate("/cheque", { state: { subRole: subRoleData } });
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-md text-[10px] font-bold transition-all duration-200 ${
                  selectedSubRole?.subRoleId === grandchild.id
                    ? "bg-blue-200/50 text-blue-800 border border-blue-400/50 uppercase shadow-sm"
                    : "text-gray-700 hover:text-gray-900 hover:bg-blue-100/25"
                }`}
              >
                ◆ {grandchild.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );

  // 🔹 Simple Menu Item Component
  const NavMenuItem = ({ item, setIsOpen }) => (
    <li className="group">
      <NavLink
        to={item.url}
        onClick={() => setIsOpen(false)}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2.5 rounded-[9px] transition-all duration-200 ${
            isActive
              ? "bg-blue-200/50 text-blue-800 border border-blue-400/60 shadow-sm font-bold"
              : "text-gray-800 hover:text-blue-700 hover:bg-blue-100/40"
          }`
        }
      >
        <span className={`text-lg transition-all duration-200`}>
          {item.icon}
        </span>
        <span className="text-sm font-bold text-gray-800">{item.label}</span>
      </NavLink>
    </li>
  );

  return (
    <>
      {/* ============================================
          MOBILE HAMBURGER BUTTON
          ============================================ */}
      {/* <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-3 rounded-[12px] bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:scale-110 transition-all duration-300 active:scale-95"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button> */}

      <button
              onClick={() => setIsOpen(!isOpen)}
              className={`fixed top-[env(safe-area-inset-top)] z-[9999] mt-2 p-2 text-black-600 transition-all duration-300 active:scale-95 md:hidden ${isOpen ? "left-1/2 -translate-x-[-130%]" : "left-4"} `}
          >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

      {/* ============================================
          MOBILE OVERLAY
          ============================================ */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden animate-fadeIn"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* ============================================
          MOBILE SIDEBAR
          ============================================ */}
      <div
        className={`fixed top-0 left-0 z-40 h-screen w-[280px] shadow-xl md:hidden transition-all duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* ============================================
          DESKTOP SIDEBAR
          ============================================ */}
      <div className="hidden md:fixed md:flex md:top-0 md:left-0 md:h-screen md:w-[270px] z-40 shadow-lg">
        <SidebarContent />
      </div>

      {/* ============================================
          ANIMATIONS & STYLES
          ============================================ */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }

        /* Custom scrollbar with blue accent */
        .scrollbar-hide::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-hide::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-hide::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(59, 130, 246, 0.2), rgba(79, 70, 229, 0.2));
          border-radius: 3px;
        }

        .scrollbar-hide::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(59, 130, 246, 0.4), rgba(79, 70, 229, 0.4));
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: thin;
          scrollbar-color: rgba(59, 130, 246, 0.2) transparent;
        }

        /* Smooth transitions */
        a, button {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 200ms;
        }

        /* Icon hover effect */
        .group:hover svg {
          filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.25));
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;
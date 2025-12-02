import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
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
} from "react-icons/fi";

const Sidebar = () => {
  const [role, setRole] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [department, setDepartment] = useState("");
  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    if (storedRole) setRole(storedRole.toLowerCase());
    if (userId && storedRole) fetchDepartment(userId, storedRole.toLowerCase());
  }, []);

  const fetchDepartment = async (userId, role) => {
    if (role === "superadmin") {
      setDepartment("Super Admin");
      return;
    }
    setDepartment("N/A"); // Only superadmin has sidebar
  };

  // 🔹 Sidebar items
  const allItems = [
    { id: 1, label: "Dashboard", icon: <FiGrid size={20} />, url: "/dashboard" },

    // 🔹 Lead Dashboard
    {
      id: 2,
      label: "Lead Dashboard",
      icon: <FiUsers size={20} />,
      type: "dropdown",
      url: "/lead-management",
      children: [
        { id: "2-1", label: "Assign Lead", url: "/assignlead" },
        { id: "2-2", label: "My Leads", url: "/addmylead" },
        { id: "2-3", label: "Today's Leads", url: "/todaysleads" },
        { id: "2-4", label: "Follow-Up Leads", url: "/followupleads" },
        { id: "2-5", label: "Lead Reports", url: "/leadreports" },
      ],
    },

    // 🔹 User Management
    {
      id: 3,
      label: "User Management",
      icon: <FiUsers size={20} />,
      url: "/user-management",
    },

    // 🔹 Admin Management
    {
      id: 4,
      label: "Admin Management",
      icon: <FiUserPlus size={20} />,
      type: "dropdown",
      children: [
        { id: "3-1", label: "Add Admin", url: "/add-admin" },
        { id: "3-2", label: "Assign Role", url: "/assignrole" },
        { id: "3-3", label: "Assign Company", url: "/assigncompany" },
        { id: "3-4", label: "Assigned Roles", url: "/assigned-roles" },
      ],
    },

    // 🔹 Employee Management
    {
      id: 5,
      label: "Employee Management",
      icon: <FiBriefcase size={20} />,
      type: "dropdown",
      // url: "/employee-management",
      children: [
        { id: "5-1", label: "Add Employee", url: "/user-management" },
        { id: "5-2", label: "Assign Company", url: "/employeecompany" },
        { id: "5-3", label: "Assign Role", url: "/assignemployeerole" },
        { id: "5-4", label: "Create Destination", url: "/createdestinationemployee" },
        { id: "5-5", label: "Assign Destination", url: "/assigndestination" },
      ],
    },

    { id: 6, label: "Attendance", icon: <FiClock size={20} />, url: "/attendance" },
    { id: 7, label: "Leave Management", icon: <FiClock size={20} />, url: "/leaves" },

    // 🔹 Companies
    {
      id: 8,
      label: "Companies",
      icon: <FiBriefcase size={20} />,
      type: "dropdown",
      children: [
        { id: "8-1", label: "All Companies", url: "/companies" },
        { id: "8-2", label: "Department", url: "/department" },
        { id: "8-3", label: "Designation", url: "/designation" },
        { id: "8-4", label: "Add Role", url: "/addrole" },
      ],
    },
    {
      id: 8.1,
      label: "Itianary",
      icon: <FiBriefcase size={20} />,
      type: "dropdown",
      children: [
        { id: "8-1", label: "Add Itinerary", url: "/add-itinerary" },
        { id: "8-2", label: "All Itinerary", url: "/all-itinerary" },
        // { id: "8-3", label: "Designation", url: "/designation" },
        // { id: "8-4", label: "Add Role", url: "/addrole" },
      ],
    },
    // 🔹 B2B (NEW SECTION)
    {
      id: 8.2,
      label: "Teams",
      icon: <FiBriefcase size={20} />,
      type: "dropdown",
      children: [
        { id: "b2b-1", label: "All Team", url: "/all-team" },
        { id: "b2b-1", label: "Create Team", url: "/create-team" },
        { id: "b2b-2", label: "Assign Team", url: "/b2b-addcompany" },
      ],
    },
    {
      id: 8.5,
      label: "B2B",
      icon: <FiBriefcase size={20} />,
      type: "dropdown",
      children: [
        { id: "b2b-1", label: "Destination", url: "/b2b-destination" },
        { id: "b2b-2", label: "Add Company", url: "/b2b-addcompany" },
      ],
    },
 
    // 🔹 Expense
    {
      id: 9,
      label: "Accounts",
      icon: <FiDollarSign size={20} />,
      type: "dropdown",
      children: [
        { id: "9-1", label: "Daily Expense", url: "/dailyexpenses" },
        { id: "9-2", label: "Cheque Expense", url: "/cheque" },
      ],
    },

    // 🔹 Operations
    {
      id: 10,
      label: "Operations",
      icon: <FiBriefcase size={20} />,
      type: "dropdown",
      children: [
        { id: "10-1", label: "Create State", url: "/createstate" },
        { id: "10-2", label: "Create Destination", url: "/createdestination" },
        { id: "10-3", label: "Create Hotel", url: "/createhotel" },
        { id: "10-4", label: "Create Transport", url: "/createtransport" },
        { id: "10-5", label: "Customer Creation", url: "/customer-creation" },
        { id: "10-6", label: "Customer Data", url: "/customer-data" },
      ],
    },
       {
       id: 10.5,
      label: "Tutorials",
      icon: <FiBriefcase size={20} />,
      type: "dropdown",
      children: [
        { id: "Tut-1", label: "Upload Material", url: "/upload-material" },
        { id: "Tut-2", label: "Training Material", url: "/training-material" },]
    },
    { id: 11, label: "Settings", icon: <FiSettings size={20} />, url: "/settings" },
    { id: 12, label: "Change Password", icon: <FiLock size={20} />, url: "/change-password" },
  ];

  // 🔹 Only render sidebar for superadmin
  if (role !== "superadmin") return null;

  const toggleDropdown = (label) => {
    setOpenDropdowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // 🔹 Sidebar content
  const SidebarContent = () => (
    <div className="flex flex-col w-full h-full bg-white">
      <div className="flex h-[12vh] items-center gap-3 border-b-2 px-4 select-none">
        <div className="flex size-12 items-center justify-center rounded-lg bg-black text-[25px] font-semibold text-white">
          C
        </div>
        <div className="text-[20px] font-semibold text-black whitespace-nowrap">
          CRM Pro
        </div>
      </div>

      <nav className="mt-8 flex-1 overflow-y-auto">
        <ul>
          {allItems.map((item) => (
            <React.Fragment key={item.id}>
              {item.type === "dropdown" ? (
                <>
                  <li className="mb-2 px-3">
                    <div className="flex items-center justify-between rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer">
                      <NavLink
                        to={item.url || "#"}
                        className="flex items-center gap-3 flex-1"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.icon}
                        <span className="text-md font-bold">{item.label}</span>
                      </NavLink>
                      <button onClick={() => toggleDropdown(item.label)}>
                        {openDropdowns[item.label] ? (
                          <FiChevronUp size={18} />
                        ) : (
                          <FiChevronDown size={18} />
                        )}
                      </button>
                    </div>
                  </li>

                  {openDropdowns[item.label] && (
                    <ul className="ml-8 mb-2">
                      {item.children.map((child) => (
                        <li key={child.id} className="mb-1">
                          <NavLink
                            to={child.url}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                              isActive
                                ? "block rounded-lg bg-black px-3 py-2 text-white"
                                : "block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                            }
                          >
                            {child.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <li className="mb-2 px-3">
                  <NavLink
                    to={item.url}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      isActive
                        ? "flex items-center gap-3 rounded-lg bg-black px-4 py-3 text-white"
                        : "flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-100"
                    }
                  >
                    {item.icon}
                    <span className="text-md font-bold">{item.label}</span>
                  </NavLink>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </nav>

      <div className="px-4 py-4 border-t text-sm text-gray-600">
        <span className="font-semibold">Department:</span>{" "}
        <span className="font-bold text-black">{department}</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 z-50 flex w-full items-center justify-between bg-white px-4 py-3 shadow-md md:hidden">
        <div className="flex items-center gap-3 select-none">
          <div className="flex size-10 items-center justify-center rounded-lg bg-black text-[20px] font-semibold text-white">
            C
          </div>
          <div className="text-lg font-semibold text-black">CRM Pro</div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 focus:outline-none"
        >
          {isOpen ? <FiX size={25} /> : <FiMenu size={25} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-full w-[250px] bg-white shadow-lg transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-[250px] bg-white border-r shadow-lg z-40">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;

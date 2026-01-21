// import React, { useEffect, useState } from "react";

// const UserCard = () => {
//   const [employees, setEmployees] = useState([]);
//   const [admins, setAdmins] = useState([]);

//   // ✅ Fetch data from both APIs
//   const fetchData = async () => {
//     try {
//       const [employeeRes, adminRes] = await Promise.all([
//         fetch("http://localhost:4000/employee/allEmployee"),
//         fetch("http://localhost:4000/getAdmins"),
//       ]);

//       const employeeData = await employeeRes.json();
//       const adminData = await adminRes.json();

//       setEmployees(employeeData.employees || employeeData.data || employeeData);
//       setAdmins(adminData.admins || adminData.data || adminData);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setEmployees([]);
//       setAdmins([]);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const totalUsers = employees.length + admins.length;

//   return (
//     <>
//       {/* Total Users */}
//       <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
//         <div className="mb-6 flex w-full justify-between gap-6">
//           <div className="text-xl font-semibold text-black">Total Users</div>
//         </div>
//         <div className="text-2xl font-semibold text-black">{totalUsers}</div>
//       </div>

//       {/* Total Employees */}
//       <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
//         <div className="mb-6 flex w-full justify-between gap-6">
//           <div className="text-xl font-semibold text-black">Total Employees</div>
//         </div>
//         <div className="text-2xl font-semibold text-black">{employees.length}</div>
//       </div>

//       {/* Total Admins */}
//       <div className="w-full rounded-md border border-gray-500 bg-[#ffffff] p-3">
//         <div className="mb-6 flex w-full justify-between gap-6">
//           <div className="text-xl font-semibold text-black">Total Admins</div>
//         </div>
//         <div className="text-2xl font-semibold text-black">{admins.length}</div>
//       </div>
//     </>
//   );
// };

// export default UserCard;


import React, { useEffect, useState } from "react";
import { FiUsers, FiUserCheck, FiShield } from "react-icons/fi";

const UserCard = () => {
  const [employees, setEmployees] = useState([]);
  const [admins, setAdmins] = useState([]);

  const fetchData = async () => {
    try {
      const [employeeRes, adminRes] = await Promise.all([
        fetch("http://localhost:4000/employee/allEmployee"),
        fetch("http://localhost:4000/getAdmins"),
      ]);

      const employeeData = await employeeRes.json();
      const adminData = await adminRes.json();

      setEmployees(employeeData.employees || employeeData.data || employeeData);
      setAdmins(adminData.admins || adminData.data || adminData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setEmployees([]);
      setAdmins([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalUsers = employees.length + admins.length;

  const cards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: <FiUsers size={32} className="text-white" />,
      gradient: "bg-gradient-to-br from-indigo-500 to-purple-600",
    },
    {
      title: "Employees",
      value: employees.length,
      icon: <FiUserCheck size={32} className="text-white" />,
      gradient: "bg-gradient-to-br from-green-400 to-teal-600",
    },
    {
      title: "Admins",
      value: admins.length,
      icon: <FiShield size={32} className="text-white" />,
      gradient: "bg-gradient-to-br from-pink-500 to-red-600",
    },
  ];

  // return (
  //   <div className="py-6 px-4">
  //     {/* Card Container */}
  //     <div className="flex flex-col md:flex-row gap-6 justify-start">
  //       {cards.map((card, index) => (
  //         <div
  //           key={index}
  //           className="relative rounded-3xl shadow-2xl hover:shadow-3xl transition duration-300 overflow-hidden w-full md:w-80 h-56"
  //         >
  //           {/* Card Background */}
  //           <div
  //             className={`${card.gradient} p-6 h-full flex flex-col justify-between`}
  //           >
  //             {/* Icon */}
  //             <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
  //               {card.icon}
  //             </div>

  //             {/* Text */}
  //             <div>
  //               <h3 className="text-white text-lg font-semibold">
  //                 {card.title}
  //               </h3>
  //               <p className="text-white text-4xl font-bold mt-1">
  //                 {card.value}
  //               </p>
  //             </div>

  //             {/* Decorative Blur */}
  //             <div className="absolute -bottom-12 -right-12 h-32 w-32 bg-white/20 rounded-full blur-3xl"></div>
  //             <div className="absolute -top-12 -left-12 h-32 w-32 bg-white/10 rounded-full blur-2xl"></div>
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );

  return (
      <div className="py-6 px-4">
        {/* Card Container */}
        <div className="flex flex-col md:flex-row gap-6 justify-items-center justify-start">
          {cards.map((card, index) => (
            <div
              key={index}
              className="relative rounded-2xl shadow-2xl hover:shadow-3xl transition duration-300 overflow-hidden w-full w-80 h-56"
            >
              {/* Card Background */}
              <div
                className={`${card.gradient} p-6 h-full w-full flex flex-col justify-between justify-center`}
              >
                {/* Icon */}
                <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                  {card.icon}
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-white text-lg font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-white text-4xl font-bold mt-1">
                    {card.value}
                  </p>
                </div>

                {/* Decorative Blur */}
                <div className="absolute -bottom-12 -right-12 h-32 w-32 bg-white/20 rounded-full blur-3xl"></div>
                <div className="absolute -top-12 -left-12 h-32 w-32 bg-white/10 rounded-full blur-2xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
};

export default UserCard;

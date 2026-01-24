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


// import React, { useEffect, useState } from "react";
// import { FiUsers, FiUserCheck, FiShield } from "react-icons/fi";

// const UserCard = () => {
//   const [employees, setEmployees] = useState([]);
//   const [admins, setAdmins] = useState([]);

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

//   const cards = [
//     {
//       title: "Total Users",
//       value: totalUsers,
//       icon: <FiUsers size={32} className="text-white" />,
//       gradient: "bg-gradient-to-br from-indigo-500 to-purple-600",
//     },
//     {
//       title: "Employees",
//       value: employees.length,
//       icon: <FiUserCheck size={32} className="text-white" />,
//       gradient: "bg-gradient-to-br from-green-400 to-teal-600",
//     },
//     {
//       title: "Admins",
//       value: admins.length,
//       icon: <FiShield size={32} className="text-white" />,
//       gradient: "bg-gradient-to-br from-pink-500 to-red-600",
//     },
//   ];

//   // return (
//   //   <div className="py-6 px-4">
//   //     {/* Card Container */}
//   //     <div className="flex flex-col md:flex-row gap-6 justify-start">
//   //       {cards.map((card, index) => (
//   //         <div
//   //           key={index}
//   //           className="relative rounded-3xl shadow-2xl hover:shadow-3xl transition duration-300 overflow-hidden w-full md:w-80 h-56"
//   //         >
//   //           {/* Card Background */}
//   //           <div
//   //             className={`${card.gradient} p-6 h-full flex flex-col justify-between`}
//   //           >
//   //             {/* Icon */}
//   //             <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
//   //               {card.icon}
//   //             </div>

//   //             {/* Text */}
//   //             <div>
//   //               <h3 className="text-white text-lg font-semibold">
//   //                 {card.title}
//   //               </h3>
//   //               <p className="text-white text-4xl font-bold mt-1">
//   //                 {card.value}
//   //               </p>
//   //             </div>

//   //             {/* Decorative Blur */}
//   //             <div className="absolute -bottom-12 -right-12 h-32 w-32 bg-white/20 rounded-full blur-3xl"></div>
//   //             <div className="absolute -top-12 -left-12 h-32 w-32 bg-white/10 rounded-full blur-2xl"></div>
//   //           </div>
//   //         </div>
//   //       ))}
//   //     </div>
//   //   </div>
//   // );

//   return (
//       <div className="py-6 px-4">
//         {/* Card Container */}
//         <div className="flex flex-col md:flex-row gap-6 justify-items-center justify-start">
//           {cards.map((card, index) => (
//             <div
//               key={index}
//               className="relative rounded-2xl shadow-2xl hover:shadow-3xl transition duration-300 overflow-hidden w-full w-80 h-56"
//             >
//               {/* Card Background */}
//               <div
//                 className={`${card.gradient} p-6 h-full w-full flex flex-col justify-between justify-center`}
//               >
//                 {/* Icon */}
//                 <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
//                   {card.icon}
//                 </div>

//                 {/* Text */}
//                 <div>
//                   <h3 className="text-white text-lg font-semibold">
//                     {card.title}
//                   </h3>
//                   <p className="text-white text-4xl font-bold mt-1">
//                     {card.value}
//                   </p>
//                 </div>

//                 {/* Decorative Blur */}
//                 <div className="absolute -bottom-12 -right-12 h-32 w-32 bg-white/20 rounded-full blur-3xl"></div>
//                 <div className="absolute -top-12 -left-12 h-32 w-32 bg-white/10 rounded-full blur-2xl"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//   );
// };

// export default UserCard;





// import React, { useEffect, useState } from "react";
// import { FiUsers, FiUserCheck, FiShield } from "react-icons/fi";

// const UserCard = () => {
//   const [employees, setEmployees] = useState([]);
//   const [admins, setAdmins] = useState([]);

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

//   const cards = [
//     {
//       title: "Total Users",
//       value: totalUsers,
//       icon: <FiUsers size={32} className="text-white" />,
//       gradient: "bg-gradient-to-br from-indigo-500 to-purple-600",
//     },
//     {
//       title: "Employees",
//       value: employees.length,
//       icon: <FiUserCheck size={32} className="text-white" />,
//       gradient: "bg-gradient-to-br from-green-400 to-teal-600",
//     },
//     {
//       title: "Admins",
//       value: admins.length,
//       icon: <FiShield size={32} className="text-white" />,
//       gradient: "bg-gradient-to-br from-pink-500 to-red-600",
//     },
//   ];

//   return (
//       <div className="py-6 px-4">
//         {/* Card Container */}
//         <div className="flex flex-col md:flex-row gap-6 justify-items-center justify-start">
//           {cards.map((card, index) => (
//             <div
//               key={index}
//               className="relative rounded-2xl shadow-2xl hover:shadow-3xl transition duration-300 overflow-hidden w-full w-80 h-56"
//             >
//               {/* Card Background */}
//               <div
//                 className={`${card.gradient} p-6 h-full w-full flex flex-col justify-between justify-center`}
//               >
//                 {/* Icon */}
//                 <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
//                   {card.icon}
//                 </div>

//                 {/* Text */}
//                 <div>
//                   <h3 className="text-white text-lg font-semibold">
//                     {card.title}
//                   </h3>
//                   <p className="text-white text-4xl font-bold mt-1">
//                     {card.value}
//                   </p>
//                 </div>

//                 {/* Decorative Blur */}
//                 <div className="absolute -bottom-12 -right-12 h-32 w-32 bg-white/20 rounded-full blur-3xl"></div>
//                 <div className="absolute -top-12 -left-12 h-32 w-32 bg-white/10 rounded-full blur-2xl"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//   );
// };

// export default UserCard;


import React, { useEffect, useState } from "react";
import { FiUsers, FiBriefcase, FiShield } from "react-icons/fi";

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
            value: totalUsers.toLocaleString(),
            subtitle: "+12% from last month",
            subtitleClass: "text-white/80",
            icon: (
                <FiUsers
                    size={22}
                    className="text-white"
                />
            ),
            wrapperClass: "bg-gradient-to-br from-blue-600 to-purple-400 text-white",
            iconBg: "bg-white/20",
        },
        {
            title: "Employees",
            value: employees.length.toLocaleString(),
            subtitle: "97% ACTIVE",
            subtitleClass: "text-emerald-500 font-semibold",
            icon: (
                <FiBriefcase
                    size={22}
                    className="text-indigo-600"
                />
            ),
            wrapperClass: "bg-white text-gray-900 shadow-lg",
            iconBg: "bg-indigo-50",
        },
        {
            title: "Admins",
            value: admins.length.toLocaleString(),
            subtitle: "PRIVILEGED ACCESS",
            subtitleClass: "text-orange-500 font-semibold",
            icon: (
                <FiShield
                    size={22}
                    className="text-indigo-600"
                />
            ),
            wrapperClass: "bg-white text-gray-900 shadow-lg",
            iconBg: "bg-indigo-50",
        },
    ];

    // return (
    //     <div className="px-4 py-6">
    //         <div className="flex flex-col gap-6 md:flex-row">
    //             {cards.map((card, index) => (
    //                 <div
    //                     key={index}
    //                     className={`relative h-[150px] w-full flex-shrink-0 overflow-hidden rounded-3xl md:w-[280px] ${card.wrapperClass}`}
    //                 >
    //                     <div className="flex h-full w-full flex-col justify-between px-6 py-5">
    //                         <div className="flex items-start justify-between">
    //                             <div>
    //                                 <h3 className="text-sm font-medium opacity-90">{card.title}</h3>
    //                                 <p className={`mt-1 text-xs tracking-wide ${card.subtitleClass}`}>{card.subtitle}</p>
    //                             </div>
    //                             <div className={`flex h-9 w-9 items-center justify-center rounded-full ${card.iconBg}`}>{card.icon}</div>
    //                         </div>
    //                         <p className="text-3xl font-bold leading-tight md:text-4xl">{card.value}</p>
    //                         {/* Decorative Blur */}
    //                         <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/20 blur-3xl"></div>
    //                         <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
    //                     </div>
    //                 </div>
    //             ))}
    //         </div>
    //     </div>
  // );

  return (
      <div className="px-4 py-6">
          <div className="flex flex-col gap-6 md:flex-row">
              {cards.map((card, index) => (
                  <div
                      key={index}
                      className={`relative h-[240px] w-full flex-shrink-0 overflow-hidden rounded-3xl md:w-[400px] lg:w-[420px] ${card.wrapperClass}`}
                  >
                      <div className="flex h-full w-full flex-col justify-between px-8 py-8">
                          <div className="flex items-start justify-between">
                              <div>
                                  <h3 className="text-lg font-semibold opacity-90">{card.title}</h3>
                                  <p className={`mt-2 text-base tracking-wide ${card.subtitleClass}`}>{card.subtitle}</p>
                              </div>
                              <div className={`flex h-14 w-14 items-center justify-center rounded-full ${card.iconBg}`}>{card.icon}</div>
                          </div>
                          <p className="text-6xl font-bold leading-tight md:text-7xl">{card.value}</p>
                          {/* Decorative Blur - perfectly scaled */}
                          <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-white/20 blur-3xl"></div>
                          <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-white/10 blur-2xl"></div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );


};

export default UserCard;
// import React, { useState, useEffect } from "react";

// const CustomerData = () => {
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);

//   // Fetch list of customers for the dropdown
//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const response = await fetch("http://localhost:4000/customer/all");
//         if (!response.ok) throw new Error("Failed to fetch customers");
//         const data = await response.json();
//         setCustomers(data);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchCustomers();
//   }, []);

//   // Fetch details of selected customer
//   const handleSelectCustomer = async (e) => {
//     const id = e.target.value;
//     if (!id) {
//       setSelectedCustomer(null);
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:4000/customer/${id}`);
//       if (!response.ok) throw new Error("Failed to fetch customer details");
//       const data = await response.json();
//       setSelectedCustomer(data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Select a Customer</h2>

//       {/* Dropdown */}
//       <select
//         value={selectedCustomer?.id || ""}
//         onChange={handleSelectCustomer}
//         className="w-full p-2 border rounded mb-4"
//       >
//         <option value="">-- Select Customer --</option>
//         {customers.map((c) => (
//           <option key={c.id} value={c.id}>
//             {c.name} ({c.groupNo})
//           </option>
//         ))}
//       </select>

//       {/* Read-only Form */}
//       {selectedCustomer && (
//         <form className="p-4 border rounded bg-gray-50 space-y-3">
//           <div>
//             <label className="block font-semibold mb-1">Name:</label>
//             <input
//               type="text"
//               value={selectedCustomer.name}
//               readOnly
//               className="w-full border p-2 rounded bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-1">Phone:</label>
//             <input
//               type="text"
//               value={selectedCustomer.phone}
//               readOnly
//               className="w-full border p-2 rounded bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-1">Group No:</label>
//             <input
//               type="text"
//               value={selectedCustomer.groupNo}
//               readOnly
//               className="w-full border p-2 rounded bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-1">Email:</label>
//             <input
//               type="text"
//               value={selectedCustomer.email}
//               readOnly
//               className="w-full border p-2 rounded bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-1">Address:</label>
//             <textarea
//               value={selectedCustomer.address}
//               readOnly
//               className="w-full border p-2 rounded bg-gray-100"
//               rows={3}
//             />
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default CustomerData;




// import React, { useState, useEffect } from "react";

// const CustomerData = () => {
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);

//   // Fetch all customers
//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const response = await fetch("http://localhost:4000/customer/all");
//         if (!response.ok) throw new Error("Failed to fetch customers");
//         const data = await response.json();
//         setCustomers(data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchCustomers();
//   }, []);

//   // Fetch particular customer
//   const handleSelectCustomer = async (e) => {
//     const id = e.target.value;

//     if (!id) {
//       setSelectedCustomer(null);
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:4000/customer/${id}`);
//       if (!response.ok) throw new Error("Failed to fetch customer details");

//       const data = await response.json();
//       setSelectedCustomer(data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Select a Customer</h2>

//       {/* Customer Dropdown */}
//       <select
//         value={selectedCustomer?._id || ""}
//         onChange={handleSelectCustomer}
//         className="w-full p-2 border rounded mb-4"
//       >
//         <option value="">-- Select Customer --</option>

//         {customers.map((c) => (
//           <option key={c._id} value={c._id}>
//             {c.name} (Group {c.groupNo})
//           </option>
//         ))}
//       </select>

//       {/* Read-only Customer Details */}
//       {selectedCustomer && (
//         <form className="p-4 border rounded bg-gray-50 space-y-3">
//           <div>
//             <label className="block font-semibold mb-1">Name:</label>
//             <input
//               type="text"
//               value={selectedCustomer.name}
//               readOnly
//               className="w-full border p-2 rounded bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-1">Phone:</label>
//             <input
//               type="text"
//               value={selectedCustomer.phone}
//               readOnly
//               className="w-full border p-2 rounded bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-1">Group No:</label>
//             <input
//               type="text"
//               value={selectedCustomer.groupNo}
//               readOnly
//               className="w-full border p-2 rounded bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-1">Email:</label>
//             <input
//               type="text"
//               value={selectedCustomer.email}
//               readOnly
//               className="w-full border p-2 rounded bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-1">Address:</label>
//             <textarea
//               value={selectedCustomer.address}
//               readOnly
//               rows={3}
//               className="w-full border p-2 rounded bg-gray-100"
//             />
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default CustomerData;



// import React, { useState, useEffect } from "react";

// const CustomerData = () => {
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const response = await fetch("http://localhost:4000/customer/all");
//         if (!response.ok) throw new Error("Failed to fetch customers");
//         const data = await response.json();
//         setCustomers(data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchCustomers();
//   }, []);

//   const handleSelectCustomer = async (e) => {
//     const id = e.target.value;

//     if (!id) {
//       setSelectedCustomer(null);
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:4000/customer/${id}`);
//       if (!response.ok) throw new Error("Failed to fetch customer details");

//       const data = await response.json();
//       setSelectedCustomer(data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">  {/* Increased max width here */}
//       <h2 className="text-2xl font-bold mb-4 text-center">Select a Customer</h2>

//       <select
//         value={selectedCustomer?._id || ""}
//         onChange={handleSelectCustomer}
//         className="w-full p-2 border rounded mb-6"
//       >
//         <option value="">-- Select Customer --</option>

//         {customers.map((c) => (
//           <option key={c._id} value={c._id}>
//             {c.name} (Group {c.groupNo})
//           </option>
//         ))}
//       </select>

//       {selectedCustomer && (
//         <div className="p-6 border rounded bg-gray-50 grid grid-cols-2 gap-6">
//           <div>
//             <label className="block font-semibold mb-1">Name:</label>
//             <input
//               type="text"
//               value={selectedCustomer.name}
//               readOnly
//               className="w-full border p-2 rounded bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-1">Phone:</label>
//             <input
//               type="text"
//               value={selectedCustomer.phone}
//               readOnly
//               className="w-full border p-2 rounded bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-1">Group No:</label>
//             <input
//               type="text"
//               value={selectedCustomer.groupNo}
//               readOnly
//               className="w-full border p-2 rounded bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="block font-semibold mb-1">Email:</label>
//             <input
//               type="text"
//               value={selectedCustomer.email}
//               readOnly
//               className="w-full border p-2 rounded bg-gray-100"
//             />
//           </div>

//           <div className="col-span-2">
//             <label className="block font-semibold mb-1">Address:</label>
//             <textarea
//               value={selectedCustomer.address}
//               readOnly
//               rows={2}
//               className="w-full border p-2 rounded bg-gray-100"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerData;


import React, { useState, useEffect } from "react";

const CustomerData = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:4000/customer/all");
        if (!response.ok) throw new Error("Failed to fetch customers");
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCustomers();
  }, []);

  const handleSelectCustomer = async (e) => {
    const id = e.target.value;

    if (!id) {
      setSelectedCustomer(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/customer/${id}`);
      if (!response.ok) throw new Error("Failed to fetch customer details");

      const data = await response.json();
      setSelectedCustomer(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadDocs = () => {
    if (!selectedCustomer) return;
    // You can implement your file upload logic here
    alert(`Upload docs for ${selectedCustomer.name}`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Select a Customer</h2>

      <select
        value={selectedCustomer?._id || ""}
        onChange={handleSelectCustomer}
        className="w-full p-2 border rounded mb-6"
      >
        <option value="">-- Select Customer --</option>
        {customers.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name} (Group {c.groupNo})
          </option>
        ))}
      </select>

      {selectedCustomer && (
        <div className="p-6 border rounded bg-gray-50 grid grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">Name:</label>
            <input
              type="text"
              value={selectedCustomer.name}
              readOnly
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Phone:</label>
            <input
              type="text"
              value={selectedCustomer.phone}
              readOnly
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Group No:</label>
            <input
              type="text"
              value={selectedCustomer.groupNo}
              readOnly
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email:</label>
            <input
              type="text"
              value={selectedCustomer.email}
              readOnly
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          <div className="col-span-2">
            <label className="block font-semibold mb-1">Address:</label>
            <textarea
              value={selectedCustomer.address}
              readOnly
              rows={2}
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          {/* Upload Docs Button */}
          <div className="col-span-2 mt-4">
            <button
              onClick={handleUploadDocs}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Upload Docs
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerData;

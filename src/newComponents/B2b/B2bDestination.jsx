// import React, { useEffect, useState } from "react";

// const B2bDestination = () => {
//   const [formData, setFormData] = useState({
//     countryName: "India",
//     state: "",
//   });

//   const [b2bStates, setB2bStates] = useState([]);

//   // -------------------------------------------------------------------
//   // ✅ Fetch B2B States
//   // -------------------------------------------------------------------
//   const fetchB2bStates = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/b2bstate");
//       const data = await res.json();
//       setB2bStates(data);
//     } catch (error) {
//       console.error("Error fetching B2B states:", error);
//     }
//   };

//   useEffect(() => {
//     fetchB2bStates();
//   }, []);

//   // -------------------------------------------------------------------
//   // Input change handler
//   // -------------------------------------------------------------------
//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // -------------------------------------------------------------------
//   // Save B2B State
//   // -------------------------------------------------------------------
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.state) {
//       alert("State is required");
//       return;
//     }

//     const payload = {
//       country: "India",
//       state: formData.state,
//     };

//     try {
//       const res = await fetch("http://localhost:4000/b2bstate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Failed to save B2B state");

//       alert("B2B State saved successfully ✓");

//       fetchB2bStates();

//       // Reset
//       setFormData({
//         countryName: "India",
//         state: "",
//       });
//     } catch (error) {
//       console.error(error);
//       alert("Failed to save B2B state");
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
//       <h2 className="text-2xl font-semibold mb-6 text-center">
//         B2B State Management
//       </h2>

//       {/* FORM */}
//       <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">

//         {/* COUNTRY (always India) */}
//         <div>
//           <label className="block text-sm font-medium mb-1">Country</label>
//           <input
//             type="text"
//             value="India"
//             readOnly
//             className="w-full border p-2 bg-gray-100"
//           />
//         </div>

//         {/* STATE */}
//         <div>
//           <label className="block text-sm font-medium mb-1">State</label>
//           <input
//             type="text"
//             name="state"
//             value={formData.state}
//             onChange={handleInputChange}
//             className="w-full border p-2"
//             placeholder="Enter state name"
//           />
//         </div>

//         <button className="w-full bg-black text-white py-2 rounded-md">
//           Save B2B State
//         </button>
//       </form>

//       {/* TABLE */}
//       <div className="mt-10">
//         <h3 className="text-lg font-semibold mb-4">B2B States List</h3>

//         <table className="w-full border text-sm">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="border p-2">#</th>
//               <th className="border p-2">Country</th>
//               <th className="border p-2">State</th>
//             </tr>
//           </thead>

//           <tbody>
//             {b2bStates.map((s, index) => (
//               <tr key={s._id} className="hover:bg-gray-50">
//                 <td className="border p-2">{index + 1}</td>
//                 <td className="border p-2">{s.country}</td>
//                 <td className="border p-2">{s.state}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default B2bDestination;




import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

const B2bDestination = () => {
  const [formData, setFormData] = useState({
    countryName: "India",
    state: "",
  });

  const [b2bStates, setB2bStates] = useState([]);

  // -------------------------------------------------------------------
  // ✅ Fetch B2B States
  // -------------------------------------------------------------------
  const fetchB2bStates = async () => {
    try {
      const res = await fetch("http://localhost:4000/b2bstate");
      const data = await res.json();
      setB2bStates(data);
    } catch (error) {
      console.error("Error fetching B2B states:", error);
    }
  };

  useEffect(() => {
    fetchB2bStates();
  }, []);

  // -------------------------------------------------------------------
  // Input change handler
  // -------------------------------------------------------------------
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // -------------------------------------------------------------------
  // Save B2B State
  // -------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.state) {
      alert("State is required");
      return;
    }

    const payload = {
      country: "India",
      state: formData.state,
    };

    try {
      const res = await fetch("http://localhost:4000/b2bstate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save B2B state");

      alert("B2B State saved successfully ✓");

      fetchB2bStates();

      // Reset
      setFormData({
        countryName: "India",
        state: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to save B2B state");
    }
  };

  // -------------------------------------------------------------------
  // Delete B2B State
  // -------------------------------------------------------------------
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this state?")) {
      try {
        const res = await fetch(`http://localhost:4000/b2bstate/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete B2B state");

        alert("B2B State deleted successfully ✓");
        fetchB2bStates();
      } catch (error) {
        console.error(error);
        alert("Failed to delete B2B state");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        B2B State Management
      </h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
        {/* COUNTRY (always India) */}
        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <input
            type="text"
            value="India"
            readOnly
            className="w-full border p-2 bg-gray-100"
          />
        </div>

        {/* STATE */}
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="w-full border p-2"
            placeholder="Enter state name"
          />
        </div>

        <button className="w-full bg-black text-white py-2 rounded-md">
          Save B2B State
        </button>
      </form>

      {/* TABLE */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">B2B States List</h3>

        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Country</th>
              <th className="border p-2">State</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {b2bStates.map((s, index) => (
              <tr key={s._id} className="hover:bg-gray-50">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{s.country}</td>
                <td className="border p-2">{s.state}</td>
                <td className="border p-2 text-left">
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default B2bDestination;

// // import React, { useState, useEffect } from 'react';
// // import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

// // const CreateHotel = () => {
// //   const [isDomestic, setIsDomestic] = useState(true);
// //   const [country, setCountry] = useState("India");
// //   const [state, setState] = useState("");
// //   const [destination, setDestination] = useState("");
// //   const [hotelName, setHotelName] = useState("");
// //   const [hotelPhone, setHotelPhone] = useState("");
// //   const [hotelAddress, setHotelAddress] = useState("");
// //   const [hotelEmail, setHotelEmail] = useState("");
// //   const [hotelWhatsapp, setHotelWhatsapp] = useState("");
// //   const [contactPersonNumber, setContactPersonNumber] = useState("");
// //   const [hotelRating, setHotelRating] = useState("");
// //   const [states, setStates] = useState([]);
// //   const [destinations, setDestinations] = useState([]);
// //   const [hotels, setHotels] = useState([]);

// //   // Filters
// //   const [filterType, setFilterType] = useState("All");
// //   const [filterState, setFilterState] = useState("All");
// //   const [filterRating, setFilterRating] = useState("All");
// //   const [searchName, setSearchName] = useState("");

// //   // Edit mode
// //   const [editingHotelId, setEditingHotelId] = useState(null);

// //   // ---------------------------- FETCH APIs ----------------------------
// //   const fetchStates = async () => {
// //     try {
// //       const res = await fetch("http://localhost:4000/state/");
// //       const data = await res.json();
// //       setStates(data);
// //     } catch (err) {
// //       console.error("Error fetching states:", err);
// //     }
// //   };

// //   const fetchDestinations = async () => {
// //     try {
// //       const res = await fetch("http://localhost:4000/destination/");
// //       const data = await res.json();
// //       setDestinations(data);
// //     } catch (err) {
// //       console.error("Error fetching destinations:", err);
// //     }
// //   };

// //   const fetchHotels = async () => {
// //     try {
// //       const res = await fetch("http://localhost:4000/hotel/");
// //       const data = await res.json();
// //       setHotels(data);
// //     } catch (err) {
// //       console.error("Error fetching hotels:", err);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchStates();
// //     fetchDestinations();
// //     fetchHotels();
// //   }, []);

// //   const internationalCountries = [
// //     ...new Set(states.filter(s => s.type === "International").map(s => s.country))
// //   ];

// //   const domesticStates = states.filter(s => s.type === "Domestic");
// //   const internationalStates = states.filter(
// //     (s) => s.type === "International" && s.country === country
// //   );

// //   const filteredDestinations = destinations.filter(
// //     (d) => d.state?._id === state
// //   );

// //   useEffect(() => {
// //     if (isDomestic) setCountry("India");
// //     else setCountry("");
// //     setState("");
// //     setDestination("");
// //   }, [isDomestic]);

// //   useEffect(() => {
// //     setState("");
// //     setDestination("");
// //   }, [country]);

// //   useEffect(() => {
// //     setDestination("");
// //   }, [state]);

// //   // --------------------------- SUBMIT / UPDATE HOTEL ---------------------------
// //   const handleSubmit = async () => {
// //     if (!state || !destination || !hotelName || !hotelPhone || !hotelAddress || !hotelEmail || !hotelWhatsapp || !contactPersonNumber  || !hotelRating) {
// //       alert("Please fill all required fields");
// //       return;
// //     }

// //     const payload = {
// //       type: isDomestic ? "Domestic" : "International",
// //       country,
// //       state,
// //       destination,
// //       hotelName,
// //       hotelPhone,
// //       hotelAddress,
// //       hotelEmail,
// //       whatsappNumber: hotelWhatsapp,
// //       contactPersonNumber,
// //       rating: hotelRating,
// //     };

// //     try {
// //       let res, data;

// //       if (editingHotelId) {
// //         // Update existing hotel
// //         res = await fetch(`http://localhost:4000/update/${editingHotelId}`, {
// //           method: "PUT",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(payload),
// //         });
// //         data = await res.json();
// //         if (!res.ok) throw new Error(data.message || "Update failed");
// //         alert("Hotel updated successfully!");
// //         setEditingHotelId(null);
// //       } else {
// //         // Create new hotel
// //         res = await fetch("http://localhost:4000/hotel/", {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(payload),
// //         });
// //         data = await res.json();
// //         if (!res.ok) throw new Error(data.message || "Failed to create hotel!");
// //         alert("Hotel created successfully!");
// //       }

// //       // Clear form
// //       setHotelName("");
// //       setHotelPhone("");
// //       setHotelAddress("");
// //       setHotelEmail("");
// //       setHotelWhatsapp("");
// //       setContactPersonNumber("");
// //       setHotelRating("");
// //       setState("");
// //       setDestination("");
// //       if (!isDomestic) setCountry("");

// //       fetchHotels();
// //     } catch (error) {
// //       console.error("Error saving hotel:", error);
// //       alert(error.message || "Server error!");
// //     }
// //   };

// //   // --------------------------- FILTER HOTELS ---------------------------
// //   const filteredHotels = hotels.filter((h) => {
// //     const matchType = filterType === "All" || h.type === filterType;
// //     const matchState = filterState === "All" || h.state?.state === filterState;
// //     const matchRating = filterRating === "All" || Number(h.rating) === Number(filterRating);
// //     const matchSearch = h.hotelName.toLowerCase().includes(searchName.toLowerCase());

// //     return matchType && matchState && matchRating && matchSearch;
// //   });

// //   // --------------------------- VIEW, EDIT, DELETE ---------------------------
// //   const onView = async (hotelId) => {
// //     try {
// //       const res = await fetch(`http://localhost:4000/hotel/${hotelId}`);
// //       if (!res.ok) throw new Error("Failed to fetch hotel details");
// //       const data = await res.json();
// //       alert(`Hotel Name: ${data.hotelName}\nState: ${data.state?.state}\nDestination: ${data.destination?.destinationName}\nRating: ${data.rating} ⭐`);
// //     } catch (err) {
// //       console.error(err);
// //       alert("Error fetching hotel details");
// //     }
// //   };

// //   const onEdit = async (hotelId) => {
// //     try {
// //       const res = await fetch(`http://localhost:4000/hotel/${hotelId}`);
// //       if (!res.ok) throw new Error("Failed to fetch hotel for edit");
// //       const data = await res.json();

// //       // Prefill form
// //       setEditingHotelId(hotelId);
// //       setIsDomestic(data.type === "Domestic");
// //       setCountry(data.country || "");
// //       setState(data.state?._id || "");
// //       setDestination(data.destination?._id || "");
// //       setHotelName(data.hotelName || "");
// //       setHotelPhone(data.hotelPhone || "");
// //       setHotelAddress(data.hotelAddress || "");
// //       setHotelEmail(data.hotelEmail || "");
// //       setHotelWhatsapp(data.whatsappNumber || "");
// //       setContactPersonNumber(data.contactPersonNumber || "");
// //       setHotelRating(data.rating || "");
// //     } catch (err) {
// //       console.error(err);
// //       alert("Error fetching hotel for edit");
// //     }
// //   };

// //   const onDelete = async (hotelId) => {
// //     if (!window.confirm("Are you sure you want to delete this hotel?")) return;

// //     try {
// //       const res = await fetch(`http://localhost:4000/hotel/delete/${hotelId}`, {
// //         method: "DELETE",
// //       });
// //       const data = await res.json();
// //       if (!res.ok) throw new Error(data.message || "Delete failed");
// //       alert("Hotel deleted successfully!");
// //       fetchHotels();
// //     } catch (err) {
// //       console.error(err);
// //       alert("Error deleting hotel");
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">

// //       {/* ------------------------- HOTEL CREATE / EDIT FORM ------------------------- */}
// //       <div className="flex items-center justify-center p-4 pt-8">
// //         <div className="bg-white rounded-lg shadow-md p-8 w-full" style={{maxWidth: '1000px'}}>
// //           <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">{editingHotelId ? "Edit Hotel" : "Create Hotel"}</h1>

// //           {/* Domestic / International Toggle */}
// //           <div className="flex items-center justify-center gap-6 mb-6">
// //             <label className="flex items-center gap-2 cursor-pointer">
// //               <input type="checkbox" checked={isDomestic} onChange={(e) => setIsDomestic(e.target.checked)} />
// //               <span>Domestic</span>
// //             </label>
// //             <label className="flex items-center gap-2 cursor-pointer">
// //               <input type="checkbox" checked={!isDomestic} onChange={(e) => setIsDomestic(!e.target.checked)} />
// //               <span>International</span>
// //             </label>
// //           </div>

// //           {/* COUNTRY */}
// //           <div className="mb-4">
// //             <label className="block mb-2 font-medium">Country</label>
// //             {isDomestic ? (
// //               <input value="India" className="w-full border p-2 bg-gray-100" disabled />
// //             ) : (
// //               <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full border p-2">
// //                 <option value="">Select Country</option>
// //                 {internationalCountries.map((c) => (
// //                   <option key={c} value={c}>{c}</option>
// //                 ))}
// //               </select>
// //             )}
// //           </div>

// //           {/* STATE */}
// //           <div className="mb-4">
// //             <label className="block mb-2 font-medium">State</label>
// //             <select value={state} onChange={(e) => setState(e.target.value)} className="w-full border p-2">
// //               <option value="">Select State</option>
// //               {isDomestic
// //                 ? domesticStates.map((s) => (
// //                     <option key={s._id} value={s._id}>{s.state}</option>
// //                   ))
// //                 : internationalStates.map((s) => (
// //                     <option key={s._id} value={s._id}>{s.state}</option>
// //                   ))}
// //             </select>
// //           </div>

// //           {/* DESTINATION */}
// //           <div className="mb-4">
// //             <label className="block mb-2 font-medium">Destination</label>
// //             <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full border p-2">
// //               <option value="">Select Destination</option>
// //               {filteredDestinations.map((d) => (
// //                 <option key={d._id} value={d._id}>{d.destinationName}</option>
// //               ))}
// //             </select>
// //           </div>

// //           {/* HOTEL NAME */}
// //           <div className="mb-4">
// //             <label className="block mb-2 font-medium">Hotel Name</label>
// //             <input value={hotelName} onChange={(e) => setHotelName(e.target.value)} className="w-full border p-2" />
// //           </div>

// //           {/* HOTEL PHONE */}
// //           <div className="mb-4">
// //             <label className="block mb-2 font-medium">Hotel Phone</label>
// //             <input value={hotelPhone} onChange={(e) => setHotelPhone(e.target.value)} className="w-full border p-2" />
// //           </div>

// //           {/* HOTEL ADDRESS */}
// //           <div className="mb-4">
// //             <label className="block mb-2 font-medium">Hotel Address</label>
// //             <textarea value={hotelAddress} onChange={(e) => setHotelAddress(e.target.value)} className="w-full border p-2" rows="3"></textarea>
// //           </div>

// //           {/* HOTEL EMAIL */}
// //           <div className="mb-4">
// //             <label className="block mb-2 font-medium">Hotel Email</label>
// //             <input type="email" value={hotelEmail} onChange={(e) => setHotelEmail(e.target.value)} className="w-full border p-2" />
// //           </div>

// //           {/* WHATSAPP NUMBER */}
// //           <div className="mb-4">
// //             <label className="block mb-2 font-medium">WhatsApp Number</label>
// //             <input value={hotelWhatsapp} onChange={(e) => setHotelWhatsapp(e.target.value)} className="w-full border p-2" />
// //           </div>

// //           {/* CONTACT PERSON NUMBER */}
// //           <div className="mb-4">
// //             <label className="block mb-2 font-medium">Contact Person Number</label>
// //             <input value={contactPersonNumber} onChange={(e) => setContactPersonNumber(e.target.value)} className="w-full border p-2" />
// //           </div>

// //           {/* HOTEL RATING */}
// //           <div className="mb-4">
// //             <label className="block mb-2 font-medium">Hotel Rating</label>
// //             <select value={hotelRating} onChange={(e) => setHotelRating(e.target.value)} className="w-full border p-2">
// //               <option value="">Select Rating</option>
// //               {[1,2,3,4,5,6,7].map(r => (
// //                 <option key={r} value={r}>{r} Star</option>
// //               ))}
// //             </select>
// //           </div>

// //           <button
// //             onClick={handleSubmit}
// //             className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
// //             {editingHotelId ? "Update Hotel" : "Save Hotel"}
// //           </button>
// //         </div>
// //       </div>

// //       {/* ------------------------- HOTEL LIST ------------------------- */}
// //       <div className="p-6 max-w-7xl mx-auto pb-8">
// //         <div className="bg-white rounded-lg shadow-md p-6">

// //           <h2 className="text-2xl font-bold text-gray-800 mb-6">All Hotels</h2>

// //           {/* FILTER BAR */}
// //           <div className="flex flex-wrap gap-4 mb-6">
// //             <select className="border px-3 py-2 rounded" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
// //               <option value="All">All Types</option>
// //               <option value="Domestic">Domestic</option>
// //               <option value="International">International</option>
// //             </select>
// //             <select className="border px-3 py-2 rounded" value={filterState} onChange={(e) => setFilterState(e.target.value)}>
// //               <option value="All">All States</option>
// //               {[...new Set(hotels.map(h => h.state?.state))].map((st, idx) => st && <option key={idx} value={st}>{st}</option>)}
// //             </select>
// //             <select className="border px-3 py-2 rounded" value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
// //               <option value="All">All Ratings</option>
// //               {[1,2,3,4,5,6,7].map(r => <option key={r} value={r}>{r} ⭐</option>)}
// //             </select>
// //             <input type="text" placeholder="Search hotel..." className="border px-3 py-2 rounded" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
// //           </div>

// //           {/* TABLE */}
// //           <div className="overflow-x-auto">
// //             <table className="w-full border-collapse">
// //               <thead>
// //                 <tr className="bg-gray-800 text-white">
// //                   <th className="p-3 text-left font-semibold">Hotel Name</th>
// //                   <th className="p-3 text-left font-semibold">Type</th>
// //                   <th className="p-3 text-left font-semibold">State</th>
// //                   <th className="p-3 text-left font-semibold">Destination</th>
// //                   <th className="p-3 text-left font-semibold">Phone</th>
// //                   <th className="p-3 text-left font-semibold">Email</th>
// //                   <th className="p-3 text-left font-semibold">WhatsApp</th>
// //                   <th className="p-3 text-left font-semibold">Rating</th>
// //                   <th className="p-3 text-left font-semibold">Actions</th>
// //                 </tr>
// //               </thead>

// //               <tbody>
// //                 {filteredHotels.length === 0 ? (
// //                   <tr>
// //                     <td colSpan="9" className="p-4 text-center text-gray-500">No hotels found.</td>
// //                   </tr>
// //                 ) : (
// //                   filteredHotels.map((h, index) => (
// //                     <tr key={h._id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
// //                       <td className="p-3 border-b border-gray-200 font-medium text-gray-900">{h.hotelName}</td>
// //                       <td className="p-3 border-b border-gray-200">
// //                         <span className={`px-2 py-1 rounded text-xs font-medium ${h.type === 'Domestic' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{h.type}</span>
// //                       </td>
// //                       <td className="p-3 border-b border-gray-200 text-gray-700">{h.state?.state || "N/A"}</td>
// //                       <td className="p-3 border-b border-gray-200 text-gray-700">{h.destination?.destinationName || "N/A"}</td>
// //                       <td className="p-3 border-b border-gray-200 text-gray-700">{h.hotelPhone}</td>
// //                       <td className="p-3 border-b border-gray-200 text-gray-700">{h.hotelEmail}</td>
// //                       <td className="p-3 border-b border-gray-200 text-gray-700">{h.whatsappNumber || "N/A"}</td>
// //                       <td className="p-3 border-b border-gray-200"><span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">{h.rating ? `${h.rating} ⭐` : "N/A"}</span></td>
// //                       <td className="p-3 border-b border-gray-200 text-gray-700 flex gap-3">
// //                         <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200" onClick={() => onView(h._id)}><FaEye size={18} /></button>
// //                         <button className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200" onClick={() => onEdit(h._id)}><FaEdit size={18} /></button>
// //                         <button className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200" onClick={() => onDelete(h._id)}><FaTrash size={18} /></button>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>

// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CreateHotel;




// import React, { useState, useEffect } from 'react';
// import { Eye, Edit, Trash2 } from "lucide-react";

// const CreateHotel = () => {
//   const [isDomestic, setIsDomestic] = useState(true);
//   const [country, setCountry] = useState("India");
//   const [state, setState] = useState("");
//   const [destination, setDestination] = useState("");
//   const [hotelName, setHotelName] = useState("");
//   const [hotelPhone, setHotelPhone] = useState("");
//   const [hotelAddress, setHotelAddress] = useState("");
//   const [hotelEmail, setHotelEmail] = useState("");
//   const [hotelWhatsapp, setHotelWhatsapp] = useState("");
//   const [contactPersonNumber, setContactPersonNumber] = useState("");
//   const [hotelRating, setHotelRating] = useState("");
//   const [states, setStates] = useState([]);
//   const [destinations, setDestinations] = useState([]);
//   const [hotels, setHotels] = useState([]);

//   // Filters
//   const [filterType, setFilterType] = useState("All");
//   const [filterState, setFilterState] = useState("All");
//   const [filterRating, setFilterRating] = useState("All");
//   const [searchName, setSearchName] = useState("");

//   // Edit mode
//   const [editingHotelId, setEditingHotelId] = useState(null);

//   // View Modal
//   const [viewData, setViewData] = useState(null);

//   // ---------------------------- FETCH APIs ----------------------------
//   const fetchStates = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/state/");
//       const data = await res.json();
//       setStates(data);
//     } catch (err) {
//       console.error("Error fetching states:", err);
//     }
//   };

//   const fetchDestinations = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/destination/");
//       const data = await res.json();
//       setDestinations(data);
//     } catch (err) {
//       console.error("Error fetching destinations:", err);
//     }
//   };

//   const fetchHotels = async () => {
//     try {
//       const res = await fetch("http://localhost:4000/hotel/");
//       const data = await res.json();
//       setHotels(data);
//     } catch (err) {
//       console.error("Error fetching hotels:", err);
//     }
//   };

//   useEffect(() => {
//     fetchStates();
//     fetchDestinations();
//     fetchHotels();
//   }, []);

//   const internationalCountries = [
//     ...new Set(states.filter(s => s.type === "International").map(s => s.country))
//   ];

//   const domesticStates = states.filter(s => s.type === "Domestic");
//   const internationalStates = states.filter(
//     (s) => s.type === "International" && s.country === country
//   );

//   const filteredDestinations = destinations.filter(
//     (d) => d.state?._id === state
//   );

//   useEffect(() => {
//     if (isDomestic) setCountry("India");
//     else setCountry("");
//     setState("");
//     setDestination("");
//   }, [isDomestic]);

//   useEffect(() => {
//     setState("");
//     setDestination("");
//   }, [country]);

//   useEffect(() => {
//     setDestination("");
//   }, [state]);

//   // --------------------------- SUBMIT / UPDATE HOTEL ---------------------------
//   const handleSubmit = async () => {
//     if (!state || !destination || !hotelName || !hotelPhone || !hotelAddress || !hotelEmail || !hotelWhatsapp || !contactPersonNumber  || !hotelRating) {
//       alert("Please fill all required fields");
//       return;
//     }

//     const payload = {
//       type: isDomestic ? "Domestic" : "International",
//       country,
//       state,
//       destination,
//       hotelName,
//       hotelPhone,
//       hotelAddress,
//       hotelEmail,
//       whatsappNumber: hotelWhatsapp,
//       contactPersonNumber,
//       rating: hotelRating,
//     };

//     try {
//       let res, data;

//       if (editingHotelId) {
//         // Update existing hotel
//         res = await fetch(`http://localhost:4000/update/${editingHotelId}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//         data = await res.json();
//         if (!res.ok) throw new Error(data.message || "Update failed");
//         alert("Hotel updated successfully!");
//         setEditingHotelId(null);
//       } else {
//         // Create new hotel
//         res = await fetch("http://localhost:4000/hotel/", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//         data = await res.json();
//         if (!res.ok) throw new Error(data.message || "Failed to create hotel!");
//         alert("Hotel created successfully!");
//       }

//       // Clear form
//       setHotelName("");
//       setHotelPhone("");
//       setHotelAddress("");
//       setHotelEmail("");
//       setHotelWhatsapp("");
//       setContactPersonNumber("");
//       setHotelRating("");
//       setState("");
//       setDestination("");
//       if (!isDomestic) setCountry("");

//       fetchHotels();
//     } catch (error) {
//       console.error("Error saving hotel:", error);
//       alert(error.message || "Server error!");
//     }
//   };

//   // --------------------------- FILTER HOTELS ---------------------------
//   const filteredHotels = hotels.filter((h) => {
//     const matchType = filterType === "All" || h.type === filterType;
//     const matchState = filterState === "All" || h.state?.state === filterState;
//     const matchRating = filterRating === "All" || Number(h.rating) === Number(filterRating);
//     const matchSearch = h.hotelName.toLowerCase().includes(searchName.toLowerCase());

//     return matchType && matchState && matchRating && matchSearch;
//   });

//   // --------------------------- VIEW, EDIT, DELETE ---------------------------
//   const onView = async (hotelId) => {
//     try {
//       const res = await fetch(`http://localhost:4000/hotel/${hotelId}`);
//       if (!res.ok) throw new Error("Failed to fetch hotel details");
//       const data = await res.json();
//       setViewData(data);
//     } catch (err) {
//       console.error(err);
//       alert("Error fetching hotel details");
//     }
//   };

//   const onEdit = async (hotelId) => {
//     try {
//       const res = await fetch(`http://localhost:4000/hotel/${hotelId}`);
//       if (!res.ok) throw new Error("Failed to fetch hotel for edit");
//       const data = await res.json();

//       // Prefill form
//       setEditingHotelId(hotelId);
//       setIsDomestic(data.type === "Domestic");
//       setCountry(data.country || "");
//       setState(data.state?._id || "");
//       setDestination(data.destination?._id || "");
//       setHotelName(data.hotelName || "");
//       setHotelPhone(data.hotelPhone || "");
//       setHotelAddress(data.hotelAddress || "");
//       setHotelEmail(data.hotelEmail || "");
//       setHotelWhatsapp(data.whatsappNumber || "");
//       setContactPersonNumber(data.contactPersonNumber || "");
//       setHotelRating(data.rating || "");

//       // Scroll to form
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     } catch (err) {
//       console.error(err);
//       alert("Error fetching hotel for edit");
//     }
//   };

//   const onDelete = async (hotelId) => {
//     if (!window.confirm("Are you sure you want to delete this hotel?")) return;

//     try {
//       const res = await fetch(`http://localhost:4000/hotel/delete/${hotelId}`, {
//         method: "DELETE",
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Delete failed");
//       alert("Hotel deleted successfully!");
//       fetchHotels();
//     } catch (err) {
//       console.error(err);
//       alert("Error deleting hotel");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">

//       {/* ------------------------- HOTEL CREATE / EDIT FORM ------------------------- */}
//       <div className="flex items-center justify-center p-4 pt-8">
//         <div className="bg-white rounded-lg shadow-md p-8 w-full" style={{maxWidth: '1000px'}}>
//           <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">{editingHotelId ? "Edit Hotel" : "Create Hotel"}</h1>

//           {/* Domestic / International Toggle */}
//           <div className="flex items-center justify-center gap-6 mb-6">
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input type="checkbox" checked={isDomestic} onChange={(e) => setIsDomestic(e.target.checked)} />
//               <span>Domestic</span>
//             </label>
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input type="checkbox" checked={!isDomestic} onChange={(e) => setIsDomestic(!e.target.checked)} />
//               <span>International</span>
//             </label>
//           </div>

//           {/* COUNTRY */}
//           <div className="mb-4">
//             <label className="block mb-2 font-medium">Country</label>
//             {isDomestic ? (
//               <input value="India" className="w-full border p-2 bg-gray-100" disabled />
//             ) : (
//               <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full border p-2">
//                 <option value="">Select Country</option>
//                 {internationalCountries.map((c) => (
//                   <option key={c} value={c}>{c}</option>
//                 ))}
//               </select>
//             )}
//           </div>

//           {/* STATE */}
//           <div className="mb-4">
//             <label className="block mb-2 font-medium">State</label>
//             <select value={state} onChange={(e) => setState(e.target.value)} className="w-full border p-2">
//               <option value="">Select State</option>
//               {isDomestic
//                 ? domesticStates.map((s) => (
//                     <option key={s._id} value={s._id}>{s.state}</option>
//                   ))
//                 : internationalStates.map((s) => (
//                     <option key={s._id} value={s._id}>{s.state}</option>
//                   ))}
//             </select>
//           </div>

//           {/* DESTINATION */}
//           <div className="mb-4">
//             <label className="block mb-2 font-medium">Destination</label>
//             <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full border p-2">
//               <option value="">Select Destination</option>
//               {filteredDestinations.map((d) => (
//                 <option key={d._id} value={d._id}>{d.destinationName}</option>
//               ))}
//             </select>
//           </div>

//           {/* HOTEL NAME */}
//           <div className="mb-4">
//             <label className="block mb-2 font-medium">Hotel Name</label>
//             <input value={hotelName} onChange={(e) => setHotelName(e.target.value)} className="w-full border p-2" />
//           </div>

//           {/* HOTEL PHONE */}
//           <div className="mb-4">
//             <label className="block mb-2 font-medium">Hotel Phone</label>
//             <input value={hotelPhone} onChange={(e) => setHotelPhone(e.target.value)} className="w-full border p-2" />
//           </div>

//           {/* HOTEL ADDRESS */}
//           <div className="mb-4">
//             <label className="block mb-2 font-medium">Hotel Address</label>
//             <textarea value={hotelAddress} onChange={(e) => setHotelAddress(e.target.value)} className="w-full border p-2" rows="3"></textarea>
//           </div>

//           {/* HOTEL EMAIL */}
//           <div className="mb-4">
//             <label className="block mb-2 font-medium">Hotel Email</label>
//             <input type="email" value={hotelEmail} onChange={(e) => setHotelEmail(e.target.value)} className="w-full border p-2" />
//           </div>

//           {/* WHATSAPP NUMBER */}
//           <div className="mb-4">
//             <label className="block mb-2 font-medium">WhatsApp Number</label>
//             <input value={hotelWhatsapp} onChange={(e) => setHotelWhatsapp(e.target.value)} className="w-full border p-2" />
//           </div>

//           {/* CONTACT PERSON NUMBER */}
//           <div className="mb-4">
//             <label className="block mb-2 font-medium">Contact Person Number</label>
//             <input value={contactPersonNumber} onChange={(e) => setContactPersonNumber(e.target.value)} className="w-full border p-2" />
//           </div>

//           {/* HOTEL RATING */}
//           <div className="mb-4">
//             <label className="block mb-2 font-medium">Hotel Rating</label>
//             <select value={hotelRating} onChange={(e) => setHotelRating(e.target.value)} className="w-full border p-2">
//               <option value="">Select Rating</option>
//               {[1,2,3,4,5,6,7].map(r => (
//                 <option key={r} value={r}>{r} Star</option>
//               ))}
//             </select>
//           </div>

//           <button
//             onClick={handleSubmit}
//             className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
//             {editingHotelId ? "Update Hotel" : "Save Hotel"}
//           </button>
//         </div>
//       </div>

//       {/* ------------------------- HOTEL LIST ------------------------- */}
//       <div className="p-6 max-w-7xl mx-auto pb-8">
//         <div className="bg-white rounded-lg shadow-md p-6">

//           <h2 className="text-2xl font-bold text-gray-800 mb-6">All Hotels</h2>

//           {/* FILTER BAR */}
//           <div className="flex flex-wrap gap-4 mb-6">
//             <select className="border px-3 py-2 rounded" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
//               <option value="All">All Types</option>
//               <option value="Domestic">Domestic</option>
//               <option value="International">International</option>
//             </select>
//             <select className="border px-3 py-2 rounded" value={filterState} onChange={(e) => setFilterState(e.target.value)}>
//               <option value="All">All States</option>
//               {[...new Set(hotels.map(h => h.state?.state))].map((st, idx) => st && <option key={idx} value={st}>{st}</option>)}
//             </select>
//             <select className="border px-3 py-2 rounded" value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
//               <option value="All">All Ratings</option>
//               {[1,2,3,4,5,6,7].map(r => <option key={r} value={r}>{r} ⭐</option>)}
//             </select>
//             <input type="text" placeholder="Search hotel..." className="border px-3 py-2 rounded" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
//           </div>

//           {/* TABLE */}
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-gray-800 text-white">
//                   <th className="p-3 text-left font-semibold">Hotel Name</th>
//                   <th className="p-3 text-left font-semibold">Type</th>
//                   <th className="p-3 text-left font-semibold">State</th>
//                   <th className="p-3 text-left font-semibold">Destination</th>
//                   <th className="p-3 text-left font-semibold">Phone</th>
//                   <th className="p-3 text-left font-semibold">Email</th>
//                   <th className="p-3 text-left font-semibold">WhatsApp</th>
//                   <th className="p-3 text-left font-semibold">Rating</th>
//                   <th className="p-3 text-left font-semibold">Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredHotels.length === 0 ? (
//                   <tr>
//                     <td colSpan="9" className="p-4 text-center text-gray-500">No hotels found.</td>
//                   </tr>
//                 ) : (
//                   filteredHotels.map((h, index) => (
//                     <tr key={h._id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
//                       <td className="p-3 border-b border-gray-200 font-medium text-gray-900">{h.hotelName}</td>
//                       <td className="p-3 border-b border-gray-200">
//                         <span className={`px-2 py-1 rounded text-xs font-medium ${h.type === 'Domestic' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{h.type}</span>
//                       </td>
//                       <td className="p-3 border-b border-gray-200 text-gray-700">{h.state?.state || "N/A"}</td>
//                       <td className="p-3 border-b border-gray-200 text-gray-700">{h.destination?.destinationName || "N/A"}</td>
//                       <td className="p-3 border-b border-gray-200 text-gray-700">{h.hotelPhone}</td>
//                       <td className="p-3 border-b border-gray-200 text-gray-700">{h.hotelEmail}</td>
//                       <td className="p-3 border-b border-gray-200 text-gray-700">{h.whatsappNumber || "N/A"}</td>
//                       <td className="p-3 border-b border-gray-200"><span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">{h.rating ? `${h.rating} ⭐` : "N/A"}</span></td>
//                       <td className="p-3 border-b border-gray-200 text-gray-700 flex gap-3">
//                         <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200" onClick={() => onView(h._id)}><Eye size={18} /></button>
//                         <button className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200" onClick={() => onEdit(h._id)}><Edit size={18} /></button>
//                         <button className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200" onClick={() => onDelete(h._id)}><Trash2 size={18} /></button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//         </div>
//       </div>

//       {/* View Modal - Centered on Screen */}
//       {viewData && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="w-96 bg-white border rounded-lg shadow-lg p-6 relative max-h-screen overflow-y-auto">
//             <button
//               onClick={() => setViewData(null)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
//               aria-label="Close view modal"
//             >
//               &times;
//             </button>

//             <h3 className="text-xl font-bold mb-4">Hotel Details</h3>
//             <div className="space-y-2">
//               <p><strong>Hotel Name:</strong> {viewData.hotelName}</p>
//               <p><strong>Type:</strong> {viewData.type}</p>
//               <p><strong>Country:</strong> {viewData.country || "N/A"}</p>
//               <p><strong>State:</strong> {viewData.state?.state || "N/A"}</p>
//               <p><strong>Destination:</strong> {viewData.destination?.destinationName || "N/A"}</p>
//               <p><strong>Phone:</strong> {viewData.hotelPhone}</p>
//               <p><strong>Email:</strong> {viewData.hotelEmail}</p>
//               <p><strong>WhatsApp:</strong> {viewData.whatsappNumber || "N/A"}</p>
//               <p><strong>Contact Person:</strong> {viewData.contactPersonNumber || "N/A"}</p>
//               <p><strong>Address:</strong> {viewData.hotelAddress}</p>
//               <p><strong>Rating:</strong> {viewData.rating ? `${viewData.rating} ⭐` : "N/A"}</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateHotel;



import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2 } from "lucide-react";

const CreateHotel = () => {
  const [isDomestic, setIsDomestic] = useState(true);
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [destination, setDestination] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [hotelPhone, setHotelPhone] = useState("");
  const [hotelAddress, setHotelAddress] = useState("");
  const [hotelEmail, setHotelEmail] = useState("");
  const [hotelWhatsapp, setHotelWhatsapp] = useState("");
  const [contactPersonNumber, setContactPersonNumber] = useState("");
  const [hotelRating, setHotelRating] = useState("");
  const [states, setStates] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);

  const [filterType, setFilterType] = useState("All");
  const [filterState, setFilterState] = useState("All");
  const [filterRating, setFilterRating] = useState("All");
  const [searchName, setSearchName] = useState("");

  const [editingHotelId, setEditingHotelId] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);

  const [editFormData, setEditFormData] = useState({
    isDomestic: true,
    country: "India",
    state: "",
    destination: "",
    hotelName: "",
    hotelPhone: "",
    hotelAddress: "",
    hotelEmail: "",
    hotelWhatsapp: "",
    contactPersonNumber: "",
    hotelRating: ""
  });

  const fetchStates = async () => {
    try {
      const res = await fetch("http://localhost:4000/state/");
      const data = await res.json();
      setStates(data);
    } catch (err) {
      console.error("Error fetching states:", err);
    }
  };

  const fetchDestinations = async () => {
    try {
      const res = await fetch("http://localhost:4000/destination/");
      const data = await res.json();
      setDestinations(data);
    } catch (err) {
      console.error("Error fetching destinations:", err);
    }
  };

  const fetchHotels = async () => {
    try {
      const res = await fetch("http://localhost:4000/hotel/");
      const data = await res.json();
      setHotels(data);
    } catch (err) {
      console.error("Error fetching hotels:", err);
    }
  };

  useEffect(() => {
    fetchStates();
    fetchDestinations();
    fetchHotels();
  }, []);

  const internationalCountries = [
    ...new Set(states.filter(s => s.type === "International").map(s => s.country))
  ];

  const domesticStates = states.filter(s => s.type === "Domestic");
  const internationalStates = states.filter(
    (s) => s.type === "International" && s.country === country
  );

  const filteredDestinations = destinations.filter(
    (d) => d.state?._id === state
  );

  useEffect(() => {
    if (isDomestic) setCountry("India");
    else setCountry("");
    setState("");
    setDestination("");
  }, [isDomestic]);

  useEffect(() => {
    setState("");
    setDestination("");
  }, [country]);

  useEffect(() => {
    setDestination("");
  }, [state]);

  const clearForm = () => {
    setHotelName("");
    setHotelPhone("");
    setHotelAddress("");
    setHotelEmail("");
    setHotelWhatsapp("");
    setContactPersonNumber("");
    setHotelRating("");
    setState("");
    setDestination("");
    if (!isDomestic) setCountry("");
  };

  const handleSubmit = async () => {
    if (!state || !destination || !hotelName || !hotelPhone || !hotelAddress || !hotelEmail || !hotelWhatsapp || !contactPersonNumber  || !hotelRating) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      type: isDomestic ? "Domestic" : "International",
      country,
      state,
      destination,
      hotelName,
      hotelPhone,
      hotelAddress,
      hotelEmail,
      whatsappNumber: hotelWhatsapp,
      contactPersonNumber,
      rating: hotelRating,
    };

    try {
      let res = await fetch("http://localhost:4000/hotel/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create hotel!");
      alert("Hotel created successfully!");

      clearForm();
      fetchHotels();
    } catch (error) {
      console.error("Error saving hotel:", error);
      alert(error.message || "Server error!");
    }
  };

  const filteredHotels = hotels.filter((h) => {
    const matchType = filterType === "All" || h.type === filterType;
    const matchState = filterState === "All" || h.state?.state === filterState;
    const matchRating = filterRating === "All" || Number(h.rating) === Number(filterRating);
    const matchSearch = h.hotelName.toLowerCase().includes(searchName.toLowerCase());

    return matchType && matchState && matchRating && matchSearch;
  });

  const onView = async (hotelId) => {
    try {
      const res = await fetch(`http://localhost:4000/hotel/${hotelId}`);
      if (!res.ok) throw new Error("Failed to fetch hotel details");
      const data = await res.json();
      setViewData(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching hotel details");
    }
  };

  const onEdit = async (hotelId) => {
    setViewData(null);
    
    try {
      const res = await fetch(`http://localhost:4000/hotel/${hotelId}`);
      if (!res.ok) throw new Error("Failed to fetch hotel for edit");

      const data = await res.json();
      setEditData(data);
      setEditingHotelId(hotelId);

      setEditFormData({
        isDomestic: data.type === "Domestic",
        country: data.country || "",
        state: data.state?._id || "",
        destination: data.destination?._id || "",
        hotelName: data.hotelName || "",
        hotelPhone: data.hotelPhone || "",
        hotelAddress: data.hotelAddress || "",
        hotelEmail: data.hotelEmail || "",
        hotelWhatsapp: data.whatsappNumber || "",
        contactPersonNumber: data.contactPersonNumber || "",
        hotelRating: data.rating || ""
      });
    } catch (err) {
      console.error(err);
      alert("Error fetching hotel for edit");
    }
  };

  const onDelete = async (hotelId) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;

    try {
      const res = await fetch(`http://localhost:4000/hotel/delete/${hotelId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");

      alert("Hotel deleted successfully!");
      fetchHotels();
    } catch (err) {
      console.error(err);
      alert("Error deleting hotel");
    }
  };

  const handleUpdateHotel = async () => {
    if (!editFormData.state || !editFormData.destination || !editFormData.hotelName || !editFormData.hotelPhone || !editFormData.hotelAddress || !editFormData.hotelEmail || !editFormData.hotelWhatsapp || !editFormData.contactPersonNumber || !editFormData.hotelRating) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      type: editFormData.isDomestic ? "Domestic" : "International",
      country: editFormData.country,
      state: editFormData.state,
      destination: editFormData.destination,
      hotelName: editFormData.hotelName,
      hotelPhone: editFormData.hotelPhone,
      hotelAddress: editFormData.hotelAddress,
      hotelEmail: editFormData.hotelEmail,
      whatsappNumber: editFormData.hotelWhatsapp,
      contactPersonNumber: editFormData.contactPersonNumber,
      rating: editFormData.hotelRating,
    };

    try {
      const res = await fetch(`http://localhost:4000/hotel/update/${editingHotelId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      alert("Hotel updated successfully!");
      setEditData(null);
      setEditingHotelId(null);
      fetchHotels();
    } catch (error) {
      console.error("Error updating hotel:", error);
      alert(error.message || "Server error!");
    }
  };

  const filteredEditDestinations = destinations.filter(
    (d) => d.state?._id === editFormData.state
  );

  const editDomesticStates = states.filter(s => s.type === "Domestic");
  const editInternationalStates = states.filter(
    (s) => s.type === "International" && s.country === editFormData.country
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ------------------------- HOTEL CREATE / EDIT FORM ------------------------- */}
      <div className="flex items-center justify-center p-4 pt-8">
        <div className="bg-white rounded-lg shadow-md p-8 w-full" style={{maxWidth: '1000px'}}>
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Create Hotel</h1>

          {/* Domestic / International Toggle */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isDomestic} onChange={(e) => setIsDomestic(e.target.checked)} />
              <span>Domestic</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={!isDomestic} onChange={(e) => setIsDomestic(!e.target.checked)} />
              <span>International</span>
            </label>
          </div>

          {/* COUNTRY */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Country</label>
            {isDomestic ? (
              <input value="India" className="w-full border p-2 bg-gray-100" disabled />
            ) : (
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full border p-2">
                <option value="">Select Country</option>
                {internationalCountries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
          </div>

          {/* STATE */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">State</label>
            <select value={state} onChange={(e) => setState(e.target.value)} className="w-full border p-2">
              <option value="">Select State</option>
              {isDomestic
                ? domesticStates.map((s) => (
                    <option key={s._id} value={s._id}>{s.state}</option>
                  ))
                : internationalStates.map((s) => (
                    <option key={s._id} value={s._id}>{s.state}</option>
                  ))}
            </select>
          </div>

          {/* DESTINATION */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Destination</label>
            <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full border p-2">
              <option value="">Select Destination</option>
              {filteredDestinations.map((d) => (
                <option key={d._id} value={d._id}>{d.destinationName}</option>
              ))}
            </select>
          </div>

          {/* HOTEL NAME */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Hotel Name</label>
            <input value={hotelName} onChange={(e) => setHotelName(e.target.value)} className="w-full border p-2" />
          </div>

          {/* HOTEL PHONE */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Hotel Phone</label>
            <input value={hotelPhone} onChange={(e) => setHotelPhone(e.target.value)} className="w-full border p-2" />
          </div>

          {/* HOTEL ADDRESS */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Hotel Address</label>
            <textarea value={hotelAddress} onChange={(e) => setHotelAddress(e.target.value)} className="w-full border p-2" rows="3"></textarea>
          </div>

          {/* HOTEL EMAIL */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Hotel Email</label>
            <input type="email" value={hotelEmail} onChange={(e) => setHotelEmail(e.target.value)} className="w-full border p-2" />
          </div>

          {/* WHATSAPP NUMBER */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">WhatsApp Number</label>
            <input value={hotelWhatsapp} onChange={(e) => setHotelWhatsapp(e.target.value)} className="w-full border p-2" />
          </div>

          {/* CONTACT PERSON NUMBER */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Contact Person Number</label>
            <input value={contactPersonNumber} onChange={(e) => setContactPersonNumber(e.target.value)} className="w-full border p-2" />
          </div>

          {/* HOTEL RATING */}
          <div className="mb-4">
            <label className="block mb-2 font-medium">Hotel Rating</label>
            <select value={hotelRating} onChange={(e) => setHotelRating(e.target.value)} className="w-full border p-2">
              <option value="">Select Rating</option>
              {[1,2,3,4,5,6,7].map(r => (
                <option key={r} value={r}>{r} Star</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
            Save Hotel
          </button>
        </div>
      </div>

      {/* ------------------------- HOTEL LIST ------------------------- */}
      <div className="p-6 max-w-7xl mx-auto pb-8">
        <div className="bg-white rounded-lg shadow-md p-6">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Hotels</h2>

          {/* FILTER BAR */}
          <div className="flex flex-wrap gap-4 mb-6">
            <select className="border px-3 py-2 rounded" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="All">All Types</option>
              <option value="Domestic">Domestic</option>
              <option value="International">International</option>
            </select>
            <select className="border px-3 py-2 rounded" value={filterState} onChange={(e) => setFilterState(e.target.value)}>
              <option value="All">All States</option>
              {[...new Set(hotels.map(h => h.state?.state))].map((st, idx) => st && <option key={idx} value={st}>{st}</option>)}
            </select>
            <select className="border px-3 py-2 rounded" value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
              <option value="All">All Ratings</option>
              {[1,2,3,4,5,6,7].map(r => <option key={r} value={r}>{r} ⭐</option>)}
            </select>
            <input type="text" placeholder="Search hotel..." className="border px-3 py-2 rounded" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-3 text-left font-semibold">Hotel Name</th>
                  <th className="p-3 text-left font-semibold">Type</th>
                  <th className="p-3 text-left font-semibold">State</th>
                  <th className="p-3 text-left font-semibold">Destination</th>
                  <th className="p-3 text-left font-semibold">Phone</th>
                  <th className="p-3 text-left font-semibold">Email</th>
                  <th className="p-3 text-left font-semibold">WhatsApp</th>
                  <th className="p-3 text-left font-semibold">Rating</th>
                  <th className="p-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredHotels.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-500">No hotels found.</td>
                  </tr>
                ) : (
                  filteredHotels.map((h, index) => (
                    <tr key={h._id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="p-3 border-b border-gray-200 font-medium text-gray-900">{h.hotelName}</td>
                      <td className="p-3 border-b border-gray-200">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${h.type === 'Domestic' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{h.type}</span>
                      </td>
                      <td className="p-3 border-b border-gray-200 text-gray-700">{h.state?.state || "N/A"}</td>
                      <td className="p-3 border-b border-gray-200 text-gray-700">{h.destination?.destinationName || "N/A"}</td>
                      <td className="p-3 border-b border-gray-200 text-gray-700">{h.hotelPhone}</td>
                      <td className="p-3 border-b border-gray-200 text-gray-700">{h.hotelEmail}</td>
                      <td className="p-3 border-b border-gray-200 text-gray-700">{h.whatsappNumber || "N/A"}</td>
                      <td className="p-3 border-b border-gray-200"><span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">{h.rating ? `${h.rating} ⭐` : "N/A"}</span></td>
                      <td className="p-3 border-b border-gray-200 text-gray-700 flex gap-3">
                        <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200" onClick={() => onView(h._id)}><Eye size={18} /></button>
                        <button className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200" onClick={() => onEdit(h._id)}><Edit size={18} /></button>
                        <button className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200" onClick={() => onDelete(h._id)}><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* View Modal - Centered on Screen */}
      {viewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-96 bg-white border rounded-lg shadow-lg p-6 relative max-h-screen overflow-y-auto">
            <button
              onClick={() => setViewData(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
              aria-label="Close view modal"
            >
              &times;
            </button>

            <h3 className="text-xl font-bold mb-4">Hotel Details</h3>
            <div className="space-y-2">
              <p><strong>Hotel Name:</strong> {viewData.hotelName}</p>
              <p><strong>Type:</strong> {viewData.type}</p>
              <p><strong>Country:</strong> {viewData.country || "N/A"}</p>
              <p><strong>State:</strong> {viewData.state?.state || "N/A"}</p>
              <p><strong>Destination:</strong> {viewData.destination?.destinationName || "N/A"}</p>
              <p><strong>Phone:</strong> {viewData.hotelPhone}</p>
              <p><strong>Email:</strong> {viewData.hotelEmail}</p>
              <p><strong>WhatsApp:</strong> {viewData.whatsappNumber || "N/A"}</p>
              <p><strong>Contact Person:</strong> {viewData.contactPersonNumber || "N/A"}</p>
              <p><strong>Address:</strong> {viewData.hotelAddress}</p>
              <p><strong>Rating:</strong> {viewData.rating ? `${viewData.rating} ⭐` : "N/A"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - Centered on Screen */}
      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-2xl bg-white border rounded-lg shadow-lg p-6 relative max-h-screen overflow-y-auto m-4">
            <button
              onClick={() => {
                setEditData(null);
                setEditingHotelId(null);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
              aria-label="Close edit modal"
            >
              &times;
            </button>

            <h3 className="text-xl font-bold mb-4">Edit Hotel</h3>
            
            {/* Domestic / International Toggle */}
            <div className="flex items-center gap-6 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={editFormData.isDomestic} 
                  onChange={(e) => setEditFormData({...editFormData, isDomestic: e.target.checked, country: e.target.checked ? "India" : "", state: "", destination: ""})} 
                />
                <span>Domestic</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={!editFormData.isDomestic} 
                  onChange={(e) => setEditFormData({...editFormData, isDomestic: !e.target.checked, country: !e.target.checked ? "India" : "", state: "", destination: ""})} 
                />
                <span>International</span>
              </label>
            </div>

            {/* COUNTRY */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Country</label>
              {editFormData.isDomestic ? (
                <input value="India" className="w-full border p-2 bg-gray-100" disabled />
              ) : (
                <select value={editFormData.country} onChange={(e) => setEditFormData({...editFormData, country: e.target.value, state: "", destination: ""})} className="w-full border p-2">
                  <option value="">Select Country</option>
                  {internationalCountries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}
            </div>

            {/* STATE */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">State</label>
              <select value={editFormData.state} onChange={(e) => setEditFormData({...editFormData, state: e.target.value, destination: ""})} className="w-full border p-2">
                <option value="">Select State</option>
                {editFormData.isDomestic
                  ? editDomesticStates.map((s) => (
                      <option key={s._id} value={s._id}>{s.state}</option>
                    ))
                  : editInternationalStates.map((s) => (
                      <option key={s._id} value={s._id}>{s.state}</option>
                    ))}
              </select>
            </div>

            {/* DESTINATION */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Destination</label>
              <select value={editFormData.destination} onChange={(e) => setEditFormData({...editFormData, destination: e.target.value})} className="w-full border p-2">
                <option value="">Select Destination</option>
                {filteredEditDestinations.map((d) => (
                  <option key={d._id} value={d._id}>{d.destinationName}</option>
                ))}
              </select>
            </div>

            {/* HOTEL NAME */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Hotel Name</label>
              <input value={editFormData.hotelName} onChange={(e) => setEditFormData({...editFormData, hotelName: e.target.value})} className="w-full border p-2" />
            </div>

            {/* HOTEL PHONE */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Hotel Phone</label>
              <input value={editFormData.hotelPhone} onChange={(e) => setEditFormData({...editFormData, hotelPhone: e.target.value})} className="w-full border p-2" />
            </div>

            {/* HOTEL ADDRESS */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Hotel Address</label>
              <textarea value={editFormData.hotelAddress} onChange={(e) => setEditFormData({...editFormData, hotelAddress: e.target.value})} className="w-full border p-2" rows="3"></textarea>
            </div>

            {/* HOTEL EMAIL */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Hotel Email</label>
              <input type="email" value={editFormData.hotelEmail} onChange={(e) => setEditFormData({...editFormData, hotelEmail: e.target.value})} className="w-full border p-2" />
            </div>

            {/* WHATSAPP NUMBER */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">WhatsApp Number</label>
              <input value={editFormData.hotelWhatsapp} onChange={(e) => setEditFormData({...editFormData, hotelWhatsapp: e.target.value})} className="w-full border p-2" />
            </div>

            {/* CONTACT PERSON NUMBER */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Contact Person Number</label>
              <input value={editFormData.contactPersonNumber} onChange={(e) => setEditFormData({...editFormData, contactPersonNumber: e.target.value})} className="w-full border p-2" />
            </div>

            {/* HOTEL RATING */}
            <div className="mb-4">
              <label className="block mb-2 font-medium">Hotel Rating</label>
              <select value={editFormData.hotelRating} onChange={(e) => setEditFormData({...editFormData, hotelRating: e.target.value})} className="w-full border p-2">
                <option value="">Select Rating</option>
                {[1,2,3,4,5,6,7].map(r => (
                  <option key={r} value={r}>{r} Star</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpdateHotel}
                className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition">
                Update Hotel
              </button>
              <button
                onClick={() => {
                  setEditData(null);
                  setEditingHotelId(null);
                }}
                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateHotel;
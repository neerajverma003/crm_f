// import React, { useState, useEffect, useMemo } from "react";
// import { X } from "lucide-react";

// const ChequeExpense = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [cheques, setCheques] = useState([]); // ✅ state for fetched cheques
//   const [editingChequeId, setEditingChequeId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedTab, setSelectedTab] = useState("pending");

//   const [formData, setFormData] = useState({
//     issuedDate: "",
//     toWhom: "",
//     validity: "",
//     amount: "",
//     chequeNumber: "",
//     reason: "",
//     entryDate: new Date().toISOString().split("T")[0], // today's date auto-filled
//   });

//   // ✅ Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // ✅ Fetch all cheques from backend
//   const fetchCheques = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("http://localhost:4000/cheque/get");
//       if (!res.ok) throw new Error("Failed to fetch cheques");
//       const data = await res.json();
//       console.log(data)
//       setCheques(data); // Assuming backend sends { cheques: [...] }
//     } catch (error) {
//       console.error("❌ Error fetching cheques:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Run once when component loads
//   useEffect(() => {
//     fetchCheques();
//   }, []);

//   // ✅ Utilities for totals
//   const parseAmount = (amt) => {
//     if (amt === null || amt === undefined) return 0;
//     try {
//       const s = amt.toString().replace(/,/g, "").replace(/₹/g, "").trim();
//       return Number(s) || 0;
//     } catch (e) {
//       return 0;
//     }
//   };

//   const todayString = new Date().toISOString().split("T")[0];

//   const todayTotal = useMemo(() => {
//     if (!cheques || cheques.length === 0) return 0;
//     return cheques.reduce((acc, c) => {
//       try {
//         if (c.entryDate === todayString) return acc + parseAmount(c.chequeAmount);
//       } catch (e) {
//         return acc;
//       }
//       return acc;
//     }, 0);
//   }, [cheques, todayString]);

//   const todayTotalFiltered = useMemo(() => {
//     if (!cheques || cheques.length === 0) return 0;
//     if (selectedTab === 'all') return todayTotal;
//     return cheques.reduce((acc, c) => {
//       try {
//         if ((c.status || 'pending').toLowerCase() === selectedTab && c.entryDate === todayString) return acc + parseAmount(c.chequeAmount);
//       } catch (e) {
//         return acc;
//       }
//       return acc;
//     }, 0);
//   }, [cheques, todayString, selectedTab]);

//   const monthlyTotal = useMemo(() => {
//     if (!cheques || cheques.length === 0) return 0;
//     const now = new Date();
//     const curMonth = now.getMonth();
//     const curYear = now.getFullYear();
//     return cheques.reduce((acc, c) => {
//       try {
//         const dateObj = new Date(c.entryDate);
//         if (dateObj.getMonth() === curMonth && dateObj.getFullYear() === curYear) {
//           return acc + parseAmount(c.chequeAmount);
//         }
//       } catch (e) {
//         return acc;
//       }
//       return acc;
//     }, 0);
//   }, [cheques]);

//   const monthlyTotalFiltered = useMemo(() => {
//     if (!cheques || cheques.length === 0) return 0;
//     if (selectedTab === 'all') return monthlyTotal;
//     const now = new Date();
//     const curMonth = now.getMonth();
//     const curYear = now.getFullYear();
//     return cheques.reduce((acc, c) => {
//       try {
//         const dateObj = new Date(c.entryDate);
//         if ((c.status || 'pending').toLowerCase() === selectedTab && dateObj.getMonth() === curMonth && dateObj.getFullYear() === curYear) {
//           return acc + parseAmount(c.chequeAmount);
//         }
//       } catch (e) {
//         return acc;
//       }
//       return acc;
//     }, 0);
//   }, [cheques, selectedTab]);

//   const formatINR = (value) => {
//     try {
//       return new Intl.NumberFormat("en-IN").format(value);
//     } catch (e) {
//       return value;
//     }
//   };

//   const STATUSES = ["clear", "shifted", "pending", "cancelled"];
//   const FILTER_OPTIONS = ["all", ...STATUSES];

//   const totalsByStatus = useMemo(() => {
//     const map = {};
//     STATUSES.forEach((s) => {
//       map[s] = { count: 0, total: 0 };
//     });
//     cheques.forEach((c) => {
//       const st = (c.status || "pending").toLowerCase();
//       const amt = parseAmount(c.chequeAmount);
//       if (!map[st]) map[st] = { count: 0, total: 0 };
//       map[st].count += 1;
//       map[st].total += amt;
//     });
//     return map;
//   }, [cheques]);

//   const filteredCheques = useMemo(() => {
//     if (!cheques) return [];
//     if (selectedTab === 'all') return cheques;
//     return cheques.filter((c) => ((c.status || 'pending').toLowerCase() === selectedTab));
//   }, [cheques, selectedTab]);

//   const updateStatus = async (id, newStatus) => {
//     try {
//       // Optimistic update (optional): update local state first
//       setCheques((prev) => prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c)));
//       const res = await fetch(`http://localhost:4000/cheque/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       });
//       if (!res.ok) throw new Error("Failed to update status");
//       // refresh list to ensure server-side updates are reflected
//       await fetchCheques();
//       alert("Status updated successfully");
//     } catch (error) {
//       console.error("Error updating status:", error);
//       alert("Unable to update status, try again.");
//       // revert optimistic update (re-fetch)
//       fetchCheques();
//     }
//   };

//   // ✅ Handle form submission (POST)
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const expenseEntry = {
//       chequeIssuedDate: formData.issuedDate,
//       receiverName: formData.toWhom,
//       chequeValid: formData.validity,
//       chequeNumber: formData.chequeNumber,
//       chequeAmount: formData.amount,
//       reasonToIssue: formData.reason,
//     };
//     if (!editingChequeId) {
//       expenseEntry.entryDate = new Date().toISOString().split("T")[0];
//     }

//     try {
//       const url = editingChequeId
//         ? `http://localhost:4000/cheque/${editingChequeId}`
//         : "http://localhost:4000/cheque";
//       const method = editingChequeId ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(expenseEntry),
//       });

//       if (!res.ok) throw new Error("Failed to save cheque expense");

//       const data = await res.json();
//       console.log("✅ Cheque Expense Saved:", data);

//       alert(editingChequeId ? "Cheque expense updated successfully!" : "Cheque expense added successfully!");
//       setShowModal(false);
//       setEditingChequeId(null);
//       fetchCheques(); // ✅ Refresh list after adding/ editing cheque

//       // Reset form
//       setFormData({
//         issuedDate: "",
//         toWhom: "",
//         validity: "",
//         amount: "",
//         chequeNumber: "",
//         reason: "",
//         entryDate: new Date().toISOString().split("T")[0],
//       });
//     } catch (error) {
//       console.error("❌ Error saving cheque expense:", error);
//       alert("Error saving cheque expense. Please try again.");
//     }
//   };

//   // Open modal with cheque data for editing
//   const openEditModal = (cheque) => {
//     setEditingChequeId(cheque._id);
//     setFormData({
//       issuedDate: new Date(cheque.chequeIssuedDate).toISOString().split("T")[0],
//       toWhom: cheque.receiverName || "",
//       validity: new Date(cheque.chequeValid).toISOString().split("T")[0],
//       amount: cheque.chequeAmount || "",
//       chequeNumber: cheque.chequeNumber || "",
//       reason: cheque.reasonToIssue || "",
//       entryDate: cheque.entryDate || new Date().toISOString().split("T")[0],
//     });
//     setShowModal(true);
//   };
// if(cheques)
//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Status buttons - show at very top for quick access before summary cards */}
//       <div className="flex gap-2 items-center mb-4">
//         {FILTER_OPTIONS.map((s) => (
//           <button
//             key={`top-${s}`}
//             onClick={() => setSelectedTab(s)}
//             className={`px-3 py-1 rounded-md border ${selectedTab === s ? 'bg-black text-white' : 'bg-white text-black'}`}
//             aria-pressed={selectedTab === s}
//           >
//             <div className="text-sm font-medium capitalize">{s}</div>
//             <div className="text-xs">{s === 'all' ? cheques.length : (totalsByStatus[s]?.count || 0)} • ₹{s === 'all' ? formatINR(cheques.reduce((acc, c) => acc + parseAmount(c.chequeAmount), 0)) : formatINR(totalsByStatus[s]?.total || 0)}</div>
//           </button>
//         ))}
//       </div>
//       {/* ✅ Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div className="rounded-md border border-gray-300 bg-white p-4">
//           <div className="text-lg font-semibold text-gray-800 mb-1">
//             Today Cheque Expense
//           </div>
//           <div className="text-2xl font-bold text-black">₹{formatINR(todayTotal)}</div>
//           <div className="text-sm text-gray-500 mt-1">Showing <span className="capitalize">{selectedTab}</span>: ₹{formatINR(todayTotalFiltered)}</div>
//         </div>
//         <div className="rounded-md border border-gray-300 bg-white p-4">
//           <div className="text-lg font-semibold text-gray-800 mb-1">
//             Monthly Cheque Expense
//           </div>
//           <div className="text-2xl font-bold text-black">₹{formatINR(monthlyTotal)}</div>
//           <div className="text-sm text-gray-500 mt-1">Showing <span className="capitalize">{selectedTab}</span>: ₹{formatINR(monthlyTotalFiltered)}</div>
//         </div>
//       </div>

//       {/* ✅ Header + Add Button and Tabs */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Cheque Expenses</h2>
        
//         <button
//           onClick={() => { setEditingChequeId(null); setShowModal(true); }}
//           className="flex items-center gap-2 text-nowrap rounded-lg bg-black text-white font-medium 
//           px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base hover:bg-gray-800"
//         >
//           + Add Cheque
//         </button>
//       </div>

//       {/* Tabs for statuses */}
//       {/* <div className="flex gap-2 items-center mb-4">
//         {FILTER_OPTIONS.map((s) => (
//           <button
//             key={`bottom-${s}`}
//             onClick={() => setSelectedTab(s)}
//             className={`px-3 py-1 rounded-md border ${selectedTab === s ? 'bg-black text-white' : 'bg-white text-black'}`}
//             aria-pressed={selectedTab === s}
//           >
//             <div className="text-sm font-medium capitalize">{s}</div>
//             <div className="text-xs">{s === 'all' ? cheques.length : (totalsByStatus[s]?.count || 0)} • ₹{s === 'all' ? formatINR(cheques.reduce((acc, c) => acc + parseAmount(c.chequeAmount), 0)) : formatINR(totalsByStatus[s]?.total || 0)}</div>
//           </button>
//         ))}
//       </div> */}

//       {/* ✅ Cheque Table */}
//       <div className="overflow-x-auto bg-white rounded-lg shadow-md border">
//         {loading ? (
//           <p className="p-4 text-gray-600 text-center">Loading cheques...</p>
//         ) : cheques.length === 0 ? (
//           <p className="p-4 text-gray-600 text-center">No cheque records found.</p>
//         ) : filteredCheques.length === 0 ? (
//           <p className="p-4 text-gray-600 text-center">No records for {selectedTab} status.</p>
//         ) : (
//           <table className="min-w-full border-collapse">
//             <thead className="bg-gray-100 border-b">
//               <tr>
//                 <th className="p-3 text-left text-sm font-semibold text-gray-600">Entry Date</th>
//                 <th className="p-3 text-left text-sm font-semibold text-gray-600">Issued Date</th>
//                 <th className="p-3 text-left text-sm font-semibold text-gray-600">To Whom</th>
//                 <th className="p-3 text-left text-sm font-semibold text-gray-600">Validity</th>
//                 <th className="p-3 text-left text-sm font-semibold text-gray-600">Cheque Number</th>
//                 <th className="p-3 text-left text-sm font-semibold text-gray-600">Amount</th>
//                 <th className="p-3 text-left text-sm font-semibold text-gray-600">Reason</th>
//                 <th className="p-3 text-left text-sm font-semibold text-gray-600">Status</th>
//                 <th className="p-3 text-left text-sm font-semibold text-gray-600">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredCheques.map((cheque) => (
//                 <tr key={cheque._id} className="border-b hover:bg-gray-50">
//                   <td className="p-3 text-sm text-gray-800">{cheque.entryDate}</td>
//                   <td className="p-3 text-sm text-gray-800">
//                     {new Date(cheque.chequeIssuedDate).toLocaleDateString()}
//                   </td>
//                   <td className="p-3 text-sm text-gray-800">{cheque.receiverName}</td>
//                   <td className="p-3 text-sm text-gray-800">
//                     {new Date(cheque.chequeValid).toLocaleDateString()}
//                   </td>
//                   <td className="p-3 text-sm text-gray-800">{cheque.chequeNumber}</td>
//                   <td className="p-3 text-sm text-gray-800">₹{cheque.chequeAmount}</td>
//                   <td className="p-3 text-sm text-gray-800">{cheque.reasonToIssue}</td>
//                   <td className="p-3 text-sm text-gray-800 capitalize">{cheque.status || 'pending'}</td>
//                   <td className="p-3 text-sm text-gray-800">
//                     <select
//                       value={(cheque.status || 'pending')}
//                       onChange={(e) => updateStatus(cheque._id, e.target.value)}
//                       className="mr-3 border px-2 py-1 rounded-md"
//                     >
//                       {STATUSES.map((st) => (
//                         <option value={st} key={st}>{st}</option>
//                       ))}
//                     </select>

//                     <button
//                       onClick={() => openEditModal(cheque)}
//                       className="px-3 py-1 rounded-md text-white bg-blue-600 hover:bg-blue-700 mr-2"
//                     >
//                       Edit
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* ✅ Add Cheque Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">
//                 {editingChequeId ? "Edit Cheque Expense" : "Add Cheque Expense"}
//               </h2>
//               <button
//                 onClick={() => { setShowModal(false); setEditingChequeId(null); }}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 {/* Entry Date */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Entry Date
//                   </label>
//                   <input
//                     type="date"
//                     name="entryDate"
//                     value={formData.entryDate}
//                     readOnly
//                     className="w-full border rounded-lg p-2 mt-1 bg-gray-100 text-gray-600 cursor-not-allowed"
//                   />
//                 </div>

//                 {/* Issued Date */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Cheque Issued Date
//                   </label>
//                   <input
//                     type="date"
//                     name="issuedDate"
//                     value={formData.issuedDate}
//                     onChange={handleChange}
//                     required
//                     className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 {/* To Whom */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     To Whom Issued
//                   </label>
//                   <input
//                     type="text"
//                     name="toWhom"
//                     value={formData.toWhom}
//                     onChange={handleChange}
//                     placeholder="Enter receiver name"
//                     required
//                     className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 {/* Validity */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Cheque Validity (Date)
//                   </label>
//                   <input
//                     type="date"
//                     name="validity"
//                     value={formData.validity}
//                     onChange={handleChange}
//                     required
//                     className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 {/* Cheque Number */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Cheque Number
//                   </label>
//                   <input
//                     type="text"
//                     name="chequeNumber"
//                     value={formData.chequeNumber}
//                     onChange={handleChange}
//                     placeholder="Enter cheque number"
//                     required
//                     className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 {/* Amount */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Cheque Amount
//                   </label>
//                   <input
//                     type="number"
//                     name="amount"
//                     value={formData.amount}
//                     onChange={handleChange}
//                     placeholder="Enter amount"
//                     required
//                     className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 {/* Reason */}
//                 <div className="col-span-2">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Reason to Issue
//                   </label>
//                   <textarea
//                     name="reason"
//                     value={formData.reason}
//                     onChange={handleChange}
//                     placeholder="Enter reason for issuing cheque"
//                     required
//                     rows="2"
//                     className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 resize-none"
//                   />
//                 </div>
//               </div>

//               {/* Footer */}
//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => { setShowModal(false); setEditingChequeId(null); }}
//                   className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
//                 >
//                   {editingChequeId ? "Update Cheque Expense" : "Add Cheque Expense"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChequeExpense;


import React, { useState, useEffect, useMemo } from "react";
import { X, Edit2 } from "lucide-react";

const ChequeExpense = () => {
  const [showModal, setShowModal] = useState(false);
  const [cheques, setCheques] = useState([]); // ✅ state for fetched cheques
  const [editingChequeId, setEditingChequeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [formData, setFormData] = useState({
    issuedDate: "",
    toWhom: "",
    validity: "",
    amount: "",
    chequeNumber: "",
    reason: "",
    entryDate: new Date().toISOString().split("T")[0], // today's date auto-filled
  });

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Fetch all cheques from backend
  const fetchCheques = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/cheque/get");
      if (!res.ok) throw new Error("Failed to fetch cheques");
      const data = await res.json();
      console.log(data)
      setCheques(data); // Assuming backend sends { cheques: [...] }
    } catch (error) {
      console.error("❌ Error fetching cheques:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run once when component loads
  useEffect(() => {
    fetchCheques();
  }, []);

  // ✅ Utilities for totals
  const parseAmount = (amt) => {
    if (amt === null || amt === undefined) return 0;
    try {
      const s = amt.toString().replace(/,/g, "").replace(/₹/g, "").trim();
      return Number(s) || 0;
    } catch (e) {
      return 0;
    }
  };

  const todayString = new Date().toISOString().split("T")[0];

  const todayTotal = useMemo(() => {
    if (!cheques || cheques.length === 0) return 0;
    return cheques.reduce((acc, c) => {
      try {
        if (c.entryDate === todayString) return acc + parseAmount(c.chequeAmount);
      } catch (e) {
        return acc;
      }
      return acc;
    }, 0);
  }, [cheques, todayString]);

  const todayTotalFiltered = useMemo(() => {
    if (!cheques || cheques.length === 0) return 0;
    if (selectedTab === 'all') return todayTotal;
    return cheques.reduce((acc, c) => {
      try {
        if ((c.status || 'pending').toLowerCase() === selectedTab && c.entryDate === todayString) return acc + parseAmount(c.chequeAmount);
      } catch (e) {
        return acc;
      }
      return acc;
    }, 0);
  }, [cheques, todayString, selectedTab]);

  const monthlyTotal = useMemo(() => {
    if (!cheques || cheques.length === 0) return 0;
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();
    return cheques.reduce((acc, c) => {
      try {
        const dateObj = new Date(c.entryDate);
        if (dateObj.getMonth() === curMonth && dateObj.getFullYear() === curYear) {
          return acc + parseAmount(c.chequeAmount);
        }
      } catch (e) {
        return acc;
      }
      return acc;
    }, 0);
  }, [cheques]);

  const monthlyTotalFiltered = useMemo(() => {
    if (!cheques || cheques.length === 0) return 0;
    if (selectedTab === 'all') return monthlyTotal;
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();
    return cheques.reduce((acc, c) => {
      try {
        const dateObj = new Date(c.entryDate);
        if ((c.status || 'pending').toLowerCase() === selectedTab && dateObj.getMonth() === curMonth && dateObj.getFullYear() === curYear) {
          return acc + parseAmount(c.chequeAmount);
        }
      } catch (e) {
        return acc;
      }
      return acc;
    }, 0);
  }, [cheques, selectedTab]);

  const formatINR = (value) => {
    try {
      return new Intl.NumberFormat("en-IN").format(value);
    } catch (e) {
      return value;
    }
  };

  const STATUSES = ["all", "clear", "shifted", "pending", "cancelled"];
  const FILTER_OPTIONS = STATUSES;
  const STATUS_KEYS = ["clear", "shifted", "pending", "cancelled"];

  const totalsByStatus = useMemo(() => {
    const map = {};
    STATUS_KEYS.forEach((s) => {
      map[s] = { count: 0, total: 0 };
    });
    cheques.forEach((c) => {
      const st = (c.status || "pending").toLowerCase();
      const amt = parseAmount(c.chequeAmount);
      if (!map[st]) map[st] = { count: 0, total: 0 };
      map[st].count += 1;
      map[st].total += amt;
    });
    return map;
  }, [cheques]);
       
  const filteredCheques = useMemo(() => {
    if (!cheques) return [];
    if (selectedTab === 'all') return cheques;
    return cheques.filter((c) => ((c.status || 'pending').toLowerCase() === selectedTab));
  }, [cheques, selectedTab]);

  // Debounce the search term for performance, so the UI won't filter on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm.trim().toLowerCase()), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Apply search filter over already filteredCheques
  const finalFilteredCheques = useMemo(() => {
    let result = filteredCheques;
    // apply search term
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm;
      result = result.filter((c) => {
        const name = (c.receiverName || '').toString().toLowerCase();
        const num = (c.chequeNumber || '').toString().toLowerCase();
        return name.includes(term) || num.includes(term);
      });
    }
    // apply date range (on entryDate)
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      result = result.filter((c) => {
        try {
          const d = new Date(c.entryDate);
          if (start && d < start) return false;
          if (end) {
            // compare end day inclusive: set time of end to 23:59:59
            const endWithTime = new Date(end);
            endWithTime.setHours(23,59,59,999);
            if (d > endWithTime) return false;
          }
          return true;
        } catch (e) {
          return false;
        }
      });
    }
    return result;
  }, [filteredCheques, debouncedSearchTerm, startDate, endDate]);

  const finalFilteredTotal = useMemo(() => {
    if (!finalFilteredCheques || finalFilteredCheques.length === 0) return 0;
    return finalFilteredCheques.reduce((acc, c) => acc + parseAmount(c.chequeAmount), 0);
  }, [finalFilteredCheques]);

  const updateStatus = async (id, newStatus) => {
    try {

      // Optimistic update (optional): update local state first
      setCheques((prev) => prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c)));
      const res = await fetch(`http://localhost:4000/cheque/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      // refresh list to ensure server-side updates are reflected
      await fetchCheques();
      alert("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Unable to update status, try again.");
      // revert optimistic update (re-fetch)
      fetchCheques();
    }
  };

  // ✅ Handle form submission (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const expenseEntry = {
      chequeIssuedDate: formData.issuedDate,
      receiverName: formData.toWhom,
      chequeValid: formData.validity,
      chequeNumber: formData.chequeNumber,
      chequeAmount: formData.amount,
      reasonToIssue: formData.reason,
    };
    if (!editingChequeId) {
      expenseEntry.entryDate = new Date().toISOString().split("T")[0];
    }

    try {
      const url = editingChequeId
        ? `http://localhost:4000/cheque/${editingChequeId}`
        : "http://localhost:4000/cheque";
      const method = editingChequeId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseEntry),
      });

      if (!res.ok) throw new Error("Failed to save cheque expense");

      const data = await res.json();
      console.log("✅ Cheque Expense Saved:", data);

      alert(editingChequeId ? "Cheque expense updated successfully!" : "Cheque expense added successfully!");
      setShowModal(false);
      setEditingChequeId(null);
      fetchCheques(); // ✅ Refresh list after adding/ editing cheque

      // Reset form
      setFormData({
        issuedDate: "",
        toWhom: "",
        validity: "",
        amount: "",
        chequeNumber: "",
        reason: "",
        entryDate: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("❌ Error saving cheque expense:", error);
      alert("Error saving cheque expense. Please try again.");
    }
  };
  // Open modal with cheque data for editing
  const openEditModal = (cheque) => {
    setEditingChequeId(cheque._id);
    setFormData({
      issuedDate: new Date(cheque.chequeIssuedDate).toISOString().split("T")[0],
      toWhom: cheque.receiverName || "",
      validity: new Date(cheque.chequeValid).toISOString().split("T")[0],
      amount: cheque.chequeAmount || "",
      chequeNumber: cheque.chequeNumber || "",
      reason: cheque.reasonToIssue || "",
      entryDate: cheque.entryDate || new Date().toISOString().split("T")[0],
    });
    setShowModal(true);
  };
if(cheques)
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Status buttons - show at very top for quick access before summary cards */}
      <div className="flex gap-2 items-center mb-4">
        {FILTER_OPTIONS.map((s) => (
          <button
            key={`top-${s}`}
            onClick={() => setSelectedTab(s)}
            className={`px-3 py-1 rounded-md border ${selectedTab === s ? 'bg-black text-white' : 'bg-white text-black'}`}
            aria-pressed={selectedTab === s}
          >
            <div className="text-sm font-medium capitalize">{s}</div>
            <div className="text-xs">{s === 'all' ? cheques.length : (totalsByStatus[s]?.count || 0)} • ₹{s === 'all' ? formatINR(cheques.reduce((acc, c) => acc + parseAmount(c.chequeAmount), 0)) : formatINR(totalsByStatus[s]?.total || 0)}</div>
          </button>
        ))}
      </div>
      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-md border border-gray-300 bg-white p-4">
            <div className="text-lg font-semibold text-gray-800 mb-1">
              Today Cheque Expense
            </div>
          <div className="text-2xl font-bold text-black">₹{formatINR(todayTotal)}</div>
          <div className="text-sm text-gray-500 mt-1">Showing <span className="capitalize">{selectedTab}</span>: ₹{formatINR(todayTotalFiltered)}</div>
        </div>
        <div className="rounded-md border border-gray-300 bg-white p-4">
          <div className="text-lg font-semibold text-gray-800 mb-1">
            Monthly Cheque Expense
          </div>
          <div className="text-2xl font-bold text-black">₹{formatINR(monthlyTotal)}</div>
          <div className="text-sm text-gray-500 mt-1">Showing <span className="capitalize">{selectedTab}</span>: ₹{formatINR(monthlyTotalFiltered)}</div>
        </div>
      </div>

      {/* ✅ Header + Add Button and Tabs */}
      <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Cheque Expenses</h2>
          <div className="flex items-center gap-2 ml-2">
            <label className="text-sm text-gray-600">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-lg px-3 py-1.5 w-44"
            />
            <label className="text-sm text-gray-600">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-lg px-3 py-1.5 w-44"
            />
            <button
              onClick={() => { setStartDate(""); setEndDate(""); }}
              className="flex items-center gap-2 text-nowrap rounded-lg bg-black text-white font-medium 
          px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base hover:bg-gray-800"
            >Clear Dates</button>
          </div>
          <div className="relative">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name or cheque number"
              className="border rounded-lg px-3 py-1.5 w-64 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-1 top-1.5 text-gray-500 hover:text-gray-800"
              >
                ×
              </button>
            )}
          </div>
          {/* <div className="ml-4 text-right">
            <div className="text-sm text-gray-600">Filtered Records: <span className="font-medium">{finalFilteredCheques.length}</span></div>
            <div className="text-sm text-gray-600">Filtered Total: <span className="font-medium">₹{formatINR(finalFilteredTotal)}</span></div>
          </div> */}
        </div>
        <button
          onClick={() => { setEditingChequeId(null); setShowModal(true); }}
          className="flex items-center gap-2 text-nowrap rounded-lg bg-black text-white font-medium 
          px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base hover:bg-gray-800"
        >
          + Add Cheque
        </button>
      </div>

      {/* Tabs for statuses */}
      {/* <div className="flex gap-2 items-center mb-4">
        {FILTER_OPTIONS.map((s) => (
          <button
            key={`bottom-${s}`}
            onClick={() => setSelectedTab(s)}
            className={`px-3 py-1 rounded-md border ${selectedTab === s ? 'bg-black text-white' : 'bg-white text-black'}`}
            aria-pressed={selectedTab === s}
          >
            <div className="text-sm font-medium capitalize">{s}</div>
            <div className="text-xs">{s === 'all' ? cheques.length : (totalsByStatus[s]?.count || 0)} • ₹{s === 'all' ? formatINR(cheques.reduce((acc, c) => acc + parseAmount(c.chequeAmount), 0)) : formatINR(totalsByStatus[s]?.total || 0)}</div>
          </button>
        ))}
      </div> */}

      {/* ✅ Cheque Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border">
        {loading ? (
          <p className="p-4 text-gray-600 text-center">Loading cheques...</p>
        ) : cheques.length === 0 ? (
          <p className="p-4 text-gray-600 text-center">No cheque records found.</p>
        ) : finalFilteredCheques.length === 0 ? (
          <p className="p-4 text-gray-600 text-center">
            {debouncedSearchTerm ? `No results for "${debouncedSearchTerm}" in ${selectedTab} status` : `No records for ${selectedTab} status`}
            { (startDate || endDate) && (
              <span>{` between ${startDate || '...'} and ${endDate || '...'}`}</span>
            )}
            .
          </p>
        ) : (
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Entry Date</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Issued Date</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">To Whom</th>
                {/* Validity column intentionally hidden from screen */}
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Cheque Number</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Reason</th>
                 {/* <th className="p-3 text-left text-sm font-semibold text-gray-600">Issued Date</th> */}
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {finalFilteredCheques.map((cheque) => (
                <tr key={cheque._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-800">{cheque.entryDate}</td>
                  <td className="p-3 text-sm text-gray-800">
                    {new Date(cheque.chequeIssuedDate).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-sm text-gray-800">{cheque.receiverName}</td>
                  {/* Validity value kept in data but not shown in table */}
                  <td className="p-3 text-sm text-gray-800">{cheque.chequeNumber}</td>
                  <td className="p-3 text-sm text-gray-800">₹{cheque.chequeAmount}</td>
                  <td className="p-3 text-sm text-gray-800">{cheque.reasonToIssue}</td>
                  <td className="p-3 text-sm text-gray-800 capitalize">{cheque.status || 'pending'}</td>
                  <td className="p-3 text-sm text-gray-800">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(cheque)}
                        className="p-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 border border-blue-600"
                        title="Edit cheque"
                      >
                        <Edit2 size={16} />
                      </button>
                      <select
                        value={(cheque.status || 'pending')}
                        onChange={(e) => updateStatus(cheque._id, e.target.value)}
                        className="border px-2 py-1 rounded-md"
                      >
                        {STATUSES.filter(st => st.toLowerCase() !== 'all').map((st) => (
                          <option value={st} key={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Add Cheque Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingChequeId ? "Edit Cheque Expense" : "Add Cheque Expense"}
              </h2>
              <button
                onClick={() => { setShowModal(false); setEditingChequeId(null); }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Entry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Entry Date
                  </label>
                  <input
                    type="date"
                    name="entryDate"
                    value={formData.entryDate}
                    readOnly
                    className="w-full border rounded-lg p-2 mt-1 bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>

                {/* Issued Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cheque Issued Date
                  </label>
                  <input
                    type="date"
                    name="issuedDate"
                    value={formData.issuedDate}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* To Whom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    To Whom Issued
                  </label>
                  <input
                    type="text"
                    name="toWhom"
                    value={formData.toWhom}
                    onChange={handleChange}
                    placeholder="Enter receiver name"
                    required
                    className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Validity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cheque Validity (Date)
                  </label>
                  <input
                    type="date"
                    name="validity"
                    value={formData.validity}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Cheque Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cheque Number
                  </label>
                  <input
                    type="text"
                    name="chequeNumber"
                    value={formData.chequeNumber}
                    onChange={handleChange}
                    placeholder="Enter cheque number"
                    required
                    className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cheque Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    required
                    className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Reason */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Reason to Issue
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Enter reason for issuing cheque"
                    required
                    rows="2"
                    className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>


              {/* Footer */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingChequeId(null); }}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
                >
                  {editingChequeId ? "Update Cheque Expense" : "Add Cheque Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChequeExpense;
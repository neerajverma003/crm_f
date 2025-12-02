// import React, { useState, useEffect } from "react";
// import { X } from "lucide-react";

// const DailyExpense = () => {
//     const [showModal, setShowModal] = useState(false);
//     const [formData, setFormData] = useState({
//         amount: "",
//         reason: "",
//         paymentMethod: "",
//         date: "",
//         bill: null,
//     });

//     const [expenses, setExpenses] = useState([]); // ✅ State for fetched expenses

//     // ---------------- Fetch expenses from API ----------------
//     const fetchExpenses = async () => {
//         try {
//             const response = await fetch("http://localhost:4000/expense/all");
//             const data = await response.json();
//             if (response.ok) {
//                 setExpenses(data); // ✅ Store fetched expenses
//             } else {
//                 console.error("Failed to fetch expenses:", data.message);
//             }
//         } catch (error) {
//             console.error("Error fetching expenses:", error);
//         }
//     };

//     // Fetch expenses on component mount
//     useEffect(() => {
//         fetchExpenses();
//     }, []);

//     const handleChange = (e) => {
//         const { name, value, files } = e.target;
//         if (name === "bill") {
//             setFormData({ ...formData, bill: files[0] });
//         } else {
//             setFormData({ ...formData, [name]: value });
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             // Create FormData object
//             const data = new FormData();
//             data.append("AmountPaid", formData.amount);
//             data.append("reason", formData.reason);
//             data.append("PaymentMethod", formData.paymentMethod);
//             data.append("date", formData.date);
//             if (formData.bill) {
//                 data.append("bill", formData.bill);
//             }

//             // Send POST request
//             const response = await fetch("http://localhost:4000/expense", {
//                 method: "POST",
//                 body: data,
//             });

//             const result = await response.json();

//            if (response.ok) {
//     console.log("Expense Submitted:", result);
//     alert("Expense submitted successfully!"); // ✅ Added alert
//     setShowModal(false);
//     setFormData({
//         amount: "",
//         reason: "",
//         paymentMethod: "",
//         date: "",
//         bill: null,
//     });
//     fetchExpenses(); // ✅ Refresh expense list after adding
// } else {
//     console.error("Error:", result.message);
// }

//         } catch (error) {
//             console.error("Error submitting expense:", error);
//         }
//     };

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             {/* ✅ Summary Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                 <div className="rounded-md border border-gray-300 bg-white p-4">
//                     <div className="text-lg font-semibold text-gray-800 mb-1">Today Expense</div>
//                     <div className="text-2xl font-bold text-black">₹100</div>
//                 </div>
//                 <div className="rounded-md border border-gray-300 bg-white p-4">
//                     <div className="text-lg font-semibold text-gray-800 mb-1">Monthly Expense</div>
//                     <div className="text-2xl font-bold text-black">₹3000</div>
//                 </div>
//             </div>

//             {/* ✅ Header + Add Button */}
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold">Daily Expenses</h2>
//                 <button
//                     onClick={() => setShowModal(true)}
//                     className="flex items-center gap-2 text-nowrap rounded-lg bg-black text-white font-medium px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base  
//     hover:bg-gray-800"
//                 >
//                     + Add Expense
//                 </button>
//             </div>

//             {/* ✅ Expense Table */}
//             <div className="overflow-x-auto bg-white rounded-lg shadow-md border">
//                 <table className="min-w-full border-collapse">
//                     <thead className="bg-gray-100 border-b">
//                         <tr>
//                             <th className="p-3 text-left text-sm font-semibold text-gray-600">Date</th>
//                             <th className="p-3 text-left text-sm font-semibold text-gray-600">Reason</th>
//                             <th className="p-3 text-left text-sm font-semibold text-gray-600">Payment Method</th>
//                             <th className="p-3 text-left text-sm font-semibold text-gray-600">Amount</th>
//                             <th className="p-3 text-left text-sm font-semibold text-gray-600">Bill</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//     {expenses.length > 0 ? (
//         expenses.map((exp) => {
//             // Convert date to readable format
//             const formattedDate = new Date(exp.date).toLocaleDateString("en-US", {
//                 weekday: "short",
//                 year: "numeric",
//                 month: "short",
//                 day: "numeric",
//             });

//             return (
//                 <tr key={exp._id} className="border-b hover:bg-gray-50">
//                     <td className="p-3 text-sm text-gray-800">{formattedDate}</td>
//                     <td className="p-3 text-sm text-gray-800">{exp.reason}</td>
//                     <td className="p-3 text-sm text-gray-800">{exp.PaymentMethod}</td>
//                     <td className="p-3 text-sm text-gray-800">₹{exp.AmountPaid}</td>
//                     <td className="p-3 text-sm text-blue-600 cursor-pointer">
//                         {exp.bill ? "View" : "-"}
//                     </td>
//                 </tr>
//             );
//         })
//     ) : (
//         <tr>
//             <td colSpan="5" className="p-3 text-center text-gray-500">
//                 No expenses found.
//             </td>
//         </tr>
//     )}
// </tbody>

//                 </table>
//             </div>

//             {/* ✅ Add Expense Modal */}
//             {showModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//                     <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
//                         <div className="flex justify-between items-center mb-4">
//                             <h2 className="text-xl font-semibold">Add Daily Expense</h2>
//                             <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
//                                 <X size={20} />
//                             </button>
//                         </div>

//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div className="grid grid-cols-2 gap-4">
//                                 {/* Amount */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
//                                     <input
//                                         type="number"
//                                         name="amount"
//                                         value={formData.amount}
//                                         onChange={handleChange}
//                                         placeholder="Enter amount"
//                                         required
//                                         className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
//                                     />
//                                 </div>

//                                 {/* Payment Method */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Payment Method</label>
//                                     <select
//                                         name="paymentMethod"
//                                         value={formData.paymentMethod}
//                                         onChange={handleChange}
//                                         required
//                                         className="w-full border rounded-lg p-2 mt-1 bg-white focus:ring-2 focus:ring-blue-500"
//                                     >
//                                         <option value="">Select method</option>
//                                         <option value="Cash">Cash</option>
//                                         <option value="UPI">UPI</option>
//                                         <option value="Card">Card</option>
//                                         <option value="Bank Transfer">Bank Transfer</option>
//                                     </select>
//                                 </div>

//                                 {/* Reason */}
//                                 <div className="col-span-2">
//                                     <label className="block text-sm font-medium text-gray-700">Reason</label>
//                                     <textarea
//                                         name="reason"
//                                         value={formData.reason}
//                                         onChange={handleChange}
//                                         placeholder="Enter reason for payment"
//                                         required
//                                         rows="2"
//                                         className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 resize-none"
//                                     />
//                                 </div>

//                                 {/* Date */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Date</label>
//                                     <input
//                                         type="date"
//                                         name="date"
//                                         value={formData.date}
//                                         onChange={handleChange}
//                                         required
//                                         className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
//                                     />
//                                 </div>

//                                 {/* Attach Bill */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Attach Bill</label>
//                                     <input
//                                         type="file"
//                                         name="bill"
//                                         accept="image/*"
//                                         onChange={handleChange}
//                                         className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Footer */}
//                             <div className="flex justify-end gap-3 mt-6">
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowModal(false)}
//                                     className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
//                                 >
//                                     Add Expense
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DailyExpense;




// import React, { useState, useEffect } from "react";
// import { X } from "lucide-react";

// const DailyExpense = () => {
//     const [showModal, setShowModal] = useState(false);
//     const [formData, setFormData] = useState({
//         amount: "",
//         reason: "",
//         paymentMethod: "",
//         date: "",
//         bill: null,
//     });

//     const [expenses, setExpenses] = useState([]);
//     const [viewBillUrl, setViewBillUrl] = useState(null); // ✅ For viewing bill

//     const fetchExpenses = async () => {
//         try {
//             const response = await fetch("http://localhost:4000/expense/all");
//             const data = await response.json();
//             if (response.ok) {
//                 setExpenses(data);
//             } else {
//                 console.error("Failed to fetch expenses:", data.message);
//             }
//         } catch (error) {
//             console.error("Error fetching expenses:", error);
//         }
//     };

//     useEffect(() => {
//         fetchExpenses();
//     }, []);

//     const handleChange = (e) => {
//         const { name, value, files } = e.target;
//         if (name === "bill") {
//             setFormData({ ...formData, bill: files[0] });
//         } else {
//             setFormData({ ...formData, [name]: value });
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const data = new FormData();
//             data.append("AmountPaid", formData.amount);
//             data.append("reason", formData.reason);
//             data.append("PaymentMethod", formData.paymentMethod);
//             data.append("date", formData.date);
//             if (formData.bill) {
//                 data.append("bill", formData.bill);
//             }

//             const response = await fetch("http://localhost:4000/expense", {
//                 method: "POST",
//                 body: data,
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 alert("Expense submitted successfully!");
//                 setShowModal(false);
//                 setFormData({
//                     amount: "",
//                     reason: "",
//                     paymentMethod: "",
//                     date: "",
//                     bill: null,
//                 });
//                 fetchExpenses(); // Refresh list
//             } else {
//                 console.error("Error:", result.message);
//             }
//         } catch (error) {
//             console.error("Error submitting expense:", error);
//         }
//     };

//     // ✅ Function to view bill
//     const handleViewBill = (billUrl) => {
//         setViewBillUrl(billUrl);
//     };

//     return (
//         <div className="p-6 bg-gray-50 min-h-screen">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                 <div className="rounded-md border border-gray-300 bg-white p-4">
//                     <div className="text-lg font-semibold text-gray-800 mb-1">Today Expense</div>
//                     <div className="text-2xl font-bold text-black">₹100</div>
//                 </div>
//                 <div className="rounded-md border border-gray-300 bg-white p-4">
//                     <div className="text-lg font-semibold text-gray-800 mb-1">Monthly Expense</div>
//                     <div className="text-2xl font-bold text-black">₹3000</div>
//                 </div>
//             </div>

//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-semibold">Daily Expenses</h2>
//                 <button
//                     onClick={() => setShowModal(true)}
//                     className="flex items-center gap-2 text-nowrap rounded-lg bg-black text-white font-medium px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base hover:bg-gray-800"
//                 >
//                     + Add Expense
//                 </button>
//             </div>

//             <div className="overflow-x-auto bg-white rounded-lg shadow-md border">
//                 <table className="min-w-full border-collapse">
//                     <thead className="bg-gray-100 border-b">
//                         <tr>
//                             <th className="p-3 text-left text-sm font-semibold text-gray-600">Date</th>
//                             <th className="p-3 text-left text-sm font-semibold text-gray-600">Reason</th>
//                             <th className="p-3 text-left text-sm font-semibold text-gray-600">Payment Method</th>
//                             <th className="p-3 text-left text-sm font-semibold text-gray-600">Amount</th>
//                             <th className="p-3 text-left text-sm font-semibold text-gray-600">Bill</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {expenses.length > 0 ? (
//                             expenses.map((exp) => {
//                                 const formattedDate = new Date(exp.date).toLocaleDateString("en-US", {
//                                     weekday: "short",
//                                     year: "numeric",
//                                     month: "short",
//                                     day: "numeric",
//                                 });

//                                 return (
//                                     <tr key={exp._id} className="border-b hover:bg-gray-50">
//                                         <td className="p-3 text-sm text-gray-800">{formattedDate}</td>
//                                         <td className="p-3 text-sm text-gray-800">{exp.reason}</td>
//                                         <td className="p-3 text-sm text-gray-800">{exp.PaymentMethod}</td>
//                                         <td className="p-3 text-sm text-gray-800">₹{exp.AmountPaid}</td>
//                                         <td className="p-3 text-sm text-blue-600 cursor-pointer">
//                                             {exp.bill ? (
//                                                 <button
//                                                     onClick={() => handleViewBill(`http://localhost:4000/${exp.bill}`)}
//                                                     className="underline"
//                                                 >
//                                                     View
//                                                 </button>
//                                             ) : (
//                                                 "-"
//                                             )}
//                                         </td>
//                                     </tr>
//                                 );
//                             })
//                         ) : (
//                             <tr>
//                                 <td colSpan="5" className="p-3 text-center text-gray-500">
//                                     No expenses found.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Add Expense Modal */}
//             {showModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//                     <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
//                         <div className="flex justify-between items-center mb-4">
//                             <h2 className="text-xl font-semibold">Add Daily Expense</h2>
//                             <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
//                                 <X size={20} />
//                             </button>
//                         </div>

//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
//                                     <input
//                                         type="number"
//                                         name="amount"
//                                         value={formData.amount}
//                                         onChange={handleChange}
//                                         placeholder="Enter amount"
//                                         required
//                                         className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Payment Method</label>
//                                     <select
//                                         name="paymentMethod"
//                                         value={formData.paymentMethod}
//                                         onChange={handleChange}
//                                         required
//                                         className="w-full border rounded-lg p-2 mt-1 bg-white focus:ring-2 focus:ring-blue-500"
//                                     >
//                                         <option value="">Select method</option>
//                                         <option value="Cash">Cash</option>
//                                         <option value="UPI">UPI</option>
//                                         <option value="Card">Card</option>
//                                         <option value="Bank Transfer">Bank Transfer</option>
//                                     </select>
//                                 </div>
//                                 <div className="col-span-2">
//                                     <label className="block text-sm font-medium text-gray-700">Reason</label>
//                                     <textarea
//                                         name="reason"
//                                         value={formData.reason}
//                                         onChange={handleChange}
//                                         placeholder="Enter reason for payment"
//                                         required
//                                         rows="2"
//                                         className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 resize-none"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Date</label>
//                                     <input
//                                         type="date"
//                                         name="date"
//                                         value={formData.date}
//                                         onChange={handleChange}
//                                         required
//                                         className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Attach Bill</label>
//                                     <input
//                                         type="file"
//                                         name="bill"
//                                         accept="image/*"
//                                         onChange={handleChange}
//                                         className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
//                                     />
//                                 </div>
//                             </div>
//                             <div className="flex justify-end gap-3 mt-6">
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowModal(false)}
//                                     className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
//                                 >
//                                     Add Expense
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* View Bill Modal */}
//             {viewBillUrl && (
//                 <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
//                     <div className="relative bg-white rounded-xl p-4 max-w-lg w-full">
//                         <button
//                             className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//                             onClick={() => setViewBillUrl(null)}
//                         >
//                             <X size={24} />
//                         </button>
//                         <img src={viewBillUrl} alt="Bill" className="w-full h-auto rounded" />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DailyExpense;



import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const DailyExpense = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    reason: "",
    paymentMethod: "",
    date: "",
    bill: null,
  });
  const [expenses, setExpenses] = useState([]);
  const [viewBillUrl, setViewBillUrl] = useState(null); // For viewing bill

  // Fetch all expenses
  const fetchExpenses = async () => {
    try {
      const response = await fetch("http://localhost:4000/expense/all");
      const data = await response.json();
      if (response.ok) {
        setExpenses(data);
      } else {
        console.error("Failed to fetch expenses:", data.message);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "bill") {
      setFormData({ ...formData, bill: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("AmountPaid", formData.amount);
      data.append("reason", formData.reason);
      data.append("PaymentMethod", formData.paymentMethod);
      data.append("date", formData.date);
      if (formData.bill) {
        data.append("bill", formData.bill);
      }

      const response = await fetch("http://localhost:4000/expense", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Expense submitted successfully!");
        setShowModal(false);
        setFormData({
          amount: "",
          reason: "",
          paymentMethod: "",
          date: "",
          bill: null,
        });
        fetchExpenses(); // Refresh list
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error submitting expense:", error);
    }
  };

  // Function to view bill
  const handleViewBill = (billUrl) => {
    setViewBillUrl(billUrl);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-md border border-gray-300 bg-white p-4">
          <div className="text-lg font-semibold text-gray-800 mb-1">Today Expense</div>
          <div className="text-2xl font-bold text-black">₹100</div>
        </div>
        <div className="rounded-md border border-gray-300 bg-white p-4">
          <div className="text-lg font-semibold text-gray-800 mb-1">Monthly Expense</div>
          <div className="text-2xl font-bold text-black">₹3000</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Daily Expenses</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 text-nowrap rounded-lg bg-black text-white font-medium px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base hover:bg-gray-800"
        >
          + Add Expense
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md border">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Reason</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Payment Method</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Amount</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-600">Bill</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((exp) => {
                const formattedDate = new Date(exp.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <tr key={exp._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-800">{formattedDate}</td>
                    <td className="p-3 text-sm text-gray-800">{exp.reason}</td>
                    <td className="p-3 text-sm text-gray-800">{exp.PaymentMethod}</td>
                    <td className="p-3 text-sm text-gray-800">₹{exp.AmountPaid}</td>
                    <td className="p-3 text-sm text-blue-600 cursor-pointer">
                      {exp.bill ? (
                        <button
                          onClick={() => handleViewBill(exp.bill)} // ✅ Use Cloudinary URL directly
                          className="underline"
                        >
                          View
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  No expenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Daily Expense</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-2 mt-1 bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select method</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Enter reason for payment"
                    required
                    rows="2"
                    className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Attach Bill</label>
                  <input
                    type="file"
                    name="bill"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
       
      {/* View Bill Modal */}
      {viewBillUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="relative bg-white rounded-xl p-4 max-w-lg w-full">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setViewBillUrl(null)}
            >
              <X size={24} />
            </button>
            <img src={viewBillUrl} alt="Bill" className="w-full h-auto rounded" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyExpense;

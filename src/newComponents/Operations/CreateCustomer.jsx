import React, { useState } from "react";

const CreateCustomer = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    groupNo: "",
    email: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Customer saved:", data);
      alert("Customer saved!");

      // Reset form after successful submission
      setForm({
        name: "",
        phone: "",
        groupNo: "",
        email: "",
        address: "",
      });
    } catch (error) {
      console.error("Failed to save customer:", error);
      alert("Failed to save customer. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Customer Creation</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ROW 1: Name + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        {/* ROW 2: Group No + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">Group No</label>
            <input
              type="text"
              name="groupNo"
              value={form.groupNo}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter group number"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Enter email address"
            />
          </div>
        </div>

        {/* ROW 3: Address Full Width */}
        <div>
          <label className="block mb-1 font-medium">Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows="3"
            className="w-full border p-2 rounded"
            placeholder="Enter full address"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateCustomer;

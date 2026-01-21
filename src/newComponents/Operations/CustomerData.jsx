import React, { useState, useEffect } from 'react';
import { FaEye, FaTrash, FaEdit } from 'react-icons/fa';

const CustomerData = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:4000/customer/all');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : (data.data || []));
      setError('');
    } catch (err) {
      setError('Failed to fetch customers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      const res = await fetch(`http://localhost:4000/customer/${customerId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchCustomers();
        setSelectedCustomer(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (loading) return <div className="text-center py-10">Loading customers...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Customer Data</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Customer List */}
        <div className="md:col-span-1 border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Customers ({customers.length})</h2>
          {customers.length === 0 ? (
            <p className="text-gray-500">No customers yet</p>
          ) : (
            <div className="space-y-2">
              {customers.map(customer => (
                <button
                  key={customer._id}
                  
                  onClick={() => setSelectedCustomer(customer)}
                  className={`w-full text-left p-3 rounded transition ${
                    selectedCustomer?._id === customer._id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white hover:bg-blue-100'
                  }`}
                >
                  <div className="font-semibold">{customer.name}</div>
                  <div className="text-sm">{customer.groupNo || 'No Group'}</div>
                  {customer.email && <div className="text-xs text-gray-600">{customer.email}</div>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Customer Details */}
        <div className="md:col-span-2 border rounded-lg p-6 bg-white">
          {selectedCustomer ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(selectedCustomer._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center gap-2"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-600 font-semibold">Name</label>
                  <p className="text-lg">{selectedCustomer.name}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">Phone</label>
                  <p className="text-lg">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">Email</label>
                  <p className="text-lg">{selectedCustomer.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">Group No</label>
                  <p className="text-lg">{selectedCustomer.groupNo || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">WhatsApp No</label>
                  <p className="text-lg">{selectedCustomer.whatsAppNo || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">Destination</label>
                  <p className="text-lg">{selectedCustomer.destination || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">Departure City</label>
                  <p className="text-lg">{selectedCustomer.departureCity || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">Expected Travel Date</label>
                  <p className="text-lg">
                    {selectedCustomer.expectedTravelDate
                      ? new Date(selectedCustomer.expectedTravelDate).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">No of Days</label>
                  <p className="text-lg">{selectedCustomer.noOfDays || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">No of Person</label>
                  <p className="text-lg">{selectedCustomer.noOfPerson || 0}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">No of Child</label>
                  <p className="text-lg">{selectedCustomer.noOfChild || 0}</p>
                </div>
                <div>
                  <label className="text-gray-600 font-semibold">Lead Type</label>
                  <p className="text-lg">{selectedCustomer.leadType || 'N/A'}</p>
                </div>
              </div>

              {selectedCustomer.notes && (
                <div className="mt-6">
                  <label className="text-gray-600 font-semibold">Notes</label>
                  <p className="text-lg bg-gray-100 p-3 rounded">{selectedCustomer.notes}</p>
                </div>
              )}

              {/* Documents Section */}
              {selectedCustomer.documents && selectedCustomer.documents.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Documents</h3>
                  <div className="space-y-2">
                    {selectedCustomer.documents.map((doc, idx) => (
                      <div key={idx} className="bg-gray-100 p-3 rounded flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{doc.fileName}</p>
                          <p className="text-sm text-gray-600">
                            {doc.personName} - {doc.documentType}
                          </p>
                        </div>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center gap-2"
                        >
                          <FaEye /> View
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 py-10">
              Select a customer to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerData;

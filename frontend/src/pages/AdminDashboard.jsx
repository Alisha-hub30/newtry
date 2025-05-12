import axios from 'axios';
import React, { useEffect, useState } from 'react';
import NavBar from '../components/Navbar';

export default function AdminDashboard() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch all services
  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/admin/services', { withCredentials: true });
      if (res.data && Array.isArray(res.data.services)) {
        setServices(res.data.services);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setMessage('Failed to load services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Approve or reject a service
  const handleStatusChange = async (serviceId, status) => {
    try {
      // Ensure the status is either 'pending', 'approved', or 'rejected'
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        setMessage('Invalid status value. Only "pending", "approved", and "rejected" are allowed.');
        return;
      }

      const res = await axios.put(
        `http://localhost:4000/api/admin/services/${serviceId}`,
        { status }, // Ensure the payload matches the backend's expectations
        { withCredentials: true }
      );

      setMessage(res.data.message || 'Service status updated successfully');
      fetchServices(); // Refresh the list
    } catch (error) {
      console.error('Failed to update service status:', error);

      // Handle specific error responses from the backend
      if (error.response?.status === 400) {
        setMessage('Invalid request. Please check the data and try again.');
      } else {
        setMessage('Failed to update service status. Please try again later.');
      }
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading services...</p>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <NavBar />
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Vendor</th>
            <th className="border border-gray-300 px-4 py-2">Price</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service._id}>
              <td className="border border-gray-300 px-4 py-2">{service.title}</td>
              <td className="border border-gray-300 px-4 py-2">{service.category}</td>
              <td className="border border-gray-300 px-4 py-2">{service.vendorName}</td>
              <td className="border border-gray-300 px-4 py-2">₹{service.basePrice}</td>
              <td className="border border-gray-300 px-4 py-2">{service.status === 'approved' ? 'Approved' : service.status}</td>
              <td className="border border-gray-300 px-4 py-2">
                {service.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(service._id, 'approved')}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(service._id, 'rejected')}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

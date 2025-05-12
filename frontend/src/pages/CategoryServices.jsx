import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar';
import axios from 'axios';

const CategoryServices = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category } = location.state || {};
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
        try {
            const res = await axios.get('http://localhost:4000/api/services?status=approved', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            if (res.data && Array.isArray(res.data.services)) {
                const approvedServices = res.data.services.filter(service => service.category.toLowerCase() === category.toLowerCase());
                setServices(approvedServices);
            } else {
                setServices([]);
            }
        } catch (error) {
            console.error('Failed to fetch services:', error);
        } finally {
            setLoading(false);
        }
    };

    if (category) {
        fetchServices();
    }
}, [category]);

  if (loading) {
    return <p className="text-center mt-10">Loading services...</p>;
  }

  if (!category) {
    return (
      <div className="text-center mt-10 text-red-600">
        Category not found. Please select a valid category.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <NavBar />
      <h1 className="text-3xl font-bold mb-6">{category.charAt(0).toUpperCase() + category.slice(1)} Services</h1>
      {services.length === 0 ? (
        <p className="text-center py-10">No approved services available in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service._id} className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img
                src={service.image || '/default-service.jpg'}
                alt={service.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-700 mb-3">{service.shortDescription}</p>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-red-600">₹{service.basePrice}</p>
                </div>
                <button 
                  className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
                  onClick={() => navigate('/servicedetails', { state: { serviceId: service._id } })}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryServices;
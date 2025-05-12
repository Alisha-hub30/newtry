import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ServiceDetails = () => {
  const location = useLocation();
  const { serviceId } = location.state || {};
  const [serviceDetails, setServiceDetails] = useState(null);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/services/${serviceId}?status=accepted`);
        setServiceDetails(res.data);
      } catch (error) {
        console.error('Failed to fetch service details:', error);
        toast.error('Failed to load service details.');
      }
    };

    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

  if (!serviceDetails) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Loading service details...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow pt-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto mb-10">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-red-600">wedtayari.com</h1>
            <h2 className="text-2xl font-bold text-red-700 mt-2">{serviceDetails.title}</h2>
          </div>
          <div className="mt-4">
            <button
              onClick={() => toast.success('Booking successful!')}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Book Service Now
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold text-red-600 mb-4">Service Details</h3>
            <p className="text-gray-700 mb-4"><strong>Category:</strong> {serviceDetails.category}</p>
            <p className="text-gray-700 mb-4"><strong>Location:</strong> {serviceDetails.location}</p>
            <p className="text-gray-700 mb-4"><strong>Vendor Name:</strong> {serviceDetails.vendorName}</p>
            <p className="text-gray-700 mb-4"><strong>Short Description:</strong> {serviceDetails.shortDescription}</p>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold text-red-600 mb-4">Pricing Information</h3>
            <p className="text-gray-700 mb-4"><strong>Price Type:</strong> {serviceDetails.priceType}</p>
            <p className="text-gray-700 mb-4"><strong>Base Price:</strong> <span className="text-red-600">{serviceDetails.basePrice}</span></p>
            <p className="text-gray-700 mb-4"><strong>Price Unit:</strong> {serviceDetails.priceUnit}</p>
            {serviceDetails.priceType === 'range' && (
              <p className="text-gray-700 mb-4"><strong>Max Price:</strong> <span className="text-red-600">{serviceDetails.maxPrice}</span></p>
            )}
            <p className="text-gray-700 mb-4"><strong>Discount:</strong> <span className="text-red-600">{serviceDetails.discount}</span></p>
          </div>
        </div>

        <div className="border rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-red-600 mb-4">Detailed Description</h3>
          <p className="text-gray-700 mb-4">{serviceDetails.fullDescription}</p>
          <p className="text-gray-700 mb-4"><strong>Years in Business:</strong> <span className="text-red-600">{serviceDetails.yearsInBusiness}</span></p>
          <p className="text-gray-700 mb-4"><strong>Events Completed:</strong> <span className="text-red-600">{serviceDetails.eventsCompleted}</span></p>
          <p className="text-gray-700 mb-4"><strong>Team Size:</strong> {serviceDetails.teamSize}</p>
        </div>

        <div className="border rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-red-600 mb-4">What it Comes With</h3>
            {serviceDetails.comesWith && serviceDetails.comesWith.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700">
                    {serviceDetails.comesWith.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2">
                            <span className="text-green-600">✔</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-700">No additional items listed.</p>
            )}
        </div>
      </main>
    </div>
  );
};

export default ServiceDetails;
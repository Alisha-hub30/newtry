import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../services/ApiEndpints'; // Update with the actual import path for your API functions

export default function RegisterVendor() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError('');

    try {
      // Send POST request to register vendor
      const response = await post('/api/auth/registerVendor', { name, email, password });

      if (response.status === 200) {
        // Redirect to login page or dashboard after successful registration
        navigate('/login');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong, please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Register as a Vendor</h2>
      
      <form onSubmit={handleRegister} className="space-y-4">
        {error && <p className="text-red-600">{error}</p>}
        
        <div>
          <label htmlFor="name" className="block text-sm font-semibold">Name</label>
          <input
            type="text"
            id="name"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold">Email</label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold">Password</label>
          <input
            type="password"
            id="password"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="w-full bg-red-600 text-white p-2 rounded mt-4 hover:bg-red-700 transition">
          Register
        </button>
      </form>
    </div>
  );
}

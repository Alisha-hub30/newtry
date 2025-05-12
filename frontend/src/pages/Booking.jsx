// src/pages/Bookings.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NavBar from '../components/Navbar';

export default function Bookings() {
    const user = useSelector((state) => state.Auth.user);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user's bookings
    const fetchBookings = async () => {
        try {
        // The endpoint might differ based on user role (vendor vs regular user)
        const endpoint = user.role === 'vendor' ? 
            'http://localhost:4000/api/vendor/bookings' : 
            'http://localhost:4000/api/user/bookings';
        
        const res = await axios.get(endpoint, { withCredentials: true });
        
        if (res.data && Array.isArray(res.data.bookings)) {
            setBookings(res.data.bookings);
        } else {
            setBookings([]);
        }
        setLoading(false);
        } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setError('Failed to load bookings. Please try again later.');
        setLoading(false);
        }
    };

    // Handle booking cancellation (for users)
    const handleCancelBooking = async (bookingId) => {
        try {
        await axios.put(`http://localhost:4000/api/user/bookings/${bookingId}/cancel`, {}, 
            { withCredentials: true }
        );
        // Refresh bookings after cancellation
        fetchBookings();
        } catch (err) {
        console.error('Failed to cancel booking:', err);
        alert(err.response?.data?.message || 'Failed to cancel booking');
        }
    };

    // Handle status update (for vendors)
    const handleUpdateStatus = async (bookingId, newStatus) => {
        try {
        await axios.put(`http://localhost:4000/api/vendor/bookings/${bookingId}/status`, 
            { status: newStatus },
            { withCredentials: true }
        );
        // Refresh bookings after update
        fetchBookings();
        } catch (err) {
        console.error('Failed to update booking status:', err);
        alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    useEffect(() => {
        if (user) {
        fetchBookings();
        }
    }, [user]);

    if (loading) {
        return <p className="text-center mt-10">Loading your bookings...</p>;
    }

    if (error) {
        return <p className="text-center mt-10 text-red-600">{error}</p>;
    }

    if (!user) {
        return (
        <div className="text-center mt-10 text-red-600">
            Please login to view your bookings.
        </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
        <NavBar />
        <h1 className="text-3xl font-bold mb-6">Your Bookings</h1>

        {bookings.length === 0 ? (
            <p className="text-center">No bookings found.</p>
        ) : (
            <div className="space-y-4">
            {bookings.map((booking) => (
                <div key={booking._id} className="border p-4 rounded shadow">
                <div className="flex justify-between items-start">
                    <div>
                    <h3 className="text-xl font-bold">{booking.service?.title || 'Service Unavailable'}</h3>
                    <p className="text-gray-600">{new Date(booking.dateTime).toLocaleString()}</p>
                    <p className="mt-2">Status: <span className={`font-bold ${
                        booking.status === 'confirmed' ? 'text-green-600' :
                        booking.status === 'pending' ? 'text-yellow-600' :
                        booking.status === 'cancelled' ? 'text-red-600' :
                        'text-gray-600'
                    }`}>{booking.status}</span></p>
                    </div>
                    
                    <div className="text-right">
                    <p className="text-lg font-bold">₹{booking.totalAmount}</p>
                    
                    {/* Show different actions based on user role and booking status */}
                    {user.role === 'user' && booking.status === 'pending' && (
                        <button 
                        onClick={() => handleCancelBooking(booking._id)}
                        className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                        Cancel
                        </button>
                    )}
                    
                    {user.role === 'vendor' && booking.status === 'pending' && (
                        <div className="space-y-2 mt-2">
                        <button 
                            onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                            className="w-full bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                            Confirm
                        </button>
                        <button 
                            onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
                            className="w-full bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                            Reject
                        </button>
                        </div>
                    )}
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
    );
}
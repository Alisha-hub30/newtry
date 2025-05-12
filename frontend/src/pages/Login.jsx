import React, { useState } from 'react';
import { toast } from "react-hot-toast";
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar';
import { SetUser } from '../redux/AuthSlice';
import { post } from '../services/ApiEndpints';

export default function Login() {
    const navigate = useNavigate()
    const dispatch=useDispatch()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(email, password);
        try {
            const request = await post('/api/auth/login', { email, password });
            const response = request.data;
            if (request.status==200) {
                if (response.user.role =='admin') {
                    navigate('/admin')
                }else if (response.user.role =='user') {
                    navigate('/home')
                }
                toast.success(response.message)
                dispatch(SetUser(response.user))
            }
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    return (
    <div><NavBar/>
        
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="email" className="mb-2 text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="p-2 border rounded shadow-sm border-gray-300 focus:ring focus:ring-blue-500 focus:outline-none"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="mb-2 text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="p-2 border rounded shadow-sm border-gray-300 focus:ring focus:ring-blue-500 focus:outline-none"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
                    >
                        Login
                    </button>
                    <p className="text-sm text-center text-gray-600">
                        Not registered? <Link to="/register" className="text-blue-500 hover:underline">Register here</Link>
                    </p>
                </form>
            </div>
        </div></div>
    );
}
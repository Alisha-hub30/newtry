import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import NavBar from '../components/Navbar';

// Service Item Component
const ServiceItem = ({ title, description }) => {
  return (
    <div className="border-b border-gray-200 pb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default function LandingPage() {
    const user = useSelector((state) => state.Auth?.user) || null;
    
    return (
        <div className="min-h-screen bg-white">
            <NavBar/>
        {/* Hero Section */}
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-rose-50 to-pink-50">
            <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
                <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                Welcome to your dream venue
                </h1>
            </div>
            </div>
        </div>

        {/* About Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
                <p className="text-lg text-gray-600 mb-6">
                A wedding is such a special and intimate occasion. We help construct dream moments to life. 
                As couples, we firmly believe, deserve to have a wedding that they can not only cherish 
                and remember fondly.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                Harithson is a Nepal Wedding website where you find the best wedding vendors under your budget. 
                Check prices, get verified ratings, and chat back-and-forth by the vendors to seal your deal 
                to completion.
                </p>
                <button className="px-6 py-3 bg-rose-600 text-white font-medium rounded hover:bg-rose-700 transition duration-300">
                Learn More About Us
                </button>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
                {/* Using placeholder image instead of external URL */}
                <img 
                src="/api/placeholder/1000/600" 
                alt="Wedding venue" 
                className="w-full h-auto object-cover"
                />
            </div>
            </div>
        </div>

        {/* Services Section */}
        <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Services</h1>
              <p className="text-lg text-rose-600 font-medium">
                One Stop Solutions: 360 Services Expertises
              </p>
            </div>

            {/* Services List - Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Column 1 */}
              <div className="space-y-6">
                <ServiceItem 
                  title="Photography & Videography" 
                  description="Photography and Videography" 
                />
                <ServiceItem 
                  title="Making" 
                  description="Bridal Makeup & Family Makeup" 
                />
                <ServiceItem 
                  title="Clothing" 
                  description="Bridal Lahenga, Saree, Groom Suit" 
                />
                <ServiceItem 
                  title="Venue" 
                  description="Banquet, Party Palace, Hotel, Restaurant" 
                />
              </div>

              {/* Column 2 */}
              <div className="space-y-6">
                <ServiceItem 
                  title="Baja (Music)" 
                  description="Feel Music Around You" 
                />
                <ServiceItem 
                  title="Decorations" 
                  description="Stage, Mehendi, Mandap" 
                />
                <ServiceItem 
                  title="Invitation Cards" 
                  description="Wedding Cards" 
                />
              </div>
            </div>

            {/* View All Button */}
            <div className="text-center">
              <button className="px-8 py-3 bg-rose-600 text-white font-medium rounded-md hover:bg-rose-700 transition-colors duration-300">
                View All Services
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                <h3 className="text-xl font-bold mb-4">VENUE</h3>
                <p className="text-gray-400">Creating unforgettable wedding experiences in Nepal.</p>
                </div>
                <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                    <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                    <li><Link to="/about" className="text-gray-400 hover:text-white">About</Link></li>
                    <li><Link to="/services" className="text-gray-400 hover:text-white">Services</Link></li>
                    <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                </ul>
                </div>
                <div>
                <h4 className="font-semibold mb-4">Contact Us</h4>
                <address className="text-gray-400 not-italic">
                    <p>Kathmandu, Nepal</p>
                    <p>Email: info@venue.com</p>
                    <p>Phone: +977 1234567890</p>
                </address>
                </div>
                <div>
                <h4 className="font-semibold mb-4">Newsletter</h4>
                <div className="flex">
                    <input 
                    type="email" 
                    placeholder="Your email" 
                    className="px-4 py-2 w-full rounded-l text-gray-800"
                    />
                    <button className="bg-rose-600 px-4 py-2 rounded-r hover:bg-rose-700">
                    Subscribe
                    </button>
                </div>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} VENUE. All rights reserved.</p>
            </div>
            </div>
        </footer>
        </div>
    );
}
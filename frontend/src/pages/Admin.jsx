import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { deleteUser, get, put } from "../services/ApiEndpints";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userRequest = await get("api/admin/getuser");
        if (userRequest.status === 200) {
          setUsers(userRequest.data.users);
          setFilteredUsers(userRequest.data.users);
        }

        const serviceRequest = await get("api/admin/getservices");
        if (serviceRequest.status === 200) {
          setServices(serviceRequest.data.services);
          setFilteredServices(serviceRequest.data.services);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUserSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setUserSearch(value);
    setFilteredUsers(
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(value) ||
          user.email.toLowerCase().includes(value)
      )
    );
  };

  const handleServiceSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setServiceSearch(value);
    setFilteredServices(
      services.filter(
        (service) =>
          service.title.toLowerCase().includes(value) ||
          service.vendor.name.toLowerCase().includes(value)
      )
    );
  };

  const handleDelete = async (id) => {
    try {
      const request = await deleteUser(`/api/admin/delete/${id}`);
      if (request.status === 200) {
        toast.success(request.data.message);
        setUsers(users.filter((user) => user._id !== id));
        setFilteredUsers(filteredUsers.filter((user) => user._id !== id));
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleServiceStatus = async (id, status) => {
    try {
      const request = await put(`/api/admin/services/${id}/status`, { status });
      if (request.status === 200) {
        toast.success(request.data.message);
        setServices(
          services.map((service) =>
            service._id === id ? { ...service, status } : service
          )
        );
        setFilteredServices(
          filteredServices.map((service) =>
            service._id === id ? { ...service, status } : service
          )
        );
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        </div>
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={userSearch}
          onChange={handleUserSearch}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-600 font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "vendor"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Service Management
          </h1>
        </div>
        <input
          type="text"
          placeholder="Search services by title or vendor..."
          value={serviceSearch}
          onChange={handleServiceSearch}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <tr key={service._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {service.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {service.vendor.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            service.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : service.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : ""
                          }`}
                        >
                          {service.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {service.status === "pending" && (
                          <button
                            onClick={() =>
                              handleServiceStatus(service._id, "approved")
                            }
                            className="text-green-600 hover:text-green-900"
                          >
                            Accept
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No services found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

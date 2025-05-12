import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import NavBar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from "./Layouts/AdminLayout"
import PublicLayouts from './Layouts/PublicLayout'
import UserLayout from './Layouts/UserLayout'
import Admin from './pages/Admin'
import Bookings from './pages/Booking'
import CategoryServices from './pages/CategoryServices'
import Home from './pages/Home'
import LandingPage from './pages/Landingpage'
import Login from './pages/Login'
import Register from './pages/Register'
import Services from './pages/Services'
import Unauthorized from './pages/Unauthorized'
import VendorDashboard from './pages/VendorDashboard'
import RegisterVendor from './pages/VendorRegister'
import { updateUser } from './redux/AuthSlice'
import ServiceDetails from './pages/ServiceDetails'

export default function App() {
const dispatch=useDispatch()
  useEffect(()=>{
    dispatch(updateUser())
  },[])
  return (
    <>
    <BrowserRouter>
    <Toaster/>
    <Routes>
      
    <Route path='/home' element={
      <ProtectedRoute allowedRoles={['user']}>
        <UserLayout />
      </ProtectedRoute>
    }>
      <Route index element={<Home />} />
    </Route>

    <Route path='/admin' element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    }>
      <Route index element={<Admin />} />
    </Route>

    <Route path='/vendor' element={
  <ProtectedRoute allowedRoles={['vendor']}>
    <VendorDashboard />
  </ProtectedRoute>
} />
<Route path='/services' element={<Services />} />
<Route path='/bookings' element={
    <ProtectedRoute allowedRoles={['user', 'vendor']}>
      <Bookings />
    </ProtectedRoute>
  } />
    
    <Route path="/category-services" element={<CategoryServices />} />
              <Route path='/' element={<PublicLayouts/>}>
              <Route index element={<LandingPage/>}/>
              <Route path='/navbar' element={<NavBar/>}/>
              <Route path='login' element={<Login/>}/>
              <Route path="/registerVendor" element={<RegisterVendor/>}/>
              <Route path='register' element={<Register/>}/>
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path='/servicedetails' element={<ServiceDetails/>}/>
                
              </Route>
    
    </Routes>
    
    </BrowserRouter>
    </>
  )
}
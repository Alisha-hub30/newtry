import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import NavBar from '../components/Navbar'
export default function UserLayout() {
    const user=useSelector((state) => state.Auth.user)
    const navgiate=useNavigate()
    

    useEffect(()=>{
          if (!user) {
              navgiate('/login')
          }
    },[user])
  return (
    <><NavBar/>
    <Outlet/></>
    
  )
}
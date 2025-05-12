

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Logout } from '../redux/AuthSlice'
import { post } from '../services/ApiEndpints'

export default function Home() {
  const user=useSelector((state)=>state.Auth.user)
  // console.log(user)
  const navigate=useNavigate()
  const disptach=useDispatch()
  const gotoAdmin=()=>{
        navigate('/admin')
  }
  const handleLogout=async()=>{
    try {
      const request= await post('/api/auth/logout')
       const response= request.data
       if (request.status==200) {
           disptach(Logout())
          navigate('/login')
       }
       console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      
      <div className='home-container'>
      <div className='user-card'>
        <h2> Welcome,{user && user.name}</h2>
        <button className='logout-btn' onClick={handleLogout}>Logout</button>
        {user && user.role=='admin' ? <button onClick={gotoAdmin} className='admin-btn'>Go To admin</button> :''}
        
      </div>
      </div>
    </div>
  )
}
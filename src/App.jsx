import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/home'
import Login from './pages/Login'
import Register from './pages/Register'
import PendingQuotations from './pages/distributor/PendingQuotations'
import MyResponses from './pages/distributor/MyResponses'
import ProfileInfo from './pages/distributor/ProfileInfo'
import OrdersAwarded from './pages/distributor/OrdersAwarded'
import Massage from './pages/massage'
import ProductManagement from './pages/Admin/adminHome'
import ConfirmedOrders from './pages/ConfirmedOrders'
import OrderManagement from './pages/Admin/OrderManagement'
import UserManagement from './pages/Admin/UserManagement'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Toaster position='top-left'/>  {/* react toast allet pennanna ona nisa */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/distributor/ADashboard" element={<PendingQuotations />} />
        <Route path="/distributor/OrdersAwarded" element={<OrdersAwarded />} />
        <Route path="/distributor/ProfileInfo" element={<ProfileInfo />} />
        <Route path="/distributor/MyResponses" element={<MyResponses />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProductManagement />} />
        <Route path="/massage" element={<Massage />} />
        <Route path="/confirmedOrders" element={<ConfirmedOrders />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orderManagement" element={<OrderManagement />} />
        <Route path="/userManagement" element={<UserManagement />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

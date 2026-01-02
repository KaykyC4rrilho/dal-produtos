import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from '@/pages/Home'
import Product from '@/pages/Product'
import AdminDashboard from '@/pages/AdminDashboard'
import UserNotRegisteredError from '@/components/UserNotRegisteredError'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/error" element={<UserNotRegisteredError />} />
             <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
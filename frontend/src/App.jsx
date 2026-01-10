import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Imports de Páginas (Usando @/ para garantir o caminho correto)
import Home from '@/pages/Home'
import Product from '@/pages/Product' // Certifique-se que existe Product.jsx
import Login from '@/pages/Login'
import AdminDashboard from '@/pages/AdminDashboard' // Apontei para AdminProducts.jsx que criamos
import UserNotRegisteredError from '@/pages/UserNotRegisteredError' // Removido { } para import default

// Imports de Componentes
import PrivateRoute from '@/components/PrivateRoute'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/error" element={<UserNotRegisteredError />} />

          {/* Rota de Login */}
          <Route path="/login" element={<Login />} />

          {/* Rota Protegida de Admin */}
          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App

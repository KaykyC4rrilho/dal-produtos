import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Páginas principais
import Home from '@/pages/Home';
import Product from '@/pages/Product';
import Login from '@/pages/Login';
import AdminDashboard from '@/pages/AdminDashboard';
import UserNotRegisteredError from '@/pages/UserNotRegisteredError';

// Páginas institucionais
import PoliticaPrivacidade from '@/pages/PoliticaPrivacidade';
import TermosUso from '@/pages/TermosUso';
import PoliticaGarantia from '@/pages/PoliticaGarantia';

// Componentes
import PrivateRoute from '@/components/PrivateRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/error" element={<UserNotRegisteredError />} />

          {/* Páginas Institucionais */}
          <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/termos-de-uso" element={<TermosUso />} />
          <Route path="/politica-de-garantia" element={<PoliticaGarantia />} />
          {/* Rota Protegida */}
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
  );
}

export default App;

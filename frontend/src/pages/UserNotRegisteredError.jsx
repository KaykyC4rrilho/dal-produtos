// src/pages/UserNotRegisteredError.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function UserNotRegisteredError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
        <p className="mb-6">Você não tem permissão para acessar esta página.</p>
        <Link to="/login" className="text-[#F2C335] hover:underline">Voltar para Login</Link>
      </div>
    </div>
  );
}

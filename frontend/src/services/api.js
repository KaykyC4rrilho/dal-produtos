// src/services/api.js

// Ajuste a URL base conforme necessário (ex: variável de ambiente)
const API_URL = "https://dal-produtos.vercel.app/api";

// Função auxiliar para pegar o token do localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  // --- AUTENTICAÇÃO ---

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Falha no login');
    }

    const data = await response.json();
    // Salva o token no localStorage para usar depois
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // --- MÉTODOS DE LEITURA (GET) ---

  getScanners: async (params = {}) => {
    // Converte o objeto params em query string (ex: ?limit=10&search=algo)
    const queryParams = new URLSearchParams();

    if (params.skip) queryParams.append('skip', params.skip);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.brand) queryParams.append('brand', params.brand);

    // Novo parâmetro para excluir um ID específico (usado nos "Relacionados")
    if (params.exclude_id) queryParams.append('exclude_id', params.exclude_id);

    const response = await fetch(`${API_URL}/scanners?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar scanners');
    }
    return response.json();
  },

  getScannerById: async (id) => {
    const response = await fetch(`${API_URL}/scanners/${id}`);
    if (!response.ok) {
      throw new Error('Scanner não encontrado');
    }
    return response.json();
  },

  // --- MÉTODOS DE ESCRITA (PROTEGIDOS) ---

  createScanner: async (scannerData) => {
    const response = await fetch(`${API_URL}/scanners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(), // Envia token
      },
      body: JSON.stringify(scannerData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erro ao criar scanner');
    }
    return response.json();
  },

  updateScanner: async (id, scannerData) => {
    const response = await fetch(`${API_URL}/scanners/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(), // Envia token
      },
      body: JSON.stringify(scannerData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erro ao atualizar scanner');
    }
    return response.json();
  },

  deleteScanner: async (id) => {
    const response = await fetch(`${API_URL}/scanners/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(), // Envia token
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erro ao deletar scanner');
    }
    return response.json();
  },

  // --- UPLOAD DE IMAGEM ---

  uploadImage: async (formData) => {
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        // Nota: Não definimos Content-Type para FormData manualmente, o navegador faz isso.
        ...getAuthHeaders(), // Envia token
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erro ao fazer upload da imagem');
    }
    return response.json();
  }
};

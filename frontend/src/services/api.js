// src/services/api.js

// Ajuste a URL base conforme necessário
const API_URL = "http://localhost:8000/api";

// Função auxiliar para pegar o token do localStorage
const getToken = () => localStorage.getItem('token');

// Função auxiliar para criar os headers com autenticação
const getAuthHeaders = () => {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  // --- AUTENTICAÇÃO (Adicionado para corrigir o erro) ---

  login: async (email, password) => {
    // CORREÇÃO: Enviando como JSON para bater com o UserLogin do backend
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: email, 
        password: password 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erro ao fazer login');
    }

    const data = await response.json();
    // Salva o token no localStorage
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    return data;
  },

  isAuthenticated: () => {
    // Verifica se existe um token salvo
    return !!localStorage.getItem('token');
  },

  logout: () => {
    // Remove o token para deslogar
    localStorage.removeItem('token');
    // Opcional: Redirecionar para login via window.location ou deixar o React lidar com isso
    window.location.href = '/login';
  },

  // --- MÉTODOS DE LEITURA (GET) ---

  getScanners: async ({
    brand = null,
    minPrice = null,
    maxPrice = null,
    search = null,
    in_stock = null,
    page = 1,
    limit = 12
  } = {}) => {
    const params = new URLSearchParams();

    if (brand && brand !== "all") params.append("brand", brand);
    if (minPrice && minPrice !== "all") params.append("min_price", minPrice);
    if (maxPrice && maxPrice !== "all") params.append("max_price", maxPrice);
    if (search) params.append("search", search);

    // Se in_stock for passado (true ou false), envia para o backend.
    if (in_stock !== null && in_stock !== undefined) {
        params.append("in_stock", in_stock);
    }

    params.append("page", page);
    params.append("limit", limit);

    const response = await fetch(`${API_URL}/scanners?${params.toString()}`);
    if (!response.ok) throw new Error('Erro ao buscar scanners');
    return response.json();
  },

  getScannerById: async (id) => {
    const response = await fetch(`${API_URL}/scanners/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar detalhes do scanner');
    return response.json();
  },

  getBrands: async () => {
    const response = await fetch(`${API_URL}/scanners/brands/all`);
    if (!response.ok) throw new Error('Erro ao buscar marcas');
    return response.json();
  },

  getPriceRanges: async () => {
    const response = await fetch(`${API_URL}/scanners/filters/price-ranges`);
    if (!response.ok) throw new Error('Erro ao buscar faixas de preço');
    return response.json();
  },

  // --- MÉTODOS DE ESCRITA (CRUD) ---
  // Agora enviamos o token nos headers para garantir permissão

  createScanner: async (data) => {
    const response = await fetch(`${API_URL}/scanners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(), // Envia token
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erro ao criar scanner');
    }
    return response.json();
  },

  updateScanner: async (id, data) => {
    const response = await fetch(`${API_URL}/scanners/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(), // Envia token
      },
      body: JSON.stringify(data),
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

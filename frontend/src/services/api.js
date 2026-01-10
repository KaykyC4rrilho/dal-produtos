// src/services/api.js

// Ajuste a URL base conforme necessário (ex: variável de ambiente)
const API_URL = "http://localhost:8000/api";

export const api = {
  // --- MÉTODOS DE LEITURA (GET) ---

  getScanners: async ({ 
    brand = null, 
    minPrice = null, 
    maxPrice = null, 
    search = null, 
    page = 1, 
    limit = 12 
  } = {}) => {
    const params = new URLSearchParams();

    if (brand && brand !== "all") params.append("brand", brand);
    if (minPrice && minPrice !== "all") params.append("min_price", minPrice);
    if (maxPrice && maxPrice !== "all") params.append("max_price", maxPrice);
    if (search) params.append("search", search);

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

  createScanner: async (data) => {
    const response = await fetch(`${API_URL}/scanners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erro ao deletar scanner');
    }
    return response.json();
  },

  // --- UPLOAD DE IMAGEM ---

  uploadImage: async (formData) => {
    // Nota: Ao enviar FormData, NÃO definimos 'Content-Type' manualmente.
    // O navegador define automaticamente como 'multipart/form-data' com o boundary correto.
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erro ao fazer upload da imagem');
    }
    return response.json();
  }
};

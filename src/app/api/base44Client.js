// Aponta para a Serverless Function da Vercel
const API_URL = '/api/scanners'; 

export const base44 = {
  entities: {
    Scanner: {
      // LISTAR
      list: async () => {
        const res = await fetch(API_URL);
        return await res.json();
      },

      // CRIAR
      create: async (data) => {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await res.json();
      },

      // ATUALIZAR (Edição ou Estoque)
      update: async (id, data) => {
        // Passa o ID na URL (?id=...) para a Vercel entender qual item atualizar
        const res = await fetch(`${API_URL}?id=${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await res.json();
      },

      // DELETAR
      delete: async (id) => {
        await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
        return true;
      },

      // FILTRAR (Feito no front para simplificar)
      filter: async (filters, limit = 4) => {
        const res = await fetch(API_URL);
        let results = await res.json();
        if (filters.brand) {
          results = results.filter(item => item.brand === filters.brand);
        }
        return results.slice(0, limit);
      }
    }
  }
};

import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const dbConfig = {
    host: 'srv1529.hstgr.io',
    user: 'u735163610_daladmin',
    password: 'Nnp01062025!',
    database: 'u735163610_dalprodutos',
    port: 3306
  };

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
  } catch (error) {
    return res.status(500).json({ error: 'Erro de conexão: ' + error.message });
  }

  // GET: Listar
  if (req.method === 'GET') {
    try {
      const [rows] = await connection.execute(
        "SELECT id, model, brand, item_condition as `condition`, original_price, sale_price, image_url, purchase_link, in_stock FROM scanners ORDER BY created_date DESC"
      );
      const formatted = rows.map(item => ({ ...item, in_stock: Boolean(item.in_stock) }));
      res.status(200).json(formatted);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST: Criar
  else if (req.method === 'POST') {
    const { model, brand, condition, original_price, sale_price, image_url, purchase_link, in_stock } = req.body;
    try {
      const [result] = await connection.execute(
        "INSERT INTO scanners (model, brand, item_condition, original_price, sale_price, image_url, purchase_link, in_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [model, brand, condition, original_price, sale_price, image_url, purchase_link, in_stock ? 1 : 0]
      );
      res.status(201).json({ id: result.insertId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT: Atualizar (CORRIGIDO PARA ATUALIZAR TUDO)
  else if (req.method === 'PUT') {
    const { id } = req.query;
    const { model, brand, condition, original_price, sale_price, image_url, purchase_link, in_stock } = req.body;

    try {
      // Se vierem todos os dados (Edição completa)
      if (model) {
        await connection.execute(
          "UPDATE scanners SET model=?, brand=?, item_condition=?, original_price=?, sale_price=?, image_url=?, purchase_link=?, in_stock=? WHERE id=?",
          [model, brand, condition, original_price, sale_price, image_url, purchase_link, in_stock ? 1 : 0, id]
        );
      } 
      // Se vier só o estoque (Botão rápido da tabela)
      else {
        await connection.execute(
          "UPDATE scanners SET in_stock=? WHERE id=?",
          [in_stock ? 1 : 0, id]
        );
      }
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // DELETE: Apagar
  else if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      await connection.execute("DELETE FROM scanners WHERE id = ?", [id]);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  await connection.end();
}

import React, { useState, useEffect } from 'react';

import { Plus, Pencil, Trash2, X, Save, Package, PackageX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [scanners, setScanners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Estado do formulário
  const [formData, setFormData] = useState({
    model: '', brand: '', condition: 'Excelente', 
    original_price: '', sale_price: '', image_url: '', 
    purchase_link: '', in_stock: true
  });

  // Carregar dados
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await base44.entities.Scanner.list();
    setScanners(data);
  };

  // Abrir modal (para criar ou editar)
  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        model: '', brand: 'Fujitsu', condition: 'Excelente', 
        original_price: '', sale_price: '', image_url: '', 
        purchase_link: '', in_stock: true
      });
    }
    setIsModalOpen(true);
  };

  // Salvar (Criar ou Editar)
  const handleSave = async (e) => {
    e.preventDefault();

    // Converter preços para número
    const payload = {
      ...formData,
      original_price: Number(formData.original_price),
      sale_price: Number(formData.sale_price)
    };

    if (editingItem) {
      await base44.entities.Scanner.update(editingItem.id, payload);
    } else {
      await base44.entities.Scanner.create(payload);
    }

    setIsModalOpen(false);
    loadData(); // Recarrega a lista
  };

  // Deletar
  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await base44.entities.Scanner.delete(id);
      loadData();
    }
  };

  // Alternar Estoque Rápido
  const toggleStock = async (item) => {
    await base44.entities.Scanner.update(item.id, { in_stock: !item.in_stock });
    loadData();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Gerenciar Estoque</h1>
          <div className="flex gap-4">
            <Link to="/">
              <Button variant="outline">Ver Site</Button>
            </Link>
            <Button onClick={() => openModal()} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Novo Produto
            </Button>
          </div>
        </div>

        {/* Tabela de Produtos */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-600">Produto</th>
                <th className="p-4 font-semibold text-slate-600">Preço Venda</th>
                <th className="p-4 font-semibold text-slate-600">Estoque</th>
                <th className="p-4 font-semibold text-slate-600 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scanners.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image_url} alt="" className="w-12 h-12 object-contain rounded bg-white border" />
                      <div>
                        <p className="font-medium text-slate-900">{item.model}</p>
                        <p className="text-xs text-slate-500">{item.brand} • {item.condition}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-700">
                    R$ {item.sale_price.toLocaleString('pt-BR')}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleStock(item)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        item.in_stock 
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {item.in_stock ? <Package className="w-3 h-3" /> : <PackageX className="w-3 h-3" />}
                      {item.in_stock ? 'Em Estoque' : 'Esgotado'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Button size="icon" variant="ghost" onClick={() => openModal(item)}>
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edição/Criação */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">{editingItem ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Modelo</label>
                  <Input required value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Marca</label>
                  <select 
                    className="w-full p-2 border rounded-md bg-white"
                    value={formData.brand} 
                    onChange={e => setFormData({...formData, brand: e.target.value})}
                  >
                    {["Canon", "Fujitsu", "Kodak", "Epson", "HP", "Brother"].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preço Original</label>
                  <Input type="number" required value={formData.original_price} onChange={e => setFormData({...formData, original_price: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preço Venda</label>
                  <Input type="number" required value={formData.sale_price} onChange={e => setFormData({...formData, sale_price: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">URL da Imagem</label>
                <Input required value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Link de Compra (WhatsApp)</label>
                <Input required value={formData.purchase_link} onChange={e => setFormData({...formData, purchase_link: e.target.value})} />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="stock"
                  checked={formData.in_stock} 
                  onChange={e => setFormData({...formData, in_stock: e.target.checked})}
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="stock" className="font-medium cursor-pointer">Produto em Estoque</label>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

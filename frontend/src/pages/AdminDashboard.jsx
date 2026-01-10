import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit2, Trash2, X, Save, 
  CheckCircle, AlertCircle, Loader2, Package, Upload, Image as ImageIcon 
} from 'lucide-react';
import { api } from '@/services/api';

// ... (Mantenha os componentes FormInput e FormSelect iguais) ...
const FormInput = ({ label, name, value, onChange, type = "text", required = false, placeholder = "" }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-[#F2C335] focus:border-transparent outline-none transition-all"
    />
  </div>
);

const FormSelect = ({ label, name, value, onChange, options, required = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-[#F2C335] focus:border-transparent outline-none transition-all"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export default function AdminProducts() {
  const [scanners, setScanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentScanner, setCurrentScanner] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Novos estados para imagem
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const initialFormState = {
    model: "",
    brand: "",
    item_condition: "Usado",
    original_price: "",
    sale_price: "",
    image_url: "",
    purchase_link: "",
    in_stock: true
  };

  const [formData, setFormData] = useState(initialFormState);

  // ... (fetchScanners e useEffect mantidos iguais) ...
  const fetchScanners = async () => {
    setIsLoading(true);
    try {
      const response = await api.getScanners({ limit: 100, search: searchTerm });
      setScanners(response.scanners || []);
    } catch (error) {
      console.error("Erro ao carregar:", error);
      alert("Erro ao carregar produtos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchScanners();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const openModal = (scanner = null) => {
    setSelectedFile(null); // Limpa arquivo anterior
    if (scanner) {
      setCurrentScanner(scanner);
      setFormData({
        model: scanner.model,
        brand: scanner.brand,
        item_condition: scanner.condition || "Usado",
        original_price: scanner.original_price,
        sale_price: scanner.sale_price,
        image_url: scanner.image_url || "",
        purchase_link: scanner.purchase_link || "",
        in_stock: scanner.in_stock
      });
      setPreviewUrl(scanner.image_url || ""); // Define preview com a URL existente
    } else {
      setCurrentScanner(null);
      setFormData(initialFormState);
      setPreviewUrl("");
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Se o usuário digitar uma URL manualmente, atualiza o preview
    if (name === 'image_url') {
      setPreviewUrl(value);
      setSelectedFile(null); // Cancela upload de arquivo se digitar URL
    }
  };

  // Nova função para lidar com seleção de arquivo
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Cria uma URL temporária para preview imediato
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      // Limpa o campo de texto da URL para evitar confusão
      setFormData(prev => ({ ...prev, image_url: "" }));
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setCurrentScanner(null);
    setSelectedFile(null);
    setPreviewUrl("");
    setIsModalOpen(false);
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let dataToSubmit = { ...formData };

      // Lógica de Upload de Imagem (se houver arquivo selecionado)
      if (selectedFile) {
        const imageFormData = new FormData();
        imageFormData.append('file', selectedFile);
        const uploadResult = await api.uploadImage(imageFormData);
        dataToSubmit.image_url = uploadResult.url;
      }

      // --- LÓGICA DO LINK PADRÃO ---
      // Se não tiver link, coloca o WhatsApp padrão
      if (!dataToSubmit.purchase_link || dataToSubmit.purchase_link.trim() === "") {
        // 👇 ALTERE AQUI PARA O SEU NÚMERO REAL
        const seuNumero = "552125447173"; 
        const mensagem = encodeURIComponent("Olá, vi um scanner no site e tenho interesse!");
        dataToSubmit.purchase_link = `https://wa.me/${seuNumero}?text=${mensagem}`;
      }
      // -----------------------------

      // Converte preços para número (caso venham como string)
      dataToSubmit.original_price = dataToSubmit.original_price ? parseFloat(dataToSubmit.original_price) : 0;
      dataToSubmit.sale_price = parseFloat(dataToSubmit.sale_price);

      if (currentScanner) {
        await api.updateScanner(currentScanner.id, dataToSubmit);
      } else {
        await api.createScanner(dataToSubmit);
      }

      await fetchScanners();
      setIsModalOpen(false);
      resetForm();
      // Opcional: mostrar um toast/alerta de sucesso
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar produto: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };


  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await api.deleteScanner(id);
        fetchScanners();
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Erro ao deletar produto");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header e Search Bar mantidos iguais... */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Produtos</h1>
            <p className="text-slate-400">Adicione, edite ou remova scanners do catálogo.</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-[#F2C335] text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-[#F2C335]/90 transition-colors shadow-lg shadow-[#F2C335]/20"
          >
            <Plus className="w-5 h-5" />
            Novo Produto
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por modelo ou marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-[#F2C335] focus:border-transparent outline-none"
          />
        </div>

        {/* Tabela mantida igual... */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800/50 border-b border-slate-800">
                <tr>
                  <th className="p-4 text-slate-400 font-medium text-sm">Produto</th>
                  <th className="p-4 text-slate-400 font-medium text-sm">Marca</th>
                  <th className="p-4 text-slate-400 font-medium text-sm">Preço Venda</th>
                  <th className="p-4 text-slate-400 font-medium text-sm">Condição</th>
                  <th className="p-4 text-slate-400 font-medium text-sm">Estoque</th>
                  <th className="p-4 text-slate-400 font-medium text-sm text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {isLoading ? (
                  <tr><td colSpan="6" className="p-8 text-center text-slate-500">Carregando...</td></tr>
                ) : scanners.map((scanner) => (
                  <tr key={scanner.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-700">
                          {scanner.image_url ? (
                            <img src={scanner.image_url} alt={scanner.model} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-white">{scanner.model}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">{scanner.brand}</td>
                    <td className="p-4 text-[#F2C335] font-medium">
                      {scanner.sale_price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {scanner.condition || scanner.item_condition}
                      </span>
                    </td>
                    <td className="p-4">
                      {scanner.in_stock ? (
                        <span className="flex items-center gap-1.5 text-green-400 text-sm">
                          <CheckCircle className="w-4 h-4" /> Em estoque
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-400 text-sm">
                          <AlertCircle className="w-4 h-4" /> Esgotado
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openModal(scanner)}
                          className="p-2 text-slate-400 hover:text-[#F2C335] hover:bg-[#F2C335]/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(scanner.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
                onClick={() => setIsModalOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              >
                <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto">
                  <form onSubmit={handleSubmit} className="p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-white">
                        {currentScanner ? 'Editar Produto' : 'Novo Produto'}
                      </h2>
                      <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Seção de Upload de Imagem */}
                      <div className="md:col-span-2 mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Imagem do Produto</label>

                        <div className="flex gap-4 items-start">
                          {/* Preview Area */}
                          <div className="w-32 h-32 bg-slate-800 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden relative group">
                            {previewUrl ? (
                              <>
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      setPreviewUrl("");
                                      setSelectedFile(null);
                                      setFormData(prev => ({ ...prev, image_url: "" }));
                                    }}
                                    className="text-white hover:text-red-400"
                                  >
                                    <Trash2 className="w-6 h-6" />
                                  </button>
                                </div>
                              </>
                            ) : (
                              <ImageIcon className="w-8 h-8 text-slate-600" />
                            )}
                          </div>

                          {/* Upload Controls */}
                          <div className="flex-1 space-y-3">
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="image-upload"
                              />
                              <label
                                htmlFor="image-upload"
                                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-all"
                              >
                                <Upload className="w-4 h-4" />
                                Escolher arquivo do computador
                              </label>
                            </div>

                            <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-800"></div>
                              </div>
                              <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-slate-900 px-2 text-slate-500">ou use uma URL</span>
                              </div>
                            </div>

                            <input
                              type="text"
                              name="image_url"
                              value={formData.image_url}
                              onChange={handleInputChange}
                              placeholder="https://exemplo.com/imagem.jpg"
                              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-[#F2C335] focus:border-transparent outline-none text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <FormInput 
                        label="Modelo" 
                        name="model" 
                        value={formData.model} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="Ex: iTero Element 5D"
                      />
                      <FormInput 
                        label="Marca" 
                        name="brand" 
                        value={formData.brand} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="Ex: Align Technology"
                      />

                      <FormSelect 
                        label="Condição" 
                        name="item_condition" 
                        value={formData.item_condition} 
                        onChange={handleInputChange}
                        options={[
                          { value: "Novo", label: "Novo" },
                          { value: "Excelente", label: "Excelente" },
                          { value: "Muito Bom", label: "Muito Bom" },
                          { value: "Bom", label: "Bom" },
                          { value: "Marcas de uso leves", label: "Marcas de uso leves" },
                          { value: "Usado", label: "Usado" }
                        ]}
                      />

                      <div className="flex items-center h-full pt-6">
                        <label className="flex items-center cursor-pointer gap-3">
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              name="in_stock" 
                              checked={formData.in_stock} 
                              onChange={handleInputChange}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F2C335]"></div>
                          </div>
                          <span className="text-sm font-medium text-slate-300">Disponível em Estoque</span>
                        </label>
                      </div>

                      <FormInput 
                        label="Preço Original (R$)" 
                        name="original_price" 
                        type="number"
                        value={formData.original_price} 
                        onChange={handleInputChange} 
                        placeholder="0.00"
                      />
                      <FormInput 
                        label="Preço de Venda (R$)" 
                        name="sale_price" 
                        type="number"
                        value={formData.sale_price} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="0.00"
                      />

                      <div className="md:col-span-2">
                        <FormInput 
                          label="Link de Compra / WhatsApp" 
                          name="purchase_link" 
                          value={formData.purchase_link} 
                          onChange={handleInputChange} 
                          placeholder="https://wa.me/..."
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 font-medium transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-xl bg-[#F2C335] text-slate-900 font-bold hover:bg-[#F2C335]/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Salvar Produto
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

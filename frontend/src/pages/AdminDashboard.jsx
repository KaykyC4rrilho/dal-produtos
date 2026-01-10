import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Edit2, Trash2, X, Save, 
  CheckCircle, AlertCircle, Loader2, Package, Upload, Image as ImageIcon,
  LogOut, AlertTriangle 
} from 'lucide-react';
import { api } from '@/services/api';

// Componentes de Formulário (Mantidos iguais)
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
  const navigate = useNavigate();
  const [scanners, setScanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados dos Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scannerToDelete, setScannerToDelete] = useState(null); // Para o modal de exclusão

  const [currentScanner, setCurrentScanner] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Estados para imagem
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
  const DEFAULT_WHATSAPP = "https://wa.me/5521999999999?text=Olá,%20tenho%20interesse%20no%20produto"; 

  const fetchScanners = async () => {
    setIsLoading(true);
    try {
      const response = await api.getScanners({ limit: 100, search: searchTerm });
      setScanners(response.scanners || []);
    } catch (error) {
      console.error("Erro ao carregar:", error);
      if (error.message && error.message.includes('401')) {
          navigate('/login');
      }
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

  const handleLogout = () => {
    api.logout();
    navigate('/login');
  };

  // --- LÓGICA DE EXCLUSÃO ---
  const confirmDelete = (scanner) => {
    setScannerToDelete(scanner);
  };

  const handleDelete = async () => {
    if (!scannerToDelete) return;

    try {
      await api.deleteScanner(scannerToDelete.id);
      setScanners(prev => prev.filter(s => s.id !== scannerToDelete.id));
      setScannerToDelete(null); // Fecha o modal
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao deletar produto");
    }
  };
  // --------------------------

  const openModal = (scanner = null) => {
    setSelectedFile(null);
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
      setPreviewUrl(scanner.image_url || "");
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
    if (name === 'image_url') {
      setPreviewUrl(value);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let dataToSubmit = { ...formData };

      if (selectedFile) {
        const imageFormData = new FormData();
        imageFormData.append('file', selectedFile);
        const uploadResult = await api.uploadImage(imageFormData);
        dataToSubmit.image_url = uploadResult.url;
      }

      const linkValue = dataToSubmit.purchase_link ? String(dataToSubmit.purchase_link) : "";

      if (!dataToSubmit.purchase_link || linkValue.trim() === "") {
        const seuNumero = "552125447173"; 
        const mensagem = encodeURIComponent("Olá, vi um scanner no site e tenho interesse!");
        dataToSubmit.purchase_link = `https://wa.me/${seuNumero}?text=${mensagem}`;
      }

      dataToSubmit.original_price = dataToSubmit.original_price ? parseFloat(dataToSubmit.original_price) : 0;
      dataToSubmit.sale_price = parseFloat(dataToSubmit.sale_price);

      if (currentScanner) {
        await api.updateScanner(currentScanner.id, dataToSubmit);
      } else {
        await api.createScanner(dataToSubmit);
      }

      await fetchScanners();
      setIsModalOpen(false);

    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar produto: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Produtos</h1>
            <p className="text-slate-400">Adicione, edite ou remova scanners do catálogo</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => openModal()}
              className="bg-[#F2C335] hover:bg-[#F2C335]/90 text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Novo Produto
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors border border-slate-700"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>

        {/* Barra de Busca */}
        <div className="bg-slate-800 p-4 rounded-xl mb-6 border border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por modelo, marca ou condição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-[#F2C335] focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Tabela de Produtos */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Marca</th>
                  <th className="px-6 py-4">Preço</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Carregando...
                      </div>
                    </td>
                  </tr>
                ) : scanners.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                ) : (
                  scanners.map((scanner) => (
                    <tr key={scanner.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-600">
                            {scanner.image_url ? (
                              <img src={scanner.image_url} alt={scanner.model} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500">
                                <Package className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-white">{scanner.model}</div>
                            <div className="text-xs text-slate-400">{scanner.condition}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{scanner.brand}</td>
                      <td className="px-6 py-4 font-medium text-[#F2C335]">
                        R$ {scanner.sale_price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        {scanner.in_stock ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                            <CheckCircle className="w-3 h-3" /> Estoque
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                            <AlertCircle className="w-3 h-3" /> Esgotado
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => openModal(scanner)}
                            className="p-2 text-slate-400 hover:text-[#F2C335] hover:bg-[#F2C335]/10 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => confirmDelete(scanner)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Confirmação de Exclusão */}
        <AnimatePresence>
          {scannerToDelete && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                onClick={() => setScannerToDelete(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              >
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 w-full max-w-md shadow-2xl pointer-events-auto">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Excluir Produto?</h3>
                    <p className="text-slate-400 mb-6">
                      Tem certeza que deseja excluir o produto <span className="text-white font-medium">"{scannerToDelete.model}"</span>? 
                      Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex gap-3 w-full">
                      <button
                        onClick={() => setScannerToDelete(null)}
                        className="flex-1 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 font-medium transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
                      >
                        Sim, excluir
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Modal de Edição/Criação */}
        <AnimatePresence>
          {isModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                onClick={() => setIsModalOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              >
                <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] pointer-events-auto">
                  {/* Header do Modal */}
                  <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      {currentScanner ? <Edit2 className="w-5 h-5 text-[#F2C335]" /> : <Plus className="w-5 h-5 text-[#F2C335]" />}
                      {currentScanner ? "Editar Produto" : "Novo Produto"}
                    </h2>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Corpo do Modal com Scroll */}
                  <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      {/* Upload de Imagem */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Imagem do Produto</label>
                        <div className="flex items-start gap-4">
                          <div className="w-32 h-32 rounded-xl bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden relative group">
                            {previewUrl ? (
                              <>
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ImageIcon className="w-8 h-8 text-white" />
                                </div>
                              </>
                            ) : (
                              <Upload className="w-8 h-8 text-slate-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="block w-full text-sm text-slate-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[#F2C335] file:text-slate-900
                                hover:file:bg-[#F2C335]/90
                                cursor-pointer mb-2"
                            />
                            <p className="text-xs text-slate-500 mb-2">Ou cole uma URL externa:</p>
                            <input
                              type="text"
                              name="image_url"
                              value={formData.image_url}
                              onChange={handleInputChange}
                              placeholder="https://exemplo.com/imagem.jpg"
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-[#F2C335] outline-none"
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
                      <FormSelect 
                        label="Marca" 
                        name="brand" 
                        value={formData.brand} 
                        onChange={handleInputChange} 
                        options={[
                          { value: "", label: "Selecione..." },
                          { value: "iTero", label: "iTero" },
                          { value: "3Shape", label: "3Shape" },
                          { value: "Medit", label: "Medit" },
                          { value: "Sirona", label: "Sirona" },
                          { value: "Outros", label: "Outros" }
                        ]}
                        required
                      />

                      <FormSelect 
                        label="Condição" 
                        name="item_condition" 
                        value={formData.item_condition} 
                        onChange={handleInputChange} 
                        options={[
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
                          placeholder={`Deixe vazio para usar o padrão: ${DEFAULT_WHATSAPP.substring(0, 30)}...`}
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

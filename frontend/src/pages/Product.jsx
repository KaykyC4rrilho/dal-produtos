import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom'; // Usando hooks do router
import {
  ArrowLeft,
  ShoppingCart,
  MessageCircle,
  Star,
  Shield,
  Truck,
  BadgeCheck,
  Tag,
  Box,
  CheckCircle2,
  Package
} from 'lucide-react';
import { api } from '@/services/api';
import { createPageUrl } from '@/utils'; // Assumindo que você tem esse utilitário
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

const conditionColors = {
  "Excelente": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  "Muito Bom": "bg-blue-500/10 text-blue-400 border-blue-500/30",
  "Bom": "bg-[#F2C335]/10 text-[#F2C335] border-[#F2C335]/30",
  "Marcas de uso leves": "bg-[#F20505]/10 text-[#F20505] border-[#F20505]/30"
};

export default function Product() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');

  // 1. Busca o Produto Principal
  const { data: scanner, isLoading } = useQuery({
    queryKey: ['scanner', productId],
    queryFn: async () => {
      if (!productId) return null;
      // Como sua API atual busca por lista, vamos buscar e filtrar (ou crie um endpoint getById)
      // Se você tiver getScannerById na api.js, use-o. 
      // Abaixo, simulando busca na lista para encontrar o ID específico:
      const res = await api.getScanners({ limit: 100 }); 
      return res.scanners.find(s => s.id.toString() === productId);
    },
    enabled: !!productId,
  });

  // 2. Busca Produtos Relacionados (Só roda quando temos a marca do produto principal)
  const { data: relatedData } = useQuery({
    queryKey: ['related-scanners', scanner?.brand, productId],
    queryFn: () => api.getScanners({
      brand: scanner.brand,
      limit: 4,
      exclude_id: productId // Exclui o produto atual da lista
    }),
    enabled: !!scanner?.brand, // Só busca se o scanner principal já carregou
  });

  const relatedScanners = relatedData?.scanners || [];

  const handlePurchase = () => {
    if (!scanner?.purchase_link) return;

    if (scanner.purchase_link.includes('whatsapp') || scanner.purchase_link.includes('wa.me')) {
      const message = encodeURIComponent(`Olá, tenho interesse no scanner ${scanner.model} que vi no site.`);
      const whatsappUrl = scanner.purchase_link.includes('?') 
        ? `${scanner.purchase_link}&text=${message}`
        : `${scanner.purchase_link}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    } else {
      window.open(scanner.purchase_link, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F2C335]"></div>
      </div>
    );
  }

  if (!scanner) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
        <Link to="/" className="text-[#F2C335] hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar para o início
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-[#F2C335]/30">
      <Header />

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Breadcrumb e Voltar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link 
            to="/" 
            className="p-2 rounded-full bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white hover:border-[#F2C335] transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-[#F2C335] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-300">{scanner.brand}</span>
            <span>/</span>
            <span className="text-[#F2C335] font-medium truncate max-w-[200px]">{scanner.model}</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Coluna da Esquerda - Imagem */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#F2C335]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {scanner.image_url ? (
                <img 
                  src={scanner.image_url} 
                  alt={scanner.model} 
                  className="w-full h-full object-contain p-12 group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                  <Box className="w-24 h-24 mb-4 opacity-50" />
                  <span className="text-sm font-medium">Sem imagem disponível</span>
                </div>
              )}

              {/* Badges Flutuantes */}
              <div className="absolute top-6 left-6 flex flex-col gap-3">
                {scanner.in_stock ? (
                  <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center gap-2 backdrop-blur-md">
                    <CheckCircle2 className="w-4 h-4" />
                    Em Estoque
                  </span>
                ) : (
                  <span className="px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold backdrop-blur-md">
                    Esgotado
                  </span>
                )}
              </div>
            </div>

            {/* Miniaturas ou Info Extra */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Shield, label: "Garantia", value: "3 Meses" },
                { icon: Truck, label: "Envio", value: "Todo Brasil" },
                { icon: BadgeCheck, label: "Revisado", value: "100% Testado" }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col items-center justify-center text-center gap-2">
                  <item.icon className="w-6 h-6 text-[#F2C335]" />
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">{item.label}</span>
                  <span className="text-sm font-bold text-slate-200">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Coluna da Direita - Informações */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider border border-slate-700">
                  {scanner.brand}
                </span>
                <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${conditionColors[scanner.item_condition] || "bg-slate-800 text-slate-400 border-slate-700"}`}>
                  {scanner.item_condition}
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
                {scanner.model}
              </h1>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-5xl font-black text-[#F2C335]">
                  R$ {scanner.sale_price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                {scanner.original_price > scanner.sale_price && (
                  <span className="text-xl text-slate-500 line-through decoration-slate-600 decoration-2">
                    R$ {scanner.original_price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>

              <div className="prose prose-invert prose-slate max-w-none mb-8">
                <p className="text-slate-400 text-lg leading-relaxed">
                  Scanner profissional revisado e com garantia. Ideal para digitalização de documentos em alta velocidade. 
                  Equipamento em excelente estado de conservação e funcionamento.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handlePurchase}
                  disabled={!scanner.in_stock}
                  className="flex-1 py-4 px-8 rounded-xl bg-[#F2C335] text-slate-950 font-black text-lg hover:bg-[#F2C335]/90 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_#F2C335]"
                >
                  {scanner.in_stock ? (
                    <>
                      <ShoppingCart className="w-6 h-6" />
                      Comprar Agora
                    </>
                  ) : (
                    "Indisponível"
                  )}
                </button>

                <button 
                  onClick={() => window.open(`https://wa.me/552139044399?text=Tenho dúvida sobre o ${scanner.model}`, '_blank')}
                  className="px-6 py-4 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Características Rápidas */}
            <div className="mt-auto pt-8 border-t border-slate-800">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Incluso na caixa
              </h3>
              <ul className="grid grid-cols-2 gap-3">
                {['Cabo de Força', 'Cabo USB', 'Fonte de Alimentação'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#F2C335]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Seção de Relacionados */}
        {relatedScanners.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 border-t border-slate-800 pt-20"
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Outros scanners <span className="text-[#F2C335]">{scanner.brand}</span>
                </h2>
                <p className="text-slate-400">Produtos similares que podem te interessar</p>
              </div>
              <Link 
                to="/" 
                className="hidden sm:flex items-center gap-2 text-[#F2C335] font-bold hover:gap-3 transition-all"
              >
                Ver todos <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedScanners.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={createPageUrl('Product') + `?id=${item.id}`}>
                    <div className="group bg-slate-900/50 rounded-2xl p-4 border border-slate-800 hover:border-[#F2C335]/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#F2C335]/5">
                      <div className="aspect-square bg-slate-800/50 rounded-xl mb-4 flex items-center justify-center p-4 relative overflow-hidden">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.model} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <Box className="w-12 h-12 text-slate-700" />
                        )}
                        {!item.in_stock && (
                          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="text-xs font-bold text-white bg-red-500/80 px-3 py-1 rounded-full">Esgotado</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="text-white font-bold line-clamp-1 group-hover:text-[#F2C335] transition-colors">{item.model}</h3>
                        </div>
                        <p className="text-2xl font-black text-[#F2C335]">
                          R$ {item.sale_price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.item_condition}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}

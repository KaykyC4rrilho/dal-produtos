import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
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
  Clock,
  Package
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

const conditionColors = {
  "Excelente": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  "Muito Bom": "bg-blue-500/10 text-blue-400 border-blue-500/30",
  "Bom": "bg-[#F2C335]/10 text-[#F2C335] border-[#F2C335]/30",
  "Marcas de uso leves": "bg-[#F20505]/10 text-[#F20505] border-[#F20505]/30"
};

export default function Product() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  const { data: scanner, isLoading } = useQuery({
    queryKey: ['scanner', productId],
    queryFn: async () => {
      const scanners = await base44.entities.Scanner.list();
      return scanners.find(s => s.id === productId);
    },
    enabled: !!productId,
  });

  const { data: relatedScanners = [] } = useQuery({
    queryKey: ['related-scanners', scanner?.brand],
    queryFn: () => base44.entities.Scanner.filter({ brand: scanner.brand }, '-created_date', 4),
    enabled: !!scanner?.brand,
  });

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#F2C335] border-t-transparent" />
      </div>
    );
  }

  if (!scanner) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Package className="w-20 h-20 text-slate-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#F20505] mb-4">Produto não encontrado</h2>
          <Link to={createPageUrl('Home')}>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              Voltar para Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = Math.round(((scanner.original_price - scanner.sale_price) / scanner.original_price) * 100);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" className="text-slate-600 hover:text-[#F20505]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao estoque
            </Button>
          </Link>
        </motion.div>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-slate-50 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 sticky top-24 shadow-lg">
              {discount > 0 && (
                <div className="absolute top-6 left-6 z-10">
                  <Badge className="bg-gradient-to-r from-[#F20505] to-[#F2C335] text-white px-4 py-2 text-lg font-bold">
                    -{discount}%
                  </Badge>
                </div>
              )}
              
              <div className="aspect-square flex items-center justify-center">
                {scanner.image_url ? (
                  <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    src={scanner.image_url}
                    alt={scanner.model}
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                ) : (
                  <Box className="w-40 h-40 text-slate-600" />
                )}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Brand */}
            <div>
              <Badge variant="outline" className="bg-[#F2C335]/10 text-[#F2C335] border-[#F2C335]/30 text-sm mb-3">
                <Tag className="w-3 h-3 mr-1" />
                {scanner.brand}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-black text-[#F20505] mb-4">
                {scanner.model}
              </h1>
            </div>

            {/* Condition */}
            <Badge 
              variant="outline" 
              className={`${conditionColors[scanner.condition]} text-base px-4 py-2`}
            >
              <Star className="w-4 h-4 mr-2" />
              Estado: {scanner.condition}
            </Badge>

            {/* Price */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-md">
              {scanner.original_price > scanner.sale_price && (
                <p className="text-slate-400 text-lg line-through mb-2">
                  De R$ {scanner.original_price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              )}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-5xl font-black text-[#F20505]">
                  R$ {scanner.sale_price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-slate-600">à vista</span>
              </div>
              <p className="text-[#F2C335] text-sm font-medium">
                Economia de R$ {(scanner.original_price - scanner.sale_price)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <motion.button
                onClick={handlePurchase}
                disabled={!scanner.in_stock}
                whileHover={{ scale: scanner.in_stock ? 1.02 : 1 }}
                whileTap={{ scale: scanner.in_stock ? 0.98 : 1 }}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                  scanner.in_stock
                    ? 'bg-gradient-to-r from-[#F2C335] to-[#F20505] text-white shadow-xl shadow-[#F20505]/30 hover:shadow-[#F20505]/50'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                {scanner.in_stock ? (
                  <>
                    {scanner.purchase_link?.includes('whatsapp') || scanner.purchase_link?.includes('wa.me') ? (
                      <>
                        <MessageCircle className="w-5 h-5" />
                        Comprar via WhatsApp
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Comprar Agora
                      </>
                    )}
                  </>
                ) : (
                  'Produto Esgotado'
                )}
              </motion.button>

              {scanner.in_stock && (
                <a 
                  href="https://wa.me/5511999999999?text=Olá! Gostaria de tirar dúvidas sobre um scanner." 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full border-[#F20505] text-[#F20505] hover:bg-[#F20505] hover:text-white">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Tirar Dúvidas
                  </Button>
                </a>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              {[
                { icon: Shield, label: "Testado", color: "emerald" },
                { icon: Truck, label: "Envio 24h", color: "blue" },
                { icon: BadgeCheck, label: "Garantia", color: "purple" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`bg-slate-50 rounded-xl p-4 flex items-center gap-3 border border-slate-200 shadow-sm`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-${item.color}-500/10 flex items-center justify-center`}>
                    <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Features */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3 shadow-md">
              <h3 className="text-xl font-bold text-[#F20505] mb-4">O que está incluso:</h3>
              {[
                "Scanner testado e revisado",
                "Cabo de alimentação",
                "Cabo USB",
                "Garantia de funcionamento",
                "Suporte técnico especializado"
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3 text-slate-300"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#F2C335] flex-shrink-0" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedScanners.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-20"
          >
            <h2 className="text-3xl font-black text-[#F20505] mb-8">
              Outros scanners <span className="text-[#F2C335]">{scanner.brand}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedScanners.filter(s => s.id !== scanner.id).slice(0, 4).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  <Link to={createPageUrl('Product') + `?id=${item.id}`}>
                    <div className="bg-white backdrop-blur-xl rounded-2xl p-4 border border-slate-200 hover:border-[#F2C335] transition-all hover:scale-105 shadow-md">
                      <div className="aspect-square bg-slate-50 rounded-xl mb-4 flex items-center justify-center p-4">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.model} className="w-full h-full object-contain" />
                        ) : (
                          <Box className="w-20 h-20 text-slate-600" />
                        )}
                      </div>
                      <h3 className="text-[#F20505] font-bold mb-2 line-clamp-2">{item.model}</h3>
                      <p className="text-2xl font-black text-[#F2C335]">
                        R$ {item.sale_price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
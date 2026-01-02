import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ExternalLink, MessageCircle, Star, Tag, Box } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const conditionColors = {
  "Excelente": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  "Muito Bom": "bg-blue-500/10 text-blue-400 border-blue-500/30",
  "Bom": "bg-[#F2C335]/10 text-[#F2C335] border-[#F2C335]/30",
  "Marcas de uso leves": "bg-[#F20505]/10 text-[#F20505] border-[#F20505]/30"
};

export default function ProductCard({ scanner, index }) {
  const [isHovered, setIsHovered] = useState(false);

  const discount = Math.round(((scanner.original_price - scanner.sale_price) / scanner.original_price) * 100);

  const handlePurchase = () => {
    if (!scanner.purchase_link) return;
    
    // Check if it's a WhatsApp link
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay: (index % 12) * 0.05,
        type: "spring",
        stiffness: 100
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => window.location.href = createPageUrl('Product') + `?id=${scanner.id}`}
    >
      <motion.div
        animate={{
          rotateY: isHovered ? 5 : 0,
          rotateX: isHovered ? -5 : 0,
          z: isHovered ? 50 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 z-20">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 + (index % 12) * 0.05, type: "spring" }}
              className="bg-gradient-to-r from-[#F20505] to-[#F2C335] text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-[#F20505]/30"
            >
              -{discount}%
            </motion.div>
          </div>
        )}

        {/* Stock Badge */}
        {!scanner.in_stock && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-30 flex items-center justify-center">
            <Badge className="bg-slate-700 text-slate-300 text-lg px-4 py-2">Esgotado</Badge>
          </div>
        )}

        {/* Image Container */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-slate-700/30 to-slate-800/30">
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center p-6"
          >
            {scanner.image_url ? (
              <img
                src={scanner.image_url}
                alt={scanner.model}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Box className="w-20 h-20 text-slate-600" />
              </div>
            )}
          </motion.div>

          {/* Shine Effect */}
          <motion.div
            animate={{
              x: isHovered ? ['-100%', '200%'] : '-100%',
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
          />
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Brand & Model */}
          <div>
            <p className="text-[#F2C335] text-xs font-semibold tracking-wider uppercase mb-1">
              {scanner.brand}
            </p>
            <h3 className="text-[#F20505] font-bold text-lg leading-tight line-clamp-2 group-hover:text-[#F2C335] transition-colors">
              {scanner.model}
            </h3>
          </div>

          {/* Condition Badge */}
          <Badge 
            variant="outline" 
            className={`${conditionColors[scanner.condition] || conditionColors["Bom"]} text-xs`}
          >
            <Star className="w-3 h-3 mr-1" />
            {scanner.condition}
          </Badge>

          {/* Price */}
          <div className="space-y-1">
            {scanner.original_price > scanner.sale_price && (
              <p className="text-slate-500 text-sm line-through">
                De R$ {scanner.original_price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">
                R$ {scanner.sale_price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-slate-500">à vista</span>
            </div>
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              handlePurchase();
            }}
            disabled={!scanner.in_stock}
            whileHover={{ scale: scanner.in_stock ? 1.02 : 1 }}
            whileTap={{ scale: scanner.in_stock ? 0.98 : 1 }}
            className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              scanner.in_stock
                ? 'bg-gradient-to-r from-[#F2C335] to-[#F20505] text-white shadow-lg shadow-[#F20505]/30 hover:shadow-[#F20505]/50'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            {scanner.purchase_link?.includes('whatsapp') || scanner.purchase_link?.includes('wa.me') ? (
              <>
                <MessageCircle className="w-4 h-4" />
                Comprar via WhatsApp
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Comprar Agora
              </>
            )}
          </motion.button>
        </div>

        {/* 3D Border Effect */}
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          className="absolute inset-0 rounded-2xl border-2 border-[#F2C335]/50 pointer-events-none"
        />
      </motion.div>
    </motion.div>
  );
}
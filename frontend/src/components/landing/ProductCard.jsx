import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle, Star, Box, AlertTriangle } from 'lucide-react';

const conditionColors = {
  "Excelente": "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
  "Muito Bom": "bg-blue-500/10 text-blue-400 border border-blue-500/30",
  "Bom": "bg-[#F2C335]/10 text-[#F2C335] border border-[#F2C335]/30",
  "Marcas de uso leves": "bg-[#F20505]/10 text-[#F20505] border border-[#F20505]/30",
  "Novo": "bg-purple-500/10 text-purple-400 border border-purple-500/30",
  "Usado": "bg-orange-500/10 text-orange-400 border border-orange-500/30"
};

// Componente de badge customizado
const Badge = ({ children, variant = 'default', className = '', ...props }) => {
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-slate-100 text-slate-800',
    outline: 'border border-slate-300 text-slate-700'
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variantClasses[variant] || variantClasses.default} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default function ProductCard({ scanner, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Calcular desconto
  const discount = scanner.original_price && scanner.sale_price
    ? Math.round(((scanner.original_price - scanner.sale_price) / scanner.original_price) * 100)
    : 0;

  const handlePurchase = (e) => {
    e.stopPropagation();

    if (!scanner.purchase_link) {
      alert('Link de compra não disponível');
      return;
    }

    if (scanner.purchase_link.includes('whatsapp') || scanner.purchase_link.includes('wa.me')) {
      const message = encodeURIComponent(`Olá, tenho interesse no scanner ${scanner.model} da marca ${scanner.brand} que vi no site.`);
      const whatsappUrl = scanner.purchase_link.includes('?')
        ? `${scanner.purchase_link}&text=${message}`
        : `${scanner.purchase_link}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    } else {
      window.open(scanner.purchase_link, '_blank');
    }
  };

  const handleCardClick = () => {
    window.location.href = `/product?id=${scanner.id}`;
  };

  const originalPrice = parseFloat(scanner.original_price) || 0;
  const salePrice = parseFloat(scanner.sale_price) || 0;
  const inStock = scanner.in_stock !== undefined ? scanner.in_stock : true;

  return (
    <motion.div
      layout // Importante: ajuda o Framer a entender mudanças de posição na lista
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }} // Força a animação ao montar
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05, // Delay menor para evitar sensação de lentidão
        ease: "easeOut"
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative cursor-pointer h-full"
      style={{ perspective: '1000px' }}
      onClick={handleCardClick}
    >
      <motion.div
        animate={{
          rotateY: isHovered ? 2 : 0,
          rotateX: isHovered ? -2 : 0,
          y: isHovered ? -5 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl h-full flex flex-col"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 z-20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-[#F20505] to-[#F2C335] text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-[#F20505]/30"
            >
              -{discount}%
            </motion.div>
          </div>
        )}

        {/* Stock Badge */}
        {!inStock && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-30 flex items-center justify-center rounded-2xl">
            <div className="bg-slate-700 text-slate-300 text-lg px-4 py-2 rounded-full flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Esgotado
            </div>
          </div>
        )}

        {/* Image Container */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-slate-700/30 to-slate-800/30 shrink-0">
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center p-6"
          >
            {scanner.image_url && !imageError ? (
              <img
                src={scanner.image_url}
                alt={`${scanner.brand} ${scanner.model}`}
                className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-300"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Box className="w-20 h-20 text-slate-600 mb-2" />
                <span className="text-slate-500 text-sm text-center px-4">
                  {scanner.brand} {scanner.model}
                </span>
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
        <div className="p-5 space-y-4 flex flex-col flex-1">
          {/* Brand & Model */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-[#F2C335] text-xs font-semibold tracking-wider uppercase">
                {scanner.brand || "Marca não informada"}
              </p>
              {inStock && (
                <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                  Disponível
                </Badge>
              )}
            </div>
            <h3 className="text-[#F20505] font-bold text-lg leading-tight line-clamp-2 group-hover:text-[#F2C335] transition-colors min-h-[3.5rem]">
              {scanner.model || "Modelo não informado"}
            </h3>
          </div>

          {/* Condition Badge */}
          {scanner.condition && (
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium w-fit ${conditionColors[scanner.condition] || conditionColors["Bom"]}`}
            >
              <Star className="w-3 h-3 mr-1" />
              {scanner.condition}
            </div>
          )}

          {/* Price Section - Pushes button to bottom */}
          <div className="space-y-1 mt-auto pt-2">
            {originalPrice > salePrice && salePrice > 0 && (
              <p className="text-slate-500 text-sm line-through">
                De R$ {originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">
                R$ {salePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-slate-500">à vista</span>
            </div>
            {salePrice === 0 && (
              <p className="text-slate-400 text-sm">Preço sob consulta</p>
            )}
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={handlePurchase}
            disabled={!inStock || !scanner.purchase_link}
            whileHover={{ scale: (inStock && scanner.purchase_link) ? 1.02 : 1 }}
            whileTap={{ scale: (inStock && scanner.purchase_link) ? 0.98 : 1 }}
            className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all mt-2 ${
              inStock && scanner.purchase_link
                ? 'bg-gradient-to-r from-[#F2C335] to-[#F20505] text-white shadow-lg shadow-[#F20505]/30 hover:shadow-[#F20505]/50 cursor-pointer'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            {!scanner.purchase_link ? (
              <>
                <AlertTriangle className="w-4 h-4" />
                Indisponível
              </>
            ) : scanner.purchase_link.includes('whatsapp') || scanner.purchase_link.includes('wa.me') ? (
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

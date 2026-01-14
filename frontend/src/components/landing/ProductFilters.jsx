import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';

const PRICE_RANGES = [
  { label: "Todos os preços", value: "all" },
  { label: "Até R$ 500", value: "0-500" },
  { label: "R$ 500 - R$ 1.000", value: "500-1000" },
  { label: "R$ 1.000 - R$ 2.000", value: "1000-2000" },
  { label: "R$ 2.000 - R$ 5.000", value: "2000-5000" },
  { label: "Acima de R$ 5.000", value: "5000+" },
];

// Componente de input
const Input = ({ type, placeholder, value, onChange, className = '' }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full pl-12 pr-4 py-3 bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-[#F2C335] focus:ring-2 focus:ring-[#F2C335]/20 ${className}`}
    />
  );
};

// Componente de select simplificado
const CustomSelect = ({ value, onValueChange, icon: Icon, placeholder, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(placeholder);

  // Atualizar label quando value mudar
  useEffect(() => {
    const option = options.find(opt => opt.value === value);
    if (option) {
      setSelectedLabel(option.label);
    } else {
      setSelectedLabel(placeholder);
    }
  }, [value, options, placeholder]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-600/50 text-white rounded-xl hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center truncate">
          {Icon && <Icon className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />}
          <span className="truncate">{selectedLabel}</span>
        </div>
        <svg
          className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop transparente para fechar ao clicar fora - Z-Index alto */}
          <div 
            className="fixed inset-0 z-[90]"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown - Z-Index muito alto para sobrepor os cards 3D */}
          <div className="absolute z-[100] w-full mt-1 bg-slate-800 border border-slate-700 rounded-md shadow-xl overflow-hidden">
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onValueChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-slate-200 text-sm hover:bg-slate-700 focus:outline-none transition-colors ${
                    value === option.value ? 'bg-slate-700' : ''
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Componente de botão para ProductFilters
const FilterButton = ({ children, onClick, variant = 'outline', className = '' }) => {
  const baseClasses = 'font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 flex items-center';

  const variantClasses = {
    default: 'bg-gradient-to-r from-[#F2C335] to-[#F20505] text-white hover:from-[#F2C335]/90 hover:to-[#F20505]/90',
    outline: 'border border-slate-600/50 text-slate-300 hover:bg-slate-700',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.outline} ${className}`}
    >
      {children}
    </button>
  );
};

export default function ProductFilters({
  searchTerm,
  setSearchTerm,
  selectedBrand,
  setSelectedBrand,
  priceRange,
  setPriceRange,
  totalResults,
  brands = []
}) {
  const hasActiveFilters = searchTerm || selectedBrand !== "all" || priceRange !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBrand("all");
    setPriceRange("all");
  };

  const manualBrands = ["Fujitsu", "Brother"];

  const apiBrands = brands.filter(b => !manualBrands.includes(b));

  const allBrands = [...manualBrands, ...apiBrands];

  const brandOptions = [
    { label: "Todas as Marcas", value: "all" },
    ...allBrands.map(brand => ({ label: brand, value: brand }))
  ];

  const priceOptions = PRICE_RANGES;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      // ADICIONADO: relative e z-30 para garantir que a barra inteira fique acima do grid
      className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-slate-700/50 mb-8 relative z-30"
    >
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Buscar scanner por modelo ou marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          {/* Brand Filter */}
          <div className="w-full sm:w-[180px]">
            <CustomSelect
              value={selectedBrand}
              onValueChange={setSelectedBrand}
              icon={Filter}
              placeholder="Marca"
              options={brandOptions}
            />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <FilterButton onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Limpar
              </FilterButton>
            </motion.div>
          )}
        </div>
      </div>

      {/* Results Count & Active Filters */}
      <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-slate-700/50">
        <span className="text-slate-700 text-sm">
          <span className="text-[#F2C335] font-bold">{totalResults}</span> produtos encontrados
        </span>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F2C335]/10 text-[#F2C335] border border-[#F2C335]/30">
                Busca: "{searchTerm}"
                <button 
                  onClick={() => setSearchTerm("")} 
                  className="ml-2 hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedBrand !== "all" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
                Marca: {selectedBrand}
                <button 
                  onClick={() => setSelectedBrand("all")} 
                  className="ml-2 hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {priceRange !== "all" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/30">
                Preço: {PRICE_RANGES.find(r => r.value === priceRange)?.label}
                <button 
                  onClick={() => setPriceRange("all")} 
                  className="ml-2 hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

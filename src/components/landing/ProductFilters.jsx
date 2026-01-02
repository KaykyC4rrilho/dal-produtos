import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BRANDS = ["Canon", "Fujitsu", "Kodak", "Epson", "HP", "Brother"];
const PRICE_RANGES = [
  { label: "Todos os preços", value: "all" },
  { label: "Até R$ 500", value: "0-500" },
  { label: "R$ 500 - R$ 1.000", value: "500-1000" },
  { label: "R$ 1.000 - R$ 2.000", value: "1000-2000" },
  { label: "R$ 2.000 - R$ 5.000", value: "2000-5000" },
  { label: "Acima de R$ 5.000", value: "5000+" },
];

export default function ProductFilters({
  searchTerm,
  setSearchTerm,
  selectedBrand,
  setSelectedBrand,
  priceRange,
  setPriceRange,
  totalResults,
}) {
  const hasActiveFilters = searchTerm || selectedBrand !== "all" || priceRange !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBrand("all");
    setPriceRange("all");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-slate-700/50 mb-8"
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
            className="w-full pl-12 pr-4 py-3 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl focus:border-[#F2C335] focus:ring-[#F2C335]/20"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          {/* Brand Filter */}
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="w-full sm:w-[180px] bg-slate-900/50 border-slate-600/50 text-white rounded-xl">
              <Filter className="w-4 h-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Marca" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all" className="text-slate-200 focus:bg-slate-700">Todas as Marcas</SelectItem>
              {BRANDS.map((brand) => (
                <SelectItem key={brand} value={brand} className="text-slate-200 focus:bg-slate-700">
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Price Filter */}
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-full sm:w-[200px] bg-slate-900/50 border-slate-600/50 text-white rounded-xl">
              <SlidersHorizontal className="w-4 h-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Faixa de Preço" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {PRICE_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value} className="text-slate-200 focus:bg-slate-700">
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-slate-600/50 text-slate-300 hover:bg-slate-700 rounded-xl"
              >
                <X className="w-4 h-4 mr-2" />
                Limpar
              </Button>
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
              <Badge variant="secondary" className="bg-[#F2C335]/10 text-[#F2C335] border border-[#F2C335]/30">
                Busca: "{searchTerm}"
                <button onClick={() => setSearchTerm("")} className="ml-2 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedBrand !== "all" && (
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border border-blue-500/30">
                Marca: {selectedBrand}
                <button onClick={() => setSelectedBrand("all")} className="ml-2 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {priceRange !== "all" && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-400 border border-green-500/30">
                Preço: {PRICE_RANGES.find(r => r.value === priceRange)?.label}
                <button onClick={() => setPriceRange("all")} className="ml-2 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
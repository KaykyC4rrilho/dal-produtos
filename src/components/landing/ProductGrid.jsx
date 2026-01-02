import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ProductGrid({ scanners, isLoading }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredScanners = useMemo(() => {
    return scanners.filter((scanner) => {
      // Search filter
      const searchMatch = !searchTerm || 
        scanner.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scanner.brand?.toLowerCase().includes(searchTerm.toLowerCase());

      // Brand filter
      const brandMatch = selectedBrand === "all" || scanner.brand === selectedBrand;

      // Price filter
      let priceMatch = true;
      if (priceRange !== "all") {
        const price = scanner.sale_price || 0;
        const [min, max] = priceRange.split("-").map(Number);
        if (priceRange === "5000+") {
          priceMatch = price >= 5000;
        } else {
          priceMatch = price >= min && price <= max;
        }
      }

      return searchMatch && brandMatch && priceMatch;
    });
  }, [scanners, searchTerm, selectedBrand, priceRange]);

  const totalPages = Math.ceil(filteredScanners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleScanners = filteredScanners.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBrand, priceRange]);

  if (isLoading) {
    return (
      <section id="vitrine" className="py-16 md:py-24 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="bg-slate-200 rounded-2xl h-96 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="vitrine" className="py-16 md:py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F2C335]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F20505]/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#F2C335] to-[#F20505] rounded-2xl mb-6 shadow-lg shadow-[#F20505]/30"
          >
            <Package className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F20505] mb-4">
            Estoque <span className="text-[#F2C335]">Disponível</span>
          </h2>
          <p className="text-slate-700 text-lg max-w-2xl mx-auto">
            Equipamentos revisados, testados e prontos para uso imediato
          </p>
        </motion.div>

        {/* Filters */}
        <ProductFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          totalResults={filteredScanners.length}
        />

        {/* Product Grid */}
        {filteredScanners.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleScanners.map((scanner, index) => (
                <ProductCard
                  key={scanner.id}
                  scanner={scanner}
                  index={index}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex items-center justify-center gap-2 mt-12"
              >
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="icon"
                  className="border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          variant={currentPage === page ? "default" : "outline"}
                          size="icon"
                          className={
                            currentPage === page
                              ? "bg-gradient-to-r from-[#F2C335] to-[#F20505] text-white border-0"
                              : "border-slate-200 text-slate-700 hover:bg-slate-100"
                          }
                        >
                          {page}
                        </Button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="text-slate-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                <Button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="icon"
                  className="border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Package className="w-20 h-20 text-slate-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-[#F20505] mb-2">Nenhum produto encontrado</h3>
            <p className="text-slate-600">Tente ajustar os filtros ou fazer uma nova busca</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
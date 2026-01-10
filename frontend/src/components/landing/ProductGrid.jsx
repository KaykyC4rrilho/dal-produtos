import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import { Package, ChevronLeft, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '@/services/api';

// Componente de botão customizado
const GridButton = ({ children, onClick, disabled, className = '', variant = 'default', size = 'default', ...props }) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    default: 'bg-gradient-to-r from-[#F2C335] to-[#F20505] text-white hover:from-[#F2C335]/90 hover:to-[#F20505]/90',
    outline: 'border border-slate-200 text-slate-700 hover:bg-slate-100',
    destructive: 'bg-red-600 text-white hover:bg-red-700'
  };
  const sizeClasses = {
    default: 'px-4 py-2 text-sm',
    sm: 'px-3 py-1.5 text-xs',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.default} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Componente de alerta customizado
const Alert = ({ children, variant = 'default', className = '' }) => {
  const variantClasses = {
    default: 'bg-blue-50 text-blue-800 border border-blue-200',
    destructive: 'bg-red-50 text-red-800 border border-red-200'
  };
  return (
    <div className={`p-4 rounded-lg ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

const AlertDescription = ({ children, className = '' }) => (
  <div className={`text-sm ${className}`}>{children}</div>
);

export default function ProductGrid() {
  const [scanners, setScanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);
  const [error, setError] = useState(null);

  // Estados de filtro
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [availableBrands, setAvailableBrands] = useState([]);

  const itemsPerPage = 12;

  // Buscar marcas disponíveis
  const fetchBrands = async () => {
    try {
      const response = await api.getBrands();
      setAvailableBrands(response.brands || []);
    } catch (err) {
      console.error('Erro ao carregar marcas:', err);
      setAvailableBrands([]);
    }
  };

  // Função centralizada de busca
  // Usamos useCallback para garantir que a função não seja recriada desnecessariamente
  const fetchScanners = useCallback(async (pageToFetch = 1, isFilterChange = false) => {
    if (isFilterChange) {
      setIsLoadingFilters(true);
    } else {
      // Se for apenas troca de página e já temos dados, talvez não precise de loading full
      // mas vamos manter para feedback visual
      setIsLoadingFilters(true); 
    }

    setError(null);

    try {
      // Converter priceRange para min/max
      let minPrice, maxPrice;
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(str => {
          if (str.includes('+')) {
            return parseFloat(str.replace('+', ''));
          }
          return parseFloat(str);
        });

        if (priceRange === "5000+") {
          minPrice = 5000;
          maxPrice = undefined;
        } else {
          minPrice = min;
          maxPrice = max;
        }
      }

      const response = await api.getScanners({
        brand: selectedBrand !== "all" ? selectedBrand : undefined,
        min_price: minPrice,
        max_price: maxPrice,
        search: searchTerm,
        page: pageToFetch,
        limit: itemsPerPage,
        in_stock: true
      });

      setScanners(response.scanners || []);
      setTotalItems(response.total || 0);
      setTotalPages(response.total_pages || 0);
      setCurrentPage(pageToFetch); // Atualiza a página atual aqui

    } catch (err) {
      console.error('Erro ao carregar scanners:', err);
      setError(err.message || 'Erro ao carregar produtos. Verifique se o backend está rodando.');
      setScanners([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
      setIsLoadingFilters(false);
    }
  }, [searchTerm, selectedBrand, priceRange]); // Dependências da função de busca

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      await fetchBrands();
      await fetchScanners(1);
    };
    loadInitialData();
  }, []); // Executa apenas uma vez na montagem

  // Debounce para filtros
  useEffect(() => {
    // Não queremos disparar na montagem inicial pois o loadInitialData já cuida disso
    // Mas como searchTerm começa vazio, ok.
    // O importante é: Quando mudar filtro, volta pra página 1

    const timeoutId = setTimeout(() => {
      // Se não estiver carregando inicialmente (para evitar conflito com o mount)
      if (!isLoading) {
        fetchScanners(1, true);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedBrand, priceRange]); // Removemos fetchScanners das deps para evitar loop, mas idealmente ele estaria lá com useCallback

  // Handler para mudança de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      fetchScanners(newPage, false);
      // Scroll suave para o topo da lista
      document.getElementById('vitrine')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Função para renderizar paginação
  const renderPaginationButtons = () => {
    const buttons = [];

    // Botão página anterior
    buttons.push(
      <GridButton
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        size="icon"
        className="border-slate-200 text-slate-700 hover:bg-slate-100"
      >
        <ChevronLeft className="w-4 h-4" />
      </GridButton>
    );

    // Lógica de botões numéricos (mantida igual)
    if (totalPages > 0) {
      buttons.push(
        <GridButton
          key={1}
          onClick={() => handlePageChange(1)}
          variant={currentPage === 1 ? "default" : "outline"}
          size="icon"
          className={currentPage === 1 ? "border-0" : ""}
        >
          1
        </GridButton>
      );
    }

    if (currentPage > 3) {
      buttons.push(<span key="ellipsis1" className="text-slate-400 px-2">...</span>);
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i > 1 && i < totalPages) {
        buttons.push(
          <GridButton
            key={i}
            onClick={() => handlePageChange(i)}
            variant={currentPage === i ? "default" : "outline"}
            size="icon"
            className={currentPage === i ? "border-0" : ""}
          >
            {i}
          </GridButton>
        );
      }
    }

    if (currentPage < totalPages - 2) {
      buttons.push(<span key="ellipsis2" className="text-slate-400 px-2">...</span>);
    }

    if (totalPages > 1) {
      buttons.push(
        <GridButton
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="icon"
          className={currentPage === totalPages ? "border-0" : ""}
        >
          {totalPages}
        </GridButton>
      );
    }

    // Botão próxima página
    buttons.push(
      <GridButton
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        size="icon"
        className="border-slate-200 text-slate-700 hover:bg-slate-100"
      >
        <ChevronRight className="w-4 h-4" />
      </GridButton>
    );

    return buttons;
  };

  // Loading inicial (Full Screen)
  if (isLoading && scanners.length === 0) {
    return (
      <section id="vitrine" className="py-16 md:py-24 bg-gradient-to-b from-slate-950 to-slate-900 min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#F2C335] animate-spin mx-auto mb-4" />
            <p className="text-white">Carregando produtos...</p>
          </div>
        </div>
      </section>
    );
  }

  // Erro
  if (error) {
    return (
      <section id="vitrine" className="py-16 md:py-24 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive" className="bg-red-950/50 border-red-600/50">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-white">
                {error}
              </AlertDescription>
            </div>
          </Alert>
          <div className="mt-4 text-center">
            <GridButton 
              onClick={() => {
                setIsLoading(true);
                fetchScanners(1);
              }}
            >
              Tentar novamente
            </GridButton>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="vitrine" className="py-16 md:py-24 bg-slate-50 relative overflow-hidden min-h-screen">
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
            {totalItems} equipamentos revisados, testados e prontos para uso imediato
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
          totalResults={totalItems}
          brands={availableBrands}
        />

        {/* Loading durante filtragem */}
        {isLoadingFilters && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-[#F2C335] animate-spin mr-3" />
            <span className="text-slate-600 text-lg font-medium">Atualizando catálogo...</span>
          </div>
        )}

        {/* Product Grid */}
        {!isLoadingFilters && (
          <>
            {scanners.length > 0 ? (
              <>
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {scanners.map((scanner, index) => (
                      <ProductCard
                        key={scanner.id}
                        scanner={scanner}
                        index={index}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center gap-2 mt-12"
                  >
                    {renderPaginationButtons()}
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white/50 rounded-3xl border border-slate-200"
              >
                <Package className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-[#F20505] mb-2">Nenhum produto encontrado</h3>
                <p className="text-slate-600 mb-6">Não encontramos scanners com os filtros selecionados.</p>
                <GridButton
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedBrand("all");
                    setPriceRange("all");
                    // O useEffect do debounce vai pegar essas mudanças e chamar fetchScanners(1)
                  }}
                  variant="outline"
                  className="border-[#F2C335] text-[#F20505] hover:bg-[#F2C335]/10"
                >
                  Limpar todos os filtros
                </GridButton>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

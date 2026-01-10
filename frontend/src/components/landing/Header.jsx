import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    if (location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gradient-to-r from-[#F2C335] via-[#F20505] to-[#F2C335] text-white py-2.5 px-4 text-center relative overflow-hidden"
      >
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
        <div className="flex items-center justify-center gap-2 text-sm md:text-base font-medium relative z-10">
          <Zap className="w-4 h-4 animate-pulse" />
          <span>Queima de Estoque: Equipamentos revisados com garantia de funcionamento</span>
          <Zap className="w-4 h-4 animate-pulse" />
        </div>
      </motion.div>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/10' 
            : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/')}
            >
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6940678a77918f731aca6e40/c2df3d798_image.png"
                alt="Dal Produtos"
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
              />
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-bold text-[#F20505]">Dal <span className="text-[#F2C335]">Produtos</span></h1>
                <p className="text-[10px] md:text-xs text-slate-600 -mt-1">Equipamentos Revisados</p>
              </div>
            </motion.div>

            {/* Menu Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: 'Home', id: 'hero' },
                { label: 'Estoque', id: 'vitrine' },
                { label: 'Contato', id: 'footer' }
              ].map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-slate-700 hover:text-[#F20505] transition-colors relative group font-medium"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#F2C335] to-[#F20505] group-hover:w-full transition-all duration-300" />
                </motion.button>
              ))}
            </nav>
            <motion.a
              href="#vitrine"
              onClick={(e) => { 
                e.preventDefault(); 
                scrollToSection('vitrine'); 
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#F2C335] to-[#F20505] text-white px-5 py-2.5 rounded-full font-semibold shadow-lg shadow-[#F20505]/30 hover:shadow-[#F20505]/50 transition-shadow cursor-pointer"
            >
              
              Ver Ofertas
            </motion.a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#F20505]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/98 backdrop-blur-xl border-t border-slate-200"
            >
              <div className="px-4 py-4 space-y-3">
                {[
                  { label: 'Home', id: 'hero' },
                  { label: 'Estoque', id: 'vitrine' },
                  { label: 'Contato', id: 'footer' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left text-slate-700 hover:text-[#F20505] py-2 font-medium"
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => scrollToSection('vitrine')}
                  className="w-full bg-gradient-to-r from-[#F2C335] to-[#F20505] text-white py-3 rounded-xl font-semibold mt-2"
                >
                  Ver Ofertas
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

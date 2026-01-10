import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Mail, 
  Phone, 
  MapPin, 
  MessageCircle,
  ArrowUp,
  Heart,
  Instagram,
  Facebook,
  Linkedin
} from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-slate-950 relative overflow-hidden">
      {/* Top Border Gradient */}
      <div className="h-1 bg-gradient-to-r from-[#F2C335] via-[#F20505] to-[#F2C335]" />

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-[#F2C335] to-[#F20505] rounded-full flex items-center justify-center shadow-lg shadow-[#F20505]/30 z-10"
      >
        <ArrowUp className="w-5 h-5 text-white" />
      </motion.button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6940678a77918f731aca6e40/c2df3d798_image.png"
                alt="Dal Produtos"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h3 className="text-xl font-bold text-white">Dal <span className="text-[#F2C335]">Produtos</span></h3>
                <p className="text-xs text-slate-400">Equipamentos Revisados</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Especialistas em scanners profissionais revisados. 
              Qualidade garantida com os melhores preços do mercado.
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: "https://www.instagram.com/dalprodutoseservicos/" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -3 }}
                  className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Rápidos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-white font-bold mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", id: "hero" },
                { label: "Estoque", id: "vitrine" },
                { label: "Sobre Nós", id: "footer" },
                { label: "Contato", id: "footer" }
              ].map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      const el = document.getElementById(link.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-slate-400 hover:text-[#F2C335] transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Marcas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-white font-bold mb-6">Marcas</h4>
            <ul className="space-y-3">
              {["Canon", "Fujitsu", "Kodak", "Epson", "HP", "Brother"].map((brand, index) => (
                <li key={index}>
                  <span className="text-slate-400 text-sm">{brand}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contato */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-white font-bold mb-6">Contato</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+5521925447173" className="flex items-center gap-3 text-slate-400 hover:text-[#F2C335] transition-colors text-sm">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>(21) 2544-7173</span>
                </a>
              </li>
              <li>
                <a href="mailto:contato@dalprodutos.com.br" className="flex items-center gap-3 text-slate-400 hover:text-[#F2C335] transition-colors text-sm">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>sac@dal.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/552125447173" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-400 hover:text-green-400 transition-colors text-sm"
                >
                  <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-400">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              © {currentYear} Dal Produtos. Todos os direitos reservados.
            </p>
            <p className="text-slate-500 text-sm flex items-center gap-1">
              Feito com <Heart className="w-4 h-4 text-red-500 fill-red-500" /> no Brasil
            </p>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <motion.a
        href="https://wa.me/5511999999999?text=Olá! Vi o site de vocês e gostaria de mais informações sobre os scanners."
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 z-50"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </motion.a>
    </footer>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Truck, 
  Headphones, 
  CheckCircle2, 
  Star,
  Award,
  Clock,
  ThumbsUp
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: "Equipamentos Testados",
    description: "Cada scanner passa por rigorosos testes de qualidade antes de ser disponibilizado",
    color: "from-emerald-500 to-green-500"
  },
  {
    icon: Truck,
    title: "Envio Imediato",
    description: "Despachamos em até 24h úteis após confirmação do pagamento",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Headphones,
    title: "Suporte Técnico",
    description: "Time especializado pronto para ajudar na instalação e uso do equipamento",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Award,
    title: "Garantia de Funcionamento",
    description: "Todos os equipamentos possuem garantia contra defeitos de funcionamento",
    color: "from-[#F2C335] to-[#F20505]"
  }
];

const brands = [
  { name: "Canon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Canon_wordmark.svg/200px-Canon_wordmark.svg.png" },
  { name: "Fujitsu", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Fujitsu-Logo.svg/200px-Fujitsu-Logo.svg.png" },
  { name: "Kodak", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Kodak_%282017%29.svg/200px-Kodak_%282017%29.svg.png" },
  { name: "Epson", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Epson_logo.svg/200px-Epson_logo.svg.png" },
  { name: "HP", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/150px-HP_logo_2012.svg.png" },
  { name: "Brother", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Brother_logo.svg/200px-Brother_logo.svg.png" }
];

const testimonials = [
  {
    name: "Carlos M.",
    role: "Contador",
    text: "Comprei um Fujitsu fi-7160 por metade do preço. Funciona perfeitamente!",
    rating: 5
  },
  {
    name: "Ana Paula S.",
    role: "Advogada",
    text: "Excelente atendimento e entrega rápida. Scanner Canon impecável.",
    rating: 5
  },
  {
    name: "Roberto L.",
    role: "Empresário",
    text: "Já comprei 3 scanners para meu escritório. Todos funcionando sem problemas.",
    rating: 5
  }
];

export default function TrustSection() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] border border-slate-800/30 rounded-full"
        />
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] border border-slate-800/30 rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F20505] mb-4">
            Por que comprar <span className="text-[#F2C335]">conosco?</span>
          </h2>
          <p className="text-slate-700 text-lg max-w-2xl mx-auto">
            Mais de 10 anos de experiência em equipamentos de digitalização
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
              style={{ perspective: '1000px' }}
            >
              <div className="bg-slate-50 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 h-full transition-all duration-300 group-hover:border-[#F2C335] shadow-md">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-[#F20505] mb-3 group-hover:text-[#F2C335] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-[#F20505] text-center mb-10">
            O que nossos clientes dizem
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-slate-50 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 shadow-md"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#F2C335] fill-[#F2C335]" />
                  ))}
                </div>

                <p className="text-slate-700 mb-4 italic">"{testimonial.text}"</p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F2C335] to-[#F20505] flex items-center justify-center">
                    <span className="text-white font-bold">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-[#F20505] font-semibold">{testimonial.name}</p>
                    <p className="text-slate-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Brands */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="text-slate-600 text-sm uppercase tracking-wider mb-8">
            Trabalhamos com as melhores marcas
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {brands.map((brand, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300"
              >
                <div className="h-8 md:h-10 flex items-center">
                  <span className="text-slate-600 text-xl font-bold">{brand.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { number: "2000+", label: "Scanners vendidos" },
            { number: "98%", label: "Clientes satisfeitos" },
            { number: "24h", label: "Tempo de envio" },
            { number: "15+", label: "Anos de experiência" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-md"
            >
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#F2C335] to-[#F20505] bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <p className="text-slate-600 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
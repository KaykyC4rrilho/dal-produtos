"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowDown,
  Shield,
  Truck,
  BadgeCheck,
  Sparkles,
  Flame,
  Users,
} from "lucide-react";

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const scrollToVitrine = () => {
    const element = document.getElementById("vitrine");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(242, 197, 53, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(242, 197, 53, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            transform: "perspective(500px) rotateX(60deg)",
            transformOrigin: "center top",
          }}
        />
        <motion.div
          animate={{ y: [0, -60] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(242, 197, 53, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(242, 197, 53, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            transform: "perspective(500px) rotateX(60deg)",
            transformOrigin: "center top",
          }}
        />
      </div>

      {/* Glows */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#F2C335]/10 rounded-full blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#F20505]/10 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Main Content */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >

        {/* Gatilho de escassez */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 text-sm font-semibold px-4 py-1 rounded-full mb-4 shadow-sm"
        >
          <Flame className="w-4 h-4" />
          Últimas unidades disponíveis — estoque limitado
        </motion.div>

        {/* Prova social */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="inline-flex items-center gap-2 text-slate-500 text-sm font-medium mb-6"
        >
          <Users className="w-4 h-4" />
          +1.200 scanners entregues com sucesso
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, x: -100, rotateY: -20 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.5, type: "spring" }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#F20505] mb-6 leading-tight"
          style={{
            textShadow: "0 0 40px rgba(242, 197, 53, 0.3)",
            transform: "perspective(1000px)",
          }}
        >
          Scanners Profissionais
          <br />
          <span className="bg-gradient-to-r from-[#F2C335] via-[#F20505] to-[#F2C335] bg-clip-text text-transparent">
            Revisados com Garantia
          </span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg sm:text-xl md:text-2xl text-slate-700 mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          Alta performance para seu negócio,
          <br className="hidden sm:block" />
          <span className="text-[#F2C335] font-semibold">
            sem pagar o preço de um novo.
          </span>
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.button
            onClick={scrollToVitrine}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 60px rgba(242, 5, 5, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-10 py-5 bg-gradient-to-r from-[#F2C335] to-[#F20505] text-white text-lg font-bold rounded-2xl shadow-2xl shadow-[#F20505]/30 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              Ver modelos disponíveis
              <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#F20505] to-[#F2C335]"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>

        {/* Badges de confiança */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10"
        >
          {[
            { icon: Shield, label: "Garantia de Funcionamento" },
            { icon: Truck, label: "Envio Imediato" },
            { icon: BadgeCheck, label: "Testados e Higienizados" },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex items-center gap-3 text-slate-700 bg-slate-50 backdrop-blur-sm px-5 py-3 rounded-xl border border-slate-200"
            >
              <item.icon className="w-5 h-5 text-[#F2C335]" />
              <span className="text-sm font-medium">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

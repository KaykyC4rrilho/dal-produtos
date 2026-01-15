import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import ProductGrid from '@/components/landing/ProductGrid';
import TrustSection from '@/components/landing/TrustSection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  const { data: scanners = [], isLoading } = useQuery({
    queryKey: ['scanners'],
    queryFn: async () => {
      const res = await fetch('/api/produtos');
      if (!res.ok) throw new Error('Erro ao buscar scanners');
      return res.json();
    },
    initialData: [],
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <ProductGrid scanners={scanners} isLoading={isLoading} />
      <TrustSection />
      <Footer />
    </div>
  );
}

import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import ProductGrid from '@/components/landing/ProductGrid';
import TrustSection from '@/components/landing/TrustSection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  const { data: scanners = [], isLoading } = useQuery({
    queryKey: ['scanners'],
    queryFn: () => base44.entities.Scanner.list('-created_date', 100),
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
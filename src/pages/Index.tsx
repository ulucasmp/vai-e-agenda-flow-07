
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SupabaseDebug from "@/components/debug/SupabaseDebug";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />

      {/* Componente de debug temporário - remover após testes */}
      <div className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Debug Temporário</h2>
          <SupabaseDebug />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;


import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEmpresa } from '@/hooks/useEmpresa';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import OverviewTab from '@/components/dashboard/OverviewTab';
import CompanyTab from '@/components/dashboard/CompanyTab';
import ProfessionalsTab from '@/components/dashboard/ProfessionalsTab';
import ServicesTab from '@/components/dashboard/ServicesTab';
import CalendarTab from '@/components/dashboard/CalendarTab';

const Dashboard = () => {
  const { user, session, loading: authLoading } = useAuth();
  const { empresa, profissionais, loading: empresaLoading } = useEmpresa();

  console.log('Dashboard - authLoading:', authLoading, 'user:', user?.email, 'empresaLoading:', empresaLoading, 'empresa:', empresa?.nome_negocio);

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div>Carregando...</div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user || !session) {
    console.log('Dashboard - Redirecting to /auth - no user or session');
    return <Navigate to="/auth" replace />;
  }

  // Show loading while checking empresa
  if (empresaLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div>Carregando dados da empresa...</div>
        </div>
      </div>
    );
  }

  // Redirect to setup if no company
  if (!empresa) {
    console.log('Dashboard - Redirecting to /empresa-setup - no empresa');
    return <Navigate to="/empresa-setup" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader companyName={empresa.nome_negocio} />
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="company">Empresa</TabsTrigger>
            <TabsTrigger value="professionals">Profissionais</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="calendar">Agenda</TabsTrigger>
          </TabsList>

          <OverviewTab 
            companyData={{
              name: empresa.nome_negocio,
              type: empresa.tipo,
              phone: empresa.telefone || '',
              address: empresa.endereco || ''
            }}
            professionals={profissionais.map(prof => ({
              id: prof.id,
              name: prof.nome,
              specialty: prof.especialidade,
              active: prof.ativo
            }))}
            services={[]}
            appointments={[]}
          />
          
          <CompanyTab />
          
          <ProfessionalsTab professionals={profissionais.map(prof => ({
            id: prof.id,
            name: prof.nome,
            specialty: prof.especialidade,
            phone: '',
            email: '',
            active: prof.ativo
          }))} />
          
          <ServicesTab />
          
          <CalendarTab />
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;


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
  const { user, loading: authLoading } = useAuth();
  const { empresa, profissionais, loading: empresaLoading } = useEmpresa();

  // Redirect if not authenticated
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to setup if no company
  if (!empresa && !empresaLoading && !authLoading) {
    return <Navigate to="/empresa-setup" replace />;
  }

  if (authLoading || empresaLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    );
  }

  if (!empresa) {
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
            services={[]} // Iniciar vazio - será implementado depois
            appointments={[]} // Iniciar vazio - será implementado depois
          />
          
          <CompanyTab />
          
          <ProfessionalsTab professionals={profissionais.map(prof => ({
            id: parseInt(prof.id.replace(/-/g, '').substring(0, 8), 16),
            name: prof.nome,
            specialty: prof.especialidade,
            phone: '',
            email: '',
            active: prof.ativo
          }))} />
          
          <ServicesTab services={[]} />
          
          <CalendarTab />
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;


import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCompany } from '@/contexts/CompanyContext';
import { useToast } from '@/hooks/use-toast';

// Import the dashboard components
import DashboardHeader from './dashboard/DashboardHeader';
import BookingLinkCard from './dashboard/BookingLinkCard';
import StatsCards from './dashboard/StatsCards';
import OverviewTab from './dashboard/OverviewTab';
import CalendarTab from './dashboard/CalendarTab';
import CompanyTab from './dashboard/CompanyTab';
import ServicesTab from './dashboard/ServicesTab';
import ProfessionalsTab from './dashboard/ProfessionalsTab';

const Dashboard = () => {
  const { companySettings } = useCompany();
  const { toast } = useToast();

  // Dados mockados - em produção viriam do backend
  const todayStats = {
    agendamentos: 8,
    receita: 540,
    disponivel: 4,
    cancelados: 1
  };

  const appointments = [
    { id: 1, clientName: 'Maria Silva', service: 'Corte + Escova', professional: 'Ana Costa', date: new Date().toISOString(), time: '14:00', status: 'confirmed' as const },
    { id: 2, clientName: 'João Santos', service: 'Corte + Barba', professional: 'Carlos Lima', date: new Date().toISOString(), time: '15:30', status: 'confirmed' as const },
    { id: 3, clientName: 'Pedro Oliveira', service: 'Barba', professional: 'Carlos Lima', date: new Date().toISOString(), time: '16:00', status: 'pending' as const },
  ];

  const services = [
    { id: 1, name: 'Corte Masculino', price: 35, duration: 30, active: true },
    { id: 2, name: 'Corte + Barba', price: 50, duration: 45, active: true },
    { id: 3, name: 'Escova Progressiva', price: 120, duration: 180, active: true },
    { id: 4, name: 'Coloração', price: 80, duration: 120, active: false },
  ];

  const professionals = [
    { id: 1, name: 'Ana Costa', specialty: 'Cabeleireira', phone: '(11) 99999-9999', email: 'ana@exemplo.com', active: true },
    { id: 2, name: 'Carlos Lima', specialty: 'Barbeiro', phone: '(11) 88888-8888', email: 'carlos@exemplo.com', active: true },
  ];

  const companyData = {
    name: companySettings.name,
    type: companySettings.type,
    phone: companySettings.phone,
    address: companySettings.address
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <DashboardHeader companyName={companySettings.name} />
        
        <BookingLinkCard companyName={companySettings.name} />

        <StatsCards todayStats={todayStats} />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 bg-white border border-blue-100 shadow-sm gap-1 p-1 h-auto">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-xs sm:text-sm py-2 px-2 sm:px-4 whitespace-nowrap"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger 
              value="calendar" 
              className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-xs sm:text-sm py-2 px-2 sm:px-4 whitespace-nowrap"
            >
              Calendário
            </TabsTrigger>
            <TabsTrigger 
              value="company" 
              className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-xs sm:text-sm py-2 px-2 sm:px-4 whitespace-nowrap"
            >
              Empresa
            </TabsTrigger>
            <TabsTrigger 
              value="services" 
              className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-xs sm:text-sm py-2 px-2 sm:px-4 whitespace-nowrap"
            >
              Serviços
            </TabsTrigger>
            <TabsTrigger 
              value="professionals" 
              className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 text-xs sm:text-sm py-2 px-2 sm:px-4 whitespace-nowrap"
            >
              Profissionais
            </TabsTrigger>
          </TabsList>

          <OverviewTab 
            companyData={companyData}
            professionals={professionals.map(prof => ({
              id: prof.id.toString(),
              name: prof.name,
              specialty: prof.specialty,
              active: prof.active
            }))}
            services={services}
            appointments={appointments}
          />

          <CalendarTab />

          <CompanyTab />

          <ServicesTab services={services} />

          <ProfessionalsTab professionals={professionals} />
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;

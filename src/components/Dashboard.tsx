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
  const { companySettings, generateBookingLink } = useCompany();
  const { toast } = useToast();

  // Dados mockados - em produção viriam do backend
  const bookingLink = generateBookingLink();

  const todayStats = {
    agendamentos: 8,
    receita: 540,
    disponivel: 4,
    cancelados: 1
  };

  const weeklyData = [
    { day: 'Seg', agendamentos: 12, receita: 850, disponivel: 8 },
    { day: 'Ter', agendamentos: 8, receita: 620, disponivel: 12 },
    { day: 'Qua', agendamentos: 15, receita: 1200, disponivel: 5 },
    { day: 'Qui', agendamentos: 10, receita: 750, disponivel: 10 },
    { day: 'Sex', agendamentos: 18, receita: 1400, disponivel: 2 },
    { day: 'Sáb', agendamentos: 22, receita: 1650, disponivel: 3 },
    { day: 'Dom', agendamentos: 5, receita: 380, disponivel: 15 },
  ];

  const nextAppointments = [
    { time: '14:00', client: 'Maria Silva', service: 'Corte + Escova', professional: 'Ana Costa', status: 'confirmado' as const },
    { time: '15:30', client: 'João Santos', service: 'Corte + Barba', professional: 'Carlos Lima', status: 'confirmado' as const },
    { time: '16:00', client: 'Pedro Oliveira', service: 'Barba', professional: 'Carlos Lima', status: 'pendente' as const },
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

  const chartConfig = {
    agendamentos: {
      label: "Agendamentos",
      color: "#3b82f6",
    },
    receita: {
      label: "Receita (R$)",
      color: "#10b981",
    },
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(bookingLink);
      toast({
        title: "Link copiado!",
        description: "O link de agendamento foi copiado para a área de transferência.",
      });
    } catch (error) {
      console.error('Erro ao copiar link:', error);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o link. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleShareLink = () => {
    const message = `Olá! Agende seu horário no ${companySettings.name} através do nosso link: ${bookingLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    // Abre o WhatsApp em uma nova aba
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    toast({
      title: "WhatsApp aberto!",
      description: "O WhatsApp foi aberto com sua mensagem de agendamento.",
    });
  };

  const handleViewBookingPage = () => {
    window.open(bookingLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <DashboardHeader companyName={companySettings.name} />
        
        <BookingLinkCard 
          companyName={companySettings.name}
          bookingLink={bookingLink}
          onCopyLink={handleCopyLink}
          onShareLink={handleShareLink}
          onViewBookingPage={handleViewBookingPage}
        />

        <StatsCards todayStats={todayStats} />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 bg-white border border-blue-100 shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">Visão Geral</TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">Calendário</TabsTrigger>
            <TabsTrigger value="company" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">Empresa</TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">Serviços</TabsTrigger>
            <TabsTrigger value="professionals" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">Profissionais</TabsTrigger>
          </TabsList>

          <OverviewTab 
            nextAppointments={nextAppointments}
            weeklyData={weeklyData}
            chartConfig={chartConfig}
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

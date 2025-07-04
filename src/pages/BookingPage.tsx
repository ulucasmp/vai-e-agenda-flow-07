
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BookingHeader from '@/components/booking/BookingHeader';
import CompanyInfoCards from '@/components/booking/CompanyInfoCards';
import BookingForm from '@/components/booking/BookingForm';

interface Empresa {
  id: string;
  nome_negocio: string;
  tipo: string;
  telefone: string | null;
  endereco: string | null;
  slug: string;
}

interface Professional {
  id: string;
  name: string;
  specialty: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

const BookingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!slug) return;

      try {
        // Buscar empresa pelo slug
        const { data: empresaData, error: empresaError } = await supabase
          .from('empresas')
          .select('*')
          .eq('slug', slug)
          .single();

        if (empresaError || !empresaData) {
          toast({
            title: "Empresa não encontrada",
            description: "Esta página de agendamento não existe.",
            variant: "destructive",
          });
          return;
        }

        setEmpresa(empresaData);

        // Buscar profissionais da empresa
        const { data: profissionaisData } = await supabase
          .from('profissionais')
          .select('*')
          .eq('empresa_id', empresaData.id)
          .eq('ativo', true);

        if (profissionaisData) {
          setProfessionals(profissionaisData.map(prof => ({
            id: prof.id,
            name: prof.nome,
            specialty: prof.especialidade
          })));
        }

        // Buscar serviços da empresa
        const { data: servicosData } = await supabase
          .from('servicos')
          .select('*')
          .eq('empresa_id', empresaData.id)
          .eq('ativo', true);

        if (servicosData) {
          setServices(servicosData.map(servico => ({
            id: servico.id,
            name: servico.nome,
            price: Number(servico.preco),
            duration: servico.duracao_em_minutos
          })));
        }

      } catch (error) {
        console.error('Erro ao carregar dados da empresa:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro ao carregar as informações da empresa.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [slug, toast]);

  // Horários disponíveis padrão (pode ser personalizado futuramente)
  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando informações...</p>
        </div>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Empresa não encontrada</h1>
          <p className="text-gray-600">Esta página de agendamento não existe ou foi desativada.</p>
        </div>
      </div>
    );
  }

  const companySettings = {
    name: empresa.nome_negocio,
    type: empresa.tipo,
    phone: empresa.telefone || '',
    address: empresa.endereco || '',
    logo: '',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <BookingHeader companySettings={companySettings} />
        
        <CompanyInfoCards companySettings={companySettings} />

        <BookingForm 
          empresa={empresa}
          services={services}
          professionals={professionals}
          availableTimes={availableTimes}
        />
      </div>
    </div>
  );
};

export default BookingPage;

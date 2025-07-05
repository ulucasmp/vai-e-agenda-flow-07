
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!slug) {
        console.error('BookingPage: Slug não fornecido');
        setError('Slug da empresa não encontrado na URL');
        setLoading(false);
        return;
      }

      console.log('BookingPage: Buscando empresa com slug:', slug);

      try {
        // Buscar empresa pelo slug
        const { data: empresaData, error: empresaError } = await supabase
          .from('empresas')
          .select('id, nome_negocio, tipo, telefone, endereco, slug')
          .eq('slug', slug)
          .single();

        console.log('BookingPage: Resultado da busca da empresa:', { empresaData, empresaError });

        if (empresaError) {
          console.error('BookingPage: Erro ao buscar empresa:', empresaError);
          if (empresaError.code === 'PGRST116') {
            setError('Empresa não encontrada');
            toast({
              title: "Empresa não encontrada",
              description: "Esta página de agendamento não existe ou foi desativada.",
              variant: "destructive",
            });
          } else {
            setError('Erro ao carregar dados da empresa');
            toast({
              title: "Erro ao carregar dados",
              description: "Ocorreu um erro ao carregar as informações da empresa.",
              variant: "destructive",
            });
          }
          setLoading(false);
          return;
        }

        if (!empresaData) {
          console.error('BookingPage: Empresa não encontrada para o slug:', slug);
          setError('Empresa não encontrada');
          toast({
            title: "Empresa não encontrada",
            description: "Esta página de agendamento não existe.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        console.log('BookingPage: Empresa encontrada:', empresaData);
        setEmpresa(empresaData);

        // Buscar profissionais da empresa
        const { data: profissionaisData, error: profissionaisError } = await supabase
          .from('profissionais')
          .select('id, nome, especialidade')
          .eq('empresa_id', empresaData.id)
          .eq('ativo', true);

        console.log('BookingPage: Profissionais encontrados:', { profissionaisData, profissionaisError });

        if (profissionaisData && !profissionaisError) {
          setProfessionals(profissionaisData.map(prof => ({
            id: prof.id,
            name: prof.nome,
            specialty: prof.especialidade
          })));
        } else if (profissionaisError) {
          console.error('BookingPage: Erro ao buscar profissionais:', profissionaisError);
        }

        // Buscar serviços da empresa
        const { data: servicosData, error: servicosError } = await supabase
          .from('servicos')
          .select('id, nome, preco, duracao_em_minutos')
          .eq('empresa_id', empresaData.id)
          .eq('ativo', true);

        console.log('BookingPage: Serviços encontrados:', { servicosData, servicosError });

        if (servicosData && !servicosError) {
          setServices(servicosData.map(servico => ({
            id: servico.id,
            name: servico.nome,
            price: Number(servico.preco),
            duration: servico.duracao_em_minutos
          })));
        } else if (servicosError) {
          console.error('BookingPage: Erro ao buscar serviços:', servicosError);
        }

      } catch (error) {
        console.error('BookingPage: Erro geral ao carregar dados:', error);
        setError('Erro inesperado ao carregar dados');
        toast({
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro inesperado ao carregar as informações da empresa.",
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
          <p className="text-sm text-gray-500 mt-2">Buscando empresa: {slug}</p>
        </div>
      </div>
    );
  }

  if (error || !empresa) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Empresa não encontrada</h1>
          <p className="text-gray-600 mb-4">
            {error || 'Esta página de agendamento não existe ou foi desativada.'}
          </p>
          <div className="bg-gray-100 p-3 rounded-lg mb-4">
            <p className="text-sm text-gray-600">
              <strong>Slug buscado:</strong> {slug}
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Tentar novamente
          </button>
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
    businessPhoto: null,
    workingHours: {
      segunda: { active: true, start: '08:00', end: '18:00' },
      terca: { active: true, start: '08:00', end: '18:00' },
      quarta: { active: true, start: '08:00', end: '18:00' },
      quinta: { active: true, start: '08:00', end: '18:00' },
      sexta: { active: true, start: '08:00', end: '18:00' },
      sabado: { active: true, start: '08:00', end: '18:00' },
      domingo: { active: false, start: '08:00', end: '18:00' }
    }
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


import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Phone, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ServiceSelector from './ServiceSelector';
import ProfessionalSelector from './ProfessionalSelector';
import DateTimeSelector from './DateTimeSelector';
import ClientInfoForm from './ClientInfoForm';

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

interface Empresa {
  id: string;
  nome_negocio: string;
  tipo: string;
  telefone: string | null;
  endereco: string | null;
  slug: string;
}

interface BookingFormProps {
  empresa: Empresa;
  services: Service[];
  professionals: Professional[];
  availableTimes: string[];
}

const BookingForm = ({ empresa, services, professionals, availableTimes }: BookingFormProps) => {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService || !selectedProfessional || !selectedDate || !selectedTime || !clientName || !clientPhone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const agendamentoData = {
        empresa_id: empresa.id,
        profissional_id: selectedProfessional,
        servico_id: selectedService,
        cliente_nome: clientName,
        cliente_telefone: clientPhone,
        cliente_email: clientEmail || null,
        data_agendamento: selectedDate.toISOString().split('T')[0],
        horario: selectedTime,
        status: 'confirmado'
      };

      const { error } = await supabase
        .from('agendamentos')
        .insert([agendamentoData]);

      if (error) {
        throw error;
      }

      toast({
        title: "Agendamento confirmado!",
        description: `Seu agendamento foi marcado para ${selectedDate.toLocaleDateString('pt-BR')} às ${selectedTime}.`,
      });

      // Limpar formulário
      setSelectedService('');
      setSelectedProfessional('');
      setSelectedDate(undefined);
      setSelectedTime('');
      setClientName('');
      setClientPhone('');
      setClientEmail('');

    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      toast({
        title: "Erro ao agendar",
        description: "Ocorreu um erro ao confirmar seu agendamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedServiceData = services.find(s => s.id === selectedService);
  const selectedProfessionalData = professionals.find(p => p.id === selectedProfessional);

  return (
    <Card className="border-blue-100 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardTitle className="text-xl text-gray-900 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          Agende seu Horário
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seletor de Serviços */}
          {services.length > 0 ? (
            <ServiceSelector
              services={services}
              selectedService={selectedService}
              onServiceSelect={setSelectedService}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Esta empresa ainda não cadastrou serviços disponíveis.</p>
            </div>
          )}

          {/* Seletor de Profissionais */}
          {professionals.length > 0 && selectedService && (
            <ProfessionalSelector
              professionals={professionals}
              selectedProfessional={selectedProfessional}
              onProfessionalSelect={setSelectedProfessional}
            />
          )}

          {/* Seletor de Data e Horário */}
          {selectedService && selectedProfessional && (
            <DateTimeSelector
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              availableTimes={availableTimes}
              onDateSelect={setSelectedDate}
              onTimeSelect={setSelectedTime}
            />
          )}

          {/* Informações do Cliente */}
          {selectedService && selectedProfessional && selectedDate && selectedTime && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <User className="w-5 h-5 inline mr-2" />
                Suas Informações
              </h3>
              <ClientInfoForm
                clientName={clientName}
                clientPhone={clientPhone}
                onNameChange={setClientName}
                onPhoneChange={setClientPhone}
              />
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail (opcional)
                </label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="seu@email.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Resumo do Agendamento */}
          {selectedService && selectedProfessional && selectedDate && selectedTime && clientName && clientPhone && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3">Resumo do Agendamento:</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Serviço:</strong> {selectedServiceData?.name} - R$ {selectedServiceData?.price}</p>
                <p><strong>Profissional:</strong> {selectedProfessionalData?.name} ({selectedProfessionalData?.specialty})</p>
                <p><strong>Data:</strong> {selectedDate.toLocaleDateString('pt-BR')}</p>
                <p><strong>Horário:</strong> {selectedTime}</p>
                <p><strong>Duração:</strong> {selectedServiceData?.duration} minutos</p>
                <p><strong>Cliente:</strong> {clientName}</p>
                <p><strong>Telefone:</strong> {clientPhone}</p>
              </div>
            </div>
          )}

          {/* Botão de Confirmar */}
          {selectedService && selectedProfessional && selectedDate && selectedTime && clientName && clientPhone && (
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Confirmando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirmar Agendamento
                </>
              )}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;

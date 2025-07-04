
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ServiceSelector from './ServiceSelector';
import ProfessionalSelector from './ProfessionalSelector';
import DateTimeSelector from './DateTimeSelector';
import ClientInfoForm from './ClientInfoForm';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface Professional {
  id: string;
  name: string;
  specialty: string;
}

interface BookingFormProps {
  services: Service[];
  professionals: Professional[];
  availableTimes: string[];
}

const BookingForm = ({ services, professionals, availableTimes }: BookingFormProps) => {
  const { toast } = useToast();
  
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedProfessional, setSelectedProfessional] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [isBooking, setIsBooking] = useState<boolean>(false);

  const handleBooking = async () => {
    if (!selectedService || !selectedProfessional || !selectedDate || !selectedTime || !clientName || !clientPhone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos para continuar.",
        variant: "destructive"
      });
      return;
    }

    setIsBooking(true);

    try {
      const selectedServiceData = services.find(s => s.id === selectedService);
      const selectedProfessionalData = professionals.find(p => p.id === selectedProfessional);
      
      // Simular processamento do agendamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Criar objeto do agendamento
      const bookingData = {
        id: Date.now().toString(),
        service: selectedServiceData?.name,
        price: selectedServiceData?.price,
        duration: selectedServiceData?.duration,
        professional: selectedProfessionalData?.name,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        clientName,
        clientPhone,
        status: 'confirmado',
        createdAt: new Date().toISOString()
      };

      // Salvar no localStorage para demonstração
      const existingBookings = JSON.parse(localStorage.getItem('companyBookings') || '[]');
      existingBookings.push(bookingData);
      localStorage.setItem('companyBookings', JSON.stringify(existingBookings));

      toast({
        title: "Agendamento confirmado!",
        description: `Seu horário foi agendado com ${selectedProfessionalData?.name} para ${format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })} às ${selectedTime}.`,
      });

      // Limpar formulário
      setSelectedService('');
      setSelectedProfessional('');
      setSelectedDate(undefined);
      setSelectedTime('');
      setClientName('');
      setClientPhone('');

    } catch (error) {
      console.error('Erro ao processar agendamento:', error);
      toast({
        title: "Erro ao agendar",
        description: "Houve um problema ao processar seu agendamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Card className="mt-8 border-blue-100 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Calendar className="w-6 h-6 text-blue-500" />
          Agendar Horário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ClientInfoForm
          clientName={clientName}
          clientPhone={clientPhone}
          onNameChange={setClientName}
          onPhoneChange={setClientPhone}
        />

        <ServiceSelector
          services={services}
          selectedService={selectedService}
          onServiceSelect={setSelectedService}
        />

        <ProfessionalSelector
          professionals={professionals}
          selectedProfessional={selectedProfessional}
          onProfessionalSelect={setSelectedProfessional}
        />

        <DateTimeSelector
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          availableTimes={availableTimes}
          onDateSelect={setSelectedDate}
          onTimeSelect={setSelectedTime}
        />

        {/* Botão de agendamento */}
        <div className="pt-4">
          <Button 
            onClick={handleBooking}
            disabled={isBooking}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 text-lg disabled:opacity-50"
            size="lg"
          >
            <Calendar className="w-5 h-5 mr-2" />
            {isBooking ? 'Processando...' : 'Confirmar Agendamento'}
          </Button>
          <p className="text-sm text-gray-500 text-center mt-2">
            Seu agendamento será confirmado automaticamente
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingForm;

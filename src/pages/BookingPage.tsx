
import { useParams } from 'react-router-dom';
import { useCompany } from '@/contexts/CompanyContext';
import BookingHeader from '@/components/booking/BookingHeader';
import CompanyInfoCards from '@/components/booking/CompanyInfoCards';
import BookingForm from '@/components/booking/BookingForm';

const BookingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { companySettings } = useCompany();

  // Profissionais de exemplo
  const professionals = [
    { id: '1', name: 'Ana Costa', specialty: 'Cabeleireira' },
    { id: '2', name: 'Carlos Lima', specialty: 'Barbeiro' },
    { id: '3', name: 'Maria Silva', specialty: 'Manicure' },
  ];

  // Serviços de exemplo
  const services = [
    { id: '1', name: 'Corte Masculino', price: 35, duration: 30 },
    { id: '2', name: 'Corte + Barba', price: 50, duration: 45 },
    { id: '3', name: 'Escova Progressiva', price: 120, duration: 180 },
    { id: '4', name: 'Coloração', price: 80, duration: 120 },
  ];

  // Horários disponíveis de exemplo
  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <BookingHeader companySettings={companySettings} />
        
        <CompanyInfoCards companySettings={companySettings} />

        <BookingForm 
          services={services}
          professionals={professionals}
          availableTimes={availableTimes}
        />
      </div>
    </div>
  );
};

export default BookingPage;

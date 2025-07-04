
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock } from 'lucide-react';
import { CompanySettings } from '@/contexts/CompanyContext';

interface CompanyInfoCardsProps {
  companySettings: CompanySettings;
}

const CompanyInfoCards = ({ companySettings }: CompanyInfoCardsProps) => {
  return (
    <>
      {/* Foto do negócio */}
      {companySettings.businessPhoto && (
        <div className="mb-8">
          <img 
            src={companySettings.businessPhoto} 
            alt="Foto do negócio" 
            className="w-full h-64 object-cover rounded-xl shadow-lg"
          />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Informações da empresa */}
        <Card className="border-blue-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              Informações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{companySettings.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{companySettings.phone}</span>
            </div>
          </CardContent>
        </Card>

        {/* Horário de funcionamento */}
        <Card className="border-blue-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Horário de Funcionamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(companySettings.workingHours).map(([day, hours]) => {
                const dayNames: { [key: string]: string } = {
                  segunda: 'Segunda-feira',
                  terca: 'Terça-feira',
                  quarta: 'Quarta-feira',
                  quinta: 'Quinta-feira',
                  sexta: 'Sexta-feira',
                  sabado: 'Sábado',
                  domingo: 'Domingo'
                };
                
                // Type assertion to ensure hours has the correct type
                const workingHour = hours as { active: boolean; start: string; end: string };
                
                return (
                  <div key={day} className="flex justify-between items-center py-1">
                    <span className="text-gray-700 font-medium">
                      {dayNames[day]}
                    </span>
                    <span className="text-gray-600">
                      {workingHour.active ? `${workingHour.start} - ${workingHour.end}` : 'Fechado'}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CompanyInfoCards;

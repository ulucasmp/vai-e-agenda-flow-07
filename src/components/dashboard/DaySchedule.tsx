
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DayAppointment {
  time: string;
  client: string;
  service: string;
  professional: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
  price: number;
}

interface DayScheduleProps {
  selectedDate: Date;
  onClose?: () => void;
}

const DaySchedule = ({ selectedDate, onClose }: DayScheduleProps) => {
  // Dados mockados de agendamentos do dia (em produção viria do backend)
  const dayAppointments: DayAppointment[] = [
    { time: '09:00', client: 'Maria Silva', service: 'Corte + Escova', professional: 'Ana Costa', status: 'confirmado', price: 65 },
    { time: '10:30', client: 'João Santos', service: 'Corte + Barba', professional: 'Carlos Lima', status: 'confirmado', price: 50 },
    { time: '11:00', client: 'Pedro Oliveira', service: 'Barba', professional: 'Carlos Lima', status: 'pendente', price: 25 },
    { time: '14:00', client: 'Ana Paula', service: 'Coloração', professional: 'Ana Costa', status: 'confirmado', price: 80 },
    { time: '15:30', client: 'Roberto Silva', service: 'Corte Masculino', professional: 'Carlos Lima', status: 'confirmado', price: 35 },
    { time: '16:00', client: 'Lucia Santos', service: 'Escova Progressiva', professional: 'Ana Costa', status: 'pendente', price: 120 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelado':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-500';
      case 'pendente':
        return 'bg-yellow-500';
      case 'cancelado':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const totalRevenue = dayAppointments
    .filter(apt => apt.status === 'confirmado')
    .reduce((sum, apt) => sum + apt.price, 0);

  return (
    <Card className="border-blue-100 shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-gray-900">
            Agenda - {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </CardTitle>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          )}
        </div>
        <div className="flex gap-4 text-sm">
          <span className="text-blue-600 font-medium">
            {dayAppointments.length} agendamentos
          </span>
          <span className="text-green-600 font-medium">
            R$ {totalRevenue} de receita
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {dayAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum agendamento para este dia</p>
            </div>
          ) : (
            dayAppointments.map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {appointment.time}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{appointment.client}</p>
                    <p className="text-sm text-gray-600">{appointment.service}</p>
                    <p className="text-xs text-gray-500">com {appointment.professional}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600">
                    R$ {appointment.price}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusDot(appointment.status)}`}></div>
                    <Badge className={`text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DaySchedule;

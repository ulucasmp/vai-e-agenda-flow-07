
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
  // Para empresas novas, não há agendamentos - lista vazia
  const dayAppointments: DayAppointment[] = [];

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
            <div className="text-center py-12 text-gray-500">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum agendamento para este dia</h3>
              <p className="text-sm text-gray-500">
                Quando seus clientes agendarem pelo seu link, os agendamentos aparecerão aqui.
              </p>
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
                    <div className={`w-2 h-2 rounded-full ${
                      appointment.status === 'confirmado' ? 'bg-green-500' :
                      appointment.status === 'pendente' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <Badge className={`text-xs font-medium border ${
                      appointment.status === 'confirmado' ? 'bg-green-100 text-green-700 border-green-200' :
                      appointment.status === 'pendente' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                      'bg-red-100 text-red-700 border-red-200'
                    }`}>
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


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Appointment {
  time: string;
  client: string;
  service: string;
  professional: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
}

interface AppointmentsListProps {
  appointments: Appointment[];
}

const AppointmentsList = ({ appointments }: AppointmentsListProps) => {
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

  return (
    <Card className="mb-8 border-blue-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900">Próximos Agendamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                    {appointment.time}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{appointment.client}</p>
                  <p className="text-sm text-gray-600">{appointment.service}</p>
                  <p className="text-xs text-gray-500">com {appointment.professional}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusDot(appointment.status)}`}></div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentsList;

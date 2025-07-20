
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Appointment {
  id: string;
  data_agendamento: string;
  horario: string;
  cliente_nome: string;
  servico_nome?: string;
  profissional_nome?: string;
  status: string;
}

interface AppointmentsListProps {
  empresaId?: string;
}

const AppointmentsList = ({ empresaId }: AppointmentsListProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!empresaId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('agendamentos')
          .select(`
            id,
            data_agendamento,
            horario,
            cliente_nome,
            status,
            servicos:servico_id(nome),
            profissionais:profissional_id(nome)
          `)
          .eq('empresa_id', empresaId)
          .gte('data_agendamento', new Date().toISOString().split('T')[0])
          .order('data_agendamento', { ascending: true })
          .order('horario', { ascending: true })
          .limit(10);

        if (error) {
          console.error('Erro ao buscar agendamentos:', error);
        } else {
          const formattedAppointments = data?.map(appointment => ({
            id: appointment.id,
            data_agendamento: appointment.data_agendamento,
            horario: appointment.horario,
            cliente_nome: appointment.cliente_nome,
            servico_nome: appointment.servicos?.nome || 'Serviço não informado',
            profissional_nome: appointment.profissionais?.nome || 'Profissional não informado',
            status: appointment.status || 'pendente'
          })) || [];
          
          setAppointments(formattedAppointments);
        }
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [empresaId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmado':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'agendado - pendente de confirmação':
      case 'pendente':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelado':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'reagendado':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatAppointmentInfo = (appointment: Appointment) => {
    try {
      const date = new Date(appointment.data_agendamento + 'T00:00:00');
      const dayOfWeek = format(date, 'eee', { locale: ptBR }).substring(0, 3);
      const formattedDate = format(date, 'dd/MM/yyyy', { locale: ptBR });
      const time = appointment.horario.substring(0, 5); // Remove segundos se houver
      
      return {
        dayOfWeek: dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1),
        formattedDate,
        time
      };
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return {
        dayOfWeek: '---',
        formattedDate: '00/00/0000',
        time: '00:00'
      };
    }
  };

  const formatStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'agendado - pendente de confirmação':
        return 'Pendente';
      case 'confirmado':
        return 'Confirmado';
      case 'cancelado':
        return 'Cancelado';
      case 'reagendado':
        return 'Reagendado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Card className="mb-8 border-blue-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">Próximos Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 border-blue-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900">Próximos Agendamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum agendamento próximo encontrado.</p>
            </div>
          ) : (
            appointments.map((appointment) => {
              const { dayOfWeek, formattedDate, time } = formatAppointmentInfo(appointment);
              
              return (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg">🕗</span>
                      <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                        {time} ({dayOfWeek}, {formattedDate})
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      – {appointment.profissional_nome} – {appointment.servico_nome}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(appointment.status)}`}>
                      {formatStatus(appointment.status)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentsList;

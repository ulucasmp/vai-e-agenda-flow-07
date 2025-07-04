
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import AppointmentsList from './AppointmentsList';
import WeeklyCharts from './WeeklyCharts';
import WeeklySummary from './WeeklySummary';
import DaySchedule from './DaySchedule';

interface WeeklyData {
  day: string;
  agendamentos: number;
  receita: number;
  disponivel: number;
}

interface Appointment {
  time: string;
  client: string;
  service: string;
  professional: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
}

interface OverviewTabProps {
  nextAppointments: Appointment[];
  weeklyData: WeeklyData[];
  chartConfig: any;
}

const OverviewTab = ({ nextAppointments, weeklyData, chartConfig }: OverviewTabProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDayClick = (dayIndex: number) => {
    console.log(`Dia clicado: ${dayIndex}`);
    // Criar uma data baseada no índice do dia da semana
    const today = new Date();
    const currentDay = today.getDay();
    const diff = dayIndex - currentDay;
    const selectedDay = new Date(today);
    selectedDay.setDate(today.getDate() + diff);
    setSelectedDate(selectedDay);
  };

  const closeDaySchedule = () => {
    console.log('Fechando modal de agendamentos');
    setSelectedDate(null);
  };

  return (
    <TabsContent value="overview" className="space-y-6">
      <AppointmentsList appointments={nextAppointments} />
      
      <WeeklyCharts weeklyData={weeklyData} chartConfig={chartConfig} />
      
      <WeeklySummary 
        weeklyData={weeklyData} 
        onDayClick={handleDayClick}
      />

      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Agendamentos - {selectedDate.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeDaySchedule}
                className="hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <DaySchedule 
              selectedDate={selectedDate}
              onClose={closeDaySchedule}
            />
          </div>
        </div>
      )}
    </TabsContent>
  );
};

export default OverviewTab;

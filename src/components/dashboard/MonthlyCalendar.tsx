
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAppointments } from '@/hooks/useAppointments';

interface MonthlyCalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

const MonthlyCalendar = ({ onDateSelect, selectedDate }: MonthlyCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(selectedDate);
  const { getAppointmentCountByDate } = useAppointments();

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      onDateSelect(selectedDate);
    }
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getAppointmentCount = (date: Date) => {
    return getAppointmentCountByDate(date);
  };

  return (
    <Card className="border-blue-100 shadow-sm h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-gray-900 flex items-center justify-between">
          <span>Calendário Mensal</span>
          {selectedDate && (
            <span className="text-sm font-normal text-blue-600">
              {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="w-full overflow-x-auto">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="w-full mx-auto pointer-events-auto"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
              month: "space-y-4 w-full",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-gray-200 rounded-md hover:bg-blue-50"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex w-full",
              head_cell: "text-gray-500 rounded-md w-full font-normal text-[0.8rem] flex-1 flex items-center justify-center h-8",
              row: "flex w-full mt-2",
              cell: "relative h-12 w-full text-center text-sm p-0 flex-1 [&:has([aria-selected])]:bg-blue-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: cn(
                "h-12 w-full p-0 font-normal aria-selected:opacity-100 flex items-center justify-center relative rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
              ),
              day_selected: "bg-blue-500 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
              day_today: "bg-blue-100 text-blue-700 font-semibold",
              day_outside: "text-gray-400 opacity-50 aria-selected:bg-blue-50 aria-selected:text-gray-400 aria-selected:opacity-30",
              day_disabled: "text-gray-300 opacity-50",
              day_range_middle: "aria-selected:bg-blue-50 aria-selected:text-blue-700",
              day_hidden: "invisible",
            }}
            components={{
              Day: ({ date: currentDate, ...props }) => {
                const appointmentCount = getAppointmentCount(currentDate);
                const isToday = currentDate.toDateString() === new Date().toDateString();
                const isSelected = selectedDate && currentDate.toDateString() === selectedDate.toDateString();
                
                return (
                  <div 
                    {...props}
                    className={cn(
                      "relative h-12 w-full p-1 text-center cursor-pointer hover:bg-blue-50 rounded-md transition-colors flex flex-col items-center justify-center",
                      isToday && "bg-blue-100 font-semibold text-blue-700",
                      isSelected && "bg-blue-500 text-white hover:bg-blue-600"
                    )}
                    onClick={() => handleDateSelect(currentDate)}
                  >
                    <span className="text-sm">{currentDate.getDate()}</span>
                    {appointmentCount > 0 && (
                      <Badge 
                        variant="secondary" 
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center min-w-[16px]"
                      >
                        {appointmentCount}
                      </Badge>
                    )}
                  </div>
                );
              },
            }}
          />
        </div>
        
        <div className="mt-4 text-xs sm:text-sm text-gray-600 space-y-1">
          <p>• Clique em uma data para ver os agendamentos do dia</p>
          <p>• Os números vermelhos indicam a quantidade de agendamentos</p>
          <p>• Azul claro = hoje | Azul escuro = data selecionada</p>
          <p>• Visualize seus agendamentos conforme eles chegam!</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyCalendar;

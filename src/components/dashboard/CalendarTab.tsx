
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import MonthlyCalendar from './MonthlyCalendar';
import DaySchedule from './DaySchedule';

const CalendarTab = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const closeDaySchedule = () => {
    setSelectedDate(null);
  };

  return (
    <TabsContent value="calendar" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyCalendar 
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate || undefined}
        />
        
        {selectedDate && (
          <DaySchedule 
            selectedDate={selectedDate}
            onClose={closeDaySchedule}
          />
        )}
      </div>
    </TabsContent>
  );
};

export default CalendarTab;

export interface WorkingHour {
  active: boolean;
  start: string;
  end: string;
}

export interface WorkingHours {
  [key: string]: WorkingHour;
}

// Mapear dias da semana em português para números (0 = domingo)
const dayMapping: { [key: string]: number } = {
  'domingo': 0,
  'segunda': 1,
  'terca': 2,
  'quarta': 3,
  'quinta': 4,
  'sexta': 5,
  'sabado': 6
};

// Gerar horários disponíveis baseados nos horários de funcionamento
export const generateAvailableTimes = (workingHours: WorkingHours, selectedDate: Date): string[] => {
  // Obter o dia da semana da data selecionada
  const dayOfWeek = selectedDate.getDay();
  
  // Encontrar o dia correspondente nos horários de funcionamento
  const dayKey = Object.keys(dayMapping).find(key => dayMapping[key] === dayOfWeek);
  
  if (!dayKey || !workingHours[dayKey] || !workingHours[dayKey].active) {
    return []; // Dia fechado
  }
  
  const dayHours = workingHours[dayKey];
  const times: string[] = [];
  
  // Converter horários de início e fim para minutos
  const [startHour, startMinute] = dayHours.start.split(':').map(Number);
  const [endHour, endMinute] = dayHours.end.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  // Gerar horários de 30 em 30 minutos
  for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    times.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
  }
  
  return times;
};

// Verificar se um horário está dentro do funcionamento
export const isTimeWithinBusinessHours = (workingHours: WorkingHours, date: Date, time: string): boolean => {
  const availableTimes = generateAvailableTimes(workingHours, date);
  return availableTimes.includes(time);
};
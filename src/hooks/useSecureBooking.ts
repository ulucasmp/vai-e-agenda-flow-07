
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { bookingSchema, validateBusinessHours } from '@/utils/validation';

interface BookingData {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  selectedService: string;
  selectedProfessional: string | null;
  selectedDate: Date;
  selectedTime: string;
  empresaId: string;
}

export const useSecureBooking = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitCount, setRateLimitCount] = useState(0);
  const [lastBookingTime, setLastBookingTime] = useState<number>(0);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const timeSinceLastBooking = now - lastBookingTime;
    
    // Reset counter if more than 10 minutes have passed
    if (timeSinceLastBooking > 10 * 60 * 1000) {
      setRateLimitCount(0);
    }
    
    // Allow maximum 3 bookings per 10 minutes
    if (rateLimitCount >= 3 && timeSinceLastBooking < 10 * 60 * 1000) {
      return false;
    }
    
    return true;
  };

  const createBooking = async (bookingData: BookingData) => {
    if (!checkRateLimit()) {
      toast({
        title: "Muitas tentativas",
        description: "Aguarde alguns minutos antes de tentar novamente.",
        variant: "destructive",
      });
      return { success: false };
    }

    setIsLoading(true);

    try {
      // Validate input data
      const validatedData = bookingSchema.parse({
        clientName: bookingData.clientName,
        clientPhone: bookingData.clientPhone,
        clientEmail: bookingData.clientEmail || undefined,
        selectedService: bookingData.selectedService,
        selectedProfessional: bookingData.selectedProfessional,
        selectedDate: bookingData.selectedDate,
        selectedTime: bookingData.selectedTime
      });

      // Validate business hours
      if (!validateBusinessHours(validatedData.selectedDate, validatedData.selectedTime)) {
        toast({
          title: "Horário inválido",
          description: "Este horário não está disponível para agendamento.",
          variant: "destructive",
        });
        return { success: false };
      }

      // Check for existing booking conflicts
      let conflictQuery = supabase
        .from('agendamentos')
        .select('id')
        .eq('empresa_id', bookingData.empresaId)
        .eq('data_agendamento', validatedData.selectedDate.toISOString().split('T')[0])
        .eq('horario', validatedData.selectedTime)
        .eq('status', 'confirmado');

      // Only check professional conflict if a professional was selected
      if (validatedData.selectedProfessional) {
        conflictQuery = conflictQuery.eq('profissional_id', validatedData.selectedProfessional);
      }

      const { data: existingBookings, error: conflictError } = await conflictQuery;

      if (conflictError) {
        throw new Error('Erro ao verificar conflitos de agendamento');
      }

      if (existingBookings && existingBookings.length > 0) {
        toast({
          title: "Horário indisponível",
          description: "Este horário já foi agendado. Escolha outro horário.",
          variant: "destructive",
        });
        return { success: false };
      }

      // Create the booking
      const agendamentoData = {
        empresa_id: bookingData.empresaId,
        profissional_id: validatedData.selectedProfessional || null,
        servico_id: validatedData.selectedService,
        cliente_nome: validatedData.clientName,
        cliente_telefone: validatedData.clientPhone,
        cliente_email: validatedData.clientEmail || null,
        data_agendamento: validatedData.selectedDate.toISOString().split('T')[0],
        horario: validatedData.selectedTime,
        status: 'confirmado'
      };

      const { error } = await supabase
        .from('agendamentos')
        .insert([agendamentoData]);

      if (error) {
        throw error;
      }

      // Update rate limiting
      setRateLimitCount(prev => prev + 1);
      setLastBookingTime(Date.now());

      toast({
        title: "Agendamento confirmado!",
        description: `Seu agendamento foi marcado para ${validatedData.selectedDate.toLocaleDateString('pt-BR')} às ${validatedData.selectedTime}.`,
      });

      return { success: true };

    } catch (error: any) {
      console.error('Erro ao criar agendamento:', error);
      
      if (error.name === 'ZodError') {
        const firstError = error.errors[0];
        toast({
          title: "Dados inválidos",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao agendar",
          description: "Ocorreu um erro ao confirmar seu agendamento. Tente novamente.",
          variant: "destructive",
        });
      }
      
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBooking,
    isLoading
  };
};

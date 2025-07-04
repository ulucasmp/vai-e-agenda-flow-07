
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEmpresa } from '@/hooks/useEmpresa';

interface Servico {
  id: string;
  empresa_id: string;
  nome: string;
  preco: number;
  duracao: number;
  ativo: boolean;
  created_at: string;
}

export const useServicos = () => {
  const { user } = useAuth();
  const { empresa } = useEmpresa();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Por enquanto, inicializar com array vazio
    // Futuramente, aqui faremos a busca no Supabase
    if (empresa) {
      setServicos([]);
    }
    setLoading(false);
  }, [empresa]);

  const addServico = async (servicoData: Omit<Servico, 'id' | 'created_at'>) => {
    // Simulação - futuramente conectar com Supabase
    const newServico: Servico = {
      ...servicoData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    setServicos(prev => [...prev, newServico]);
    return { data: newServico, error: null };
  };

  const updateServico = async (id: string, updates: Partial<Servico>) => {
    setServicos(prev => 
      prev.map(servico => servico.id === id ? { ...servico, ...updates } : servico)
    );
    return { error: null };
  };

  const deleteServico = async (id: string) => {
    setServicos(prev => prev.filter(servico => servico.id !== id));
    return { error: null };
  };

  return {
    servicos,
    loading,
    addServico,
    updateServico,
    deleteServico,
  };
};

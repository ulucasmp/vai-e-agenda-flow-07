
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { gerarSlug } from '@/utils/slugUtils';
import Logo from '@/components/Logo';

const EmpresaSetup = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [hasEmpresa, setHasEmpresa] = useState(false);
  const [checkingEmpresa, setCheckingEmpresa] = useState(true);

  // Redirect if not authenticated
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user already has a company
  useEffect(() => {
    const checkExistingEmpresa = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('empresas')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (data && !error) {
        setHasEmpresa(true);
      }
      setCheckingEmpresa(false);
    };

    checkExistingEmpresa();
  }, [user]);

  // Redirect to dashboard if already has company
  if (hasEmpresa && !checkingEmpresa) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const nome_negocio = formData.get('nome_negocio') as string;
    const slug = gerarSlug(nome_negocio);
    
    const empresaData = {
      owner_id: user.id,
      nome_negocio,
      tipo: formData.get('tipo') as string,
      telefone: formData.get('telefone') as string || null,
      endereco: formData.get('endereco') as string || null,
      slug,
    };

    const { error } = await supabase
      .from('empresas')
      .insert([empresaData]);

    if (error) {
      toast({
        title: "Erro ao cadastrar empresa",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Empresa cadastrada com sucesso!",
        description: `Sua URL pública é: /agendamento/${slug}`,
      });
      navigate('/dashboard');
    }

    setIsLoading(false);
  };

  if (loading || checkingEmpresa) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Logo size="lg" variant="full" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Cadastre sua empresa
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Preencha os dados da sua empresa para começar
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados da Empresa</CardTitle>
            <CardDescription>
              Estas informações aparecerão para seus clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome_negocio">Nome do Negócio *</Label>
                <Input
                  id="nome_negocio"
                  name="nome_negocio"
                  type="text"
                  required
                  placeholder="Ex: Salão Beleza Total"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="tipo">Tipo de Negócio *</Label>
                <Select name="tipo" required disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salao_beleza">Salão de Beleza</SelectItem>
                    <SelectItem value="barbearia">Barbearia</SelectItem>
                    <SelectItem value="estetica">Clínica de Estética</SelectItem>
                    <SelectItem value="spa">Spa</SelectItem>
                    <SelectItem value="manicure">Manicure/Pedicure</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  name="endereco"
                  type="text"
                  placeholder="Rua, número, bairro, cidade"
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Cadastrando...' : 'Cadastrar Empresa'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmpresaSetup;

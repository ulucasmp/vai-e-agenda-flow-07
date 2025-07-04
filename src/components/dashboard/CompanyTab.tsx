import React, { useState, useEffect } from 'react';
import { ExternalLink, Upload, X, Image } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { useEmpresa } from '@/hooks/useEmpresa';
import { supabase } from '@/integrations/supabase/client';
import { gerarSlug } from '@/utils/slugUtils';

const CompanyTab = () => {
  const { toast } = useToast();
  const { empresa } = useEmpresa();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  });
  
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [businessPhotoPreview, setBusinessPhotoPreview] = useState<string | null>(null);
  const [workingHours, setWorkingHours] = useState({
    segunda: { active: true, start: '08:00', end: '18:00' },
    terca: { active: true, start: '08:00', end: '18:00' },
    quarta: { active: true, start: '08:00', end: '18:00' },
    quinta: { active: true, start: '08:00', end: '18:00' },
    sexta: { active: true, start: '08:00', end: '18:00' },
    sabado: { active: true, start: '08:00', end: '18:00' },
    domingo: { active: false, start: '08:00', end: '18:00' }
  });

  // Carrega os dados da empresa quando o componente monta ou empresa muda
  useEffect(() => {
    if (empresa) {
      setFormData({
        name: empresa.nome_negocio || '',
        address: empresa.endereco || '',
        phone: empresa.telefone || '',
      });
    }
  }, [empresa]);

  const generateBookingLink = (): string => {
    if (!empresa?.slug) return '';
    const currentDomain = window.location.origin;
    return `${currentDomain}/agendamento/${empresa.slug}`;
  };

  const bookingLink = generateBookingLink();

  const daysOfWeek = [
    { key: 'segunda', label: 'Segunda-feira' },
    { key: 'terca', label: 'Terça-feira' },
    { key: 'quarta', label: 'Quarta-feira' },
    { key: 'quinta', label: 'Quinta-feira' },
    { key: 'sexta', label: 'Sexta-feira' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'photo') => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 5MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'logo') {
          setLogoPreview(result);
        } else {
          setBusinessPhotoPreview(result);
        }
      };
      reader.readAsDataURL(file);

      toast({
        title: "Imagem carregada",
        description: `${type === 'logo' ? 'Logo' : 'Foto do negócio'} carregada com sucesso!`
      });
    }
  };

  const removeImage = (type: 'logo' | 'photo') => {
    if (type === 'logo') {
      setLogoPreview(null);
    } else {
      setBusinessPhotoPreview(null);
    }
    toast({
      title: "Imagem removida",
      description: `${type === 'logo' ? 'Logo' : 'Foto do negócio'} removida com sucesso!`
    });
  };

  const handleWorkingHourChange = (day: string, field: 'active' | 'start' | 'end', value: boolean | string) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSaveChanges = async () => {
    if (!empresa) return;

    try {
      // Gerar novo slug se o nome mudou
      const novoSlug = gerarSlug(formData.name);
      
      const { error } = await supabase
        .from('empresas')
        .update({
          nome_negocio: formData.name,
          endereco: formData.address,
          telefone: formData.phone,
          slug: novoSlug, // Atualizar slug automaticamente
        })
        .eq('id', empresa.id);

      if (error) {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar as alterações. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Alterações salvas",
        description: "As informações da empresa foram salvas com sucesso! O link de agendamento foi atualizado."
      });
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(bookingLink);
      toast({
        title: "Link copiado",
        description: "Link de agendamento copiado para a área de transferência!"
      });
    } catch (error) {
      console.error('Erro ao copiar link:', error);
    }
  };

  const handleViewBookingPage = () => {
    window.open(bookingLink, '_blank', 'noopener,noreferrer');
  };

  if (!empresa) {
    return (
      <TabsContent value="company" className="space-y-6">
        <div className="text-center py-8">
          <p>Carregando dados da empresa...</p>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="company" className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Informações da Empresa */}
        <Card className="border-blue-100 shadow-sm">
          <CardHeader>
            <CardTitle>Informações da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Logo da Empresa */}
            <div>
              <label className="block text-sm font-medium mb-2">Logo da Empresa</label>
              <div className="flex items-center gap-4">
                {logoPreview ? (
                  <div className="relative">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-20 h-20 object-cover rounded-lg border border-blue-100"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                      onClick={() => removeImage('logo')}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-20 h-20 border-2 border-dashed border-blue-200 rounded-lg flex items-center justify-center">
                    <Image className="w-8 h-8 text-blue-300" />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'logo')}
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border border-blue-200 rounded-lg text-sm hover:bg-blue-50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    {logoPreview ? 'Alterar Logo' : 'Carregar Logo'}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG até 5MB</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nome da Empresa</label>
              <input 
                type="text" 
                className="w-full p-3 border border-blue-100 rounded-lg focus:border-blue-300 focus:ring-2 focus:ring-blue-100" 
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Endereço</label>
              <input 
                type="text" 
                className="w-full p-3 border border-blue-100 rounded-lg focus:border-blue-300 focus:ring-2 focus:ring-blue-100" 
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Telefone</label>
              <input 
                type="text" 
                className="w-full p-3 border border-blue-100 rounded-lg focus:border-blue-300 focus:ring-2 focus:ring-blue-100" 
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>

            {/* Horário de Funcionamento */}
            <div>
              <label className="block text-sm font-medium mb-3">Horário de Funcionamento</label>
              <div className="space-y-3 bg-blue-50 p-4 rounded-lg border border-blue-100">
                {daysOfWeek.map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={workingHours[key as keyof typeof workingHours].active}
                        onCheckedChange={(checked) => 
                          handleWorkingHourChange(key, 'active', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor={key} 
                        className="text-sm font-medium min-w-[100px]"
                      >
                        {label}
                      </label>
                    </div>
                    
                    {workingHours[key as keyof typeof workingHours].active && (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={workingHours[key as keyof typeof workingHours].start}
                          onChange={(e) => handleWorkingHourChange(key, 'start', e.target.value)}
                          className="px-2 py-1 border border-blue-200 rounded text-sm focus:border-blue-300 focus:ring-1 focus:ring-blue-100"
                        />
                        <span className="text-sm text-gray-500">às</span>
                        <input
                          type="time"
                          value={workingHours[key as keyof typeof workingHours].end}
                          onChange={(e) => handleWorkingHourChange(key, 'end', e.target.value)}
                          className="px-2 py-1 border border-blue-200 rounded text-sm focus:border-blue-300 focus:ring-1 focus:ring-blue-100"
                        />
                      </div>
                    )}
                    
                    {!workingHours[key as keyof typeof workingHours].active && (
                      <span className="text-sm text-gray-500">Fechado</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Foto do Negócio */}
            <div>
              <label className="block text-sm font-medium mb-2">Foto do Negócio (Opcional)</label>
              <div className="space-y-3">
                {businessPhotoPreview && (
                  <div className="relative">
                    <img 
                      src={businessPhotoPreview} 
                      alt="Foto do negócio" 
                      className="w-full h-32 object-cover rounded-lg border border-blue-100"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 w-8 h-8 rounded-full p-0"
                      onClick={() => removeImage('photo')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    id="business-photo-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'photo')}
                  />
                  <label
                    htmlFor="business-photo-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border border-blue-200 rounded-lg text-sm hover:bg-blue-50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    {businessPhotoPreview ? 'Alterar Foto' : 'Carregar Foto do Negócio'}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG até 5MB - Esta foto será exibida na sua página de agendamento</p>
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              onClick={handleSaveChanges}
            >
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Link de Agendamento */}
        <Card className="border-blue-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Link de Agendamento
              <ExternalLink className="w-5 h-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
              <p className="text-sm text-gray-600 mb-2">Seu link personalizado:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white p-2 rounded border text-sm text-blue-600 break-all">
                  {bookingLink}
                </code>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={handleCopyLink}
                >
                  Copiar
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Compartilhe este link com seus clientes para que eles possam agendar diretamente. 
              O link é automaticamente atualizado quando você muda o nome da empresa.
            </p>
            <div className="space-y-2">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleViewBookingPage}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visualizar Página de Agendamento
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default CompanyTab;

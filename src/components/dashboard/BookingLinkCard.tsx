
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BookingLinkCardProps {
  companyName: string;
}

const BookingLinkCard = ({ companyName }: BookingLinkCardProps) => {
  const { toast } = useToast();
  
  // Generate a slug from company name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const companySlug = generateSlug(companyName);
  const bookingLink = `${window.location.origin}/agendamento/${companySlug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(bookingLink);
      toast({
        title: "Link copiado!",
        description: "O link de agendamento foi copiado para a área de transferência.",
      });
    } catch (error) {
      console.error('Erro ao copiar link:', error);
      toast({
        title: "Erro ao copiar link",
        description: "Não foi possível copiar o link. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleViewPage = () => {
    window.open(bookingLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="border-blue-100 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ExternalLink className="w-5 h-5 text-blue-500" />
          Link de Agendamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <p className="text-sm text-gray-600 mb-2">Seu link personalizado:</p>
          <code className="text-sm text-blue-600 bg-white p-2 rounded border block break-all">
            {bookingLink}
          </code>
        </div>
        
        <p className="text-sm text-gray-600">
          Compartilhe este link com seus clientes para que eles possam agendar seus serviços online.
        </p>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleCopyLink}
            className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copiar Link
          </Button>
          <Button 
            onClick={handleViewPage}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Visualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingLinkCard;

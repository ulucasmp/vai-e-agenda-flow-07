
import React from 'react';
import { Calendar, ExternalLink, Copy, Share2, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BookingLinkCardProps {
  companyName: string;
  bookingLink: string;
  onCopyLink: () => void;
  onShareLink: () => void;
  onViewBookingPage: () => void;
}

const BookingLinkCard = ({ companyName, bookingLink, onCopyLink, onShareLink, onViewBookingPage }: BookingLinkCardProps) => {
  return (
    <Card className="mb-8 border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-sm">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Seu Link de Agendamento</h3>
            <p className="text-sm text-gray-600">Compartilhe com seus clientes para agendamentos online</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-blue-100 mb-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <ExternalLink className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">Seu link personalizado:</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <code className="flex-1 bg-gray-50 p-3 rounded-lg text-sm text-blue-600 font-mono border border-gray-200 break-all">
              {bookingLink}
            </code>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={onCopyLink} className="border-blue-200 text-blue-600 hover:bg-blue-50">
                <Copy className="w-4 h-4 mr-1" />
                Copiar
              </Button>
              <Button variant="outline" size="sm" onClick={onShareLink} className="border-green-200 text-green-600 hover:bg-green-50">
                <Share2 className="w-4 h-4 mr-1" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={onViewBookingPage}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            Visualizar Página de Agendamento
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingLinkCard;

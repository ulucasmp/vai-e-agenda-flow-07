
import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import ServiceForm from './ServiceForm';

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  active: boolean;
}

interface ServicesTabProps {
  services: Service[];
}

const ServicesTab = ({ services }: ServicesTabProps) => {
  const { toast } = useToast();
  const [servicesList, setServicesList] = useState(services);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>();

  const handleAddService = () => {
    setEditingService(undefined);
    setShowForm(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDeleteService = (serviceId: number) => {
    setServicesList(prev => prev.filter(service => service.id !== serviceId));
    toast({
      title: "Serviço excluído",
      description: "O serviço foi removido com sucesso.",
    });
  };

  const handleSaveService = (serviceData: Omit<Service, 'id'> & { id?: number }) => {
    if (serviceData.id) {
      // Editando serviço existente
      setServicesList(prev => prev.map(service => 
        service.id === serviceData.id 
          ? { ...serviceData, id: serviceData.id }
          : service
      ));
      toast({
        title: "Serviço atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
    } else {
      // Adicionando novo serviço
      const newService = {
        ...serviceData,
        id: Math.max(...servicesList.map(s => s.id), 0) + 1
      };
      setServicesList(prev => [...prev, newService]);
      toast({
        title: "Serviço adicionado",
        description: "O novo serviço foi criado com sucesso.",
      });
    }
    setShowForm(false);
    setEditingService(undefined);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingService(undefined);
  };

  return (
    <TabsContent value="services" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Serviços Oferecidos</h2>
        <Button 
          onClick={handleAddService}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Serviço
        </Button>
      </div>

      <Card className="border-blue-100 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serviço</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicesList.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>R$ {service.price.toFixed(2)}</TableCell>
                  <TableCell>{service.duration} min</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      service.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        onClick={() => handleEditService(service)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Serviço</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o serviço "{service.name}"? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteService(service.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showForm && (
        <ServiceForm
          service={editingService}
          onSave={handleSaveService}
          onCancel={handleCancelForm}
        />
      )}
    </TabsContent>
  );
};

export default ServicesTab;

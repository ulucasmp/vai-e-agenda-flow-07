
import React from 'react';

interface DashboardHeaderProps {
  companyName: string;
}

const DashboardHeader = ({ companyName }: DashboardHeaderProps) => {
  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Olá, {companyName}! 👋
          </h1>
          <p className="text-gray-600 mt-1">Bem-vindo ao seu painel de controle</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">Hoje</p>
          <p className="text-xl font-semibold text-gray-900 capitalize">
            {formatDate()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;


import React, { createContext, useContext, useState, useEffect } from 'react';

interface WorkingHour {
  active: boolean;
  start: string;
  end: string;
}

export interface CompanySettings {
  name: string;
  address: string;
  phone: string;
  logo: string | null;
  businessPhoto: string | null;
  workingHours: {
    [key: string]: WorkingHour;
  };
}

interface CompanyContextType {
  companySettings: CompanySettings;
  updateCompanySettings: (settings: Partial<CompanySettings>) => void;
  generateBookingLink: () => string;
  companySlug: string;
}

const defaultWorkingHours = {
  segunda: { active: true, start: '08:00', end: '18:00' },
  terca: { active: true, start: '08:00', end: '18:00' },
  quarta: { active: true, start: '08:00', end: '18:00' },
  quinta: { active: true, start: '08:00', end: '18:00' },
  sexta: { active: true, start: '08:00', end: '18:00' },
  sabado: { active: true, start: '08:00', end: '18:00' },
  domingo: { active: false, start: '08:00', end: '18:00' }
};

const defaultCompanySettings: CompanySettings = {
  name: "Salão Beleza & Estilo",
  address: "Rua das Flores, 123 - Centro",
  phone: "(11) 99999-9999",
  logo: null,
  businessPhoto: null,
  workingHours: defaultWorkingHours
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem('companySettings');
    return saved ? JSON.parse(saved) : defaultCompanySettings;
  });

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .trim();
  };

  const companySlug = generateSlug(companySettings.name);

  const updateCompanySettings = (newSettings: Partial<CompanySettings>) => {
    const updatedSettings = { ...companySettings, ...newSettings };
    setCompanySettings(updatedSettings);
    localStorage.setItem('companySettings', JSON.stringify(updatedSettings));
  };

  const generateBookingLink = (): string => {
    const slug = generateSlug(companySettings.name);
    // Gera um link de demonstração usando o atual domínio + uma rota de agendamento
    const currentDomain = window.location.origin;
    return `${currentDomain}/agendamento/${slug}`;
  };

  useEffect(() => {
    localStorage.setItem('companySettings', JSON.stringify(companySettings));
  }, [companySettings]);

  return (
    <CompanyContext.Provider value={{
      companySettings,
      updateCompanySettings,
      generateBookingLink,
      companySlug
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

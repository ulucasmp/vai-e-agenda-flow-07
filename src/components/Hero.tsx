
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Main Content */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-3xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Agendamentos simples para
            <br />
            <span className="text-blue-400">negócios incríveis</span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto px-2">
            O sistema ideal para barbearias, salões, clínicas e autônomos organizarem
            <br className="hidden sm:block" />
            seus horários com praticidade.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12 lg:mb-16">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 border-0 transition-colors text-base sm:text-lg px-4 py-3 sm:px-8 sm:py-4 rounded-xl w-full sm:w-auto text-white max-w-xs sm:max-w-none"
              asChild
            >
              <Link to="/cadastro">Experimente Grátis</Link>
            </Button>
            <Link 
              to="/login"
              className="text-base sm:text-lg text-gray-700 hover:text-blue-400 transition-colors"
            >
              Já tenho conta
            </Link>
          </div>
        </div>

        {/* Agenda Card */}
        <div className="max-w-xs sm:max-w-sm lg:max-w-md mx-auto">
          <Card className="p-0 bg-white shadow-2xl border border-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden">
            {/* Header do Card */}
            <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Minha Agenda</h3>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            
            {/* Lista de Agendamentos */}
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-100">
                <div>
                  <div className="font-medium text-gray-900 text-sm sm:text-base">João - Corte</div>
                </div>
                <div className="text-blue-400 font-semibold text-sm sm:text-base">14:30</div>
              </div>
              
              <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                <div>
                  <div className="font-medium text-gray-900 text-sm sm:text-base">Maria - Manicure</div>
                </div>
                <div className="text-gray-600 font-semibold text-sm sm:text-base">15:00</div>
              </div>
              
              <div className="flex items-center justify-between p-3 sm:p-4 bg-yellow-50 rounded-lg sm:rounded-xl border border-yellow-100">
                <div>
                  <div className="font-medium text-gray-900 text-sm sm:text-base">Pedro - Barba</div>
                </div>
                <div className="text-yellow-600 font-semibold text-sm sm:text-base">15:30</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;

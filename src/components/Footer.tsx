
import { Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  const handleInstagramClick = () => {
    window.open('https://instagram.com/vaieagenda', '_blank');
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = "5585997858919";
    const message = "Olá, gostaria de saber como o Vai e Agenda pode ajudar meu negócio.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="hover:opacity-80 transition-opacity inline-block">
              <Logo size="md" variant="full" className="text-white" />
            </Link>
            <p className="text-gray-400 leading-relaxed">
              O jeito moderno de organizar atendimentos.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              Transformando a forma como profissionais gerenciam seus agendamentos. Simples, 
              eficiente e feito para o Brasil.
            </p>
          </div>

          {/* Links Úteis */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Links Úteis</h4>
            <ul className="space-y-3">
              <li><Link to="/sobre" className="text-gray-400 hover:text-white transition-colors">Sobre nós</Link></li>
              <li><Link to="/contato" className="text-gray-400 hover:text-white transition-colors">Contato</Link></li>
              <li><Link to="/privacidade" className="text-gray-400 hover:text-white transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/termos" className="text-gray-400 hover:text-white transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>

          {/* Fale Conosco */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Fale Conosco</h4>
            <div className="space-y-4">
              <button 
                onClick={handleWhatsAppClick}
                className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors group cursor-pointer"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 group-hover:text-green-500 transition-colors"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.386"/>
                </svg>
                <span>WhatsApp</span>
              </button>
              <button 
                onClick={handleInstagramClick}
                className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors group cursor-pointer"
              >
                <Instagram className="w-5 h-5 group-hover:text-pink-500 transition-colors" />
                <span>Instagram</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 VaiEAgenda • v1.0 • Todos os direitos reservados
            </p>
            <p className="text-gray-500 text-sm mt-4 md:mt-0">
              Feito com ❤️ no Brasil
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { useNavigate, useLocation } from 'react-router-dom';

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const isProductPage = location.pathname === '/product';

  const handleClick = () => {
    if (isProductPage) {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#232f3e] text-white mt-12">
      {/* Back to Top / Back to Shopping Page */}
      <div 
        className="bg-[#37475a] hover:bg-[#4a5b6f] text-center py-4 cursor-pointer transition-colors"
        onClick={handleClick}
      >
        <span className="text-sm">{isProductPage ? 'Back to Shopping Page' : 'Back to top'}</span>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-600 bg-[#131921]">
        <div className="max-w-[1500px] mx-auto px-8 py-6">
          <div className="text-center text-white">
            DS5110 Project
          </div>
        </div>
      </div>
    </footer>
  );
}

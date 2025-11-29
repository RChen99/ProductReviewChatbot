import { Gift } from 'lucide-react';

export function HeroBanner() {
  return (
    <div className="relative bg-gradient-to-r from-red-600 to-red-700 h-[400px] flex items-center justify-center" style={{ overflow: 'visible' }}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" style={{ zIndex: 1 }}></div>
      
      <div className="text-center px-4" style={{ zIndex: 20, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '16px' }}>
          <h1 className="text-5xl text-white drop-shadow-lg">Holiday Deals</h1>
          <Gift className="text-green-600 drop-shadow-lg" style={{ width: '50px', height: '50px' }} />
        </div>
        <p className="text-xl text-white mb-6 drop-shadow">Save up to 70% on gifts for everyone</p>
        <button className="bg-white hover:bg-gray-100 text-red-600 px-8 py-3 rounded-lg transition-colors shadow-lg">
          Shop all Holiday deals
        </button>
      </div>
    </div>
  );
}

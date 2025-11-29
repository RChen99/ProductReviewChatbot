export function HeroBanner() {
  return (
    <div className="relative bg-gradient-to-r from-red-600 to-red-700 h-[400px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
      
      <div className="text-center z-20 px-4">
        <h1 className="text-5xl mb-4 text-white drop-shadow-lg">Holiday Deals</h1>
        <p className="text-xl text-white mb-6 drop-shadow">Save up to 70% on gifts for everyone</p>
        <button className="bg-white hover:bg-gray-100 text-red-600 px-8 py-3 rounded-lg transition-colors shadow-lg">
          Shop all Holiday deals
        </button>
      </div>
    </div>
  );
}

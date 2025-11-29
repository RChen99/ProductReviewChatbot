export function Footer() {
  return (
    <footer className="bg-[#232f3e] text-white mt-12">
      {/* Back to Top */}
      <div 
        className="bg-[#37475a] hover:bg-[#4a5b6f] text-center py-4 cursor-pointer transition-colors"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <span className="text-sm">Back to top</span>
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

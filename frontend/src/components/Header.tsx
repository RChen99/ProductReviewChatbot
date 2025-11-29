import { Search, ShoppingCart, MapPin, Menu } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-[#131921] text-white">
      {/* Top Header */}
      <div className="px-4 py-2">
        <div className="mx-auto flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <div className="px-2 py-1 border border-transparent hover:border-white rounded cursor-pointer">
              <span className="text-2xl">DS5110</span>
            </div>
          </div>

          {/* Deliver to */}
          <div className="hidden md:flex items-center px-2 py-1 border border-transparent hover:border-white rounded cursor-pointer">
            <MapPin className="w-5 h-5 mr-1" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-300">Deliver to</span>
              <span className="text-sm">Boston 02108</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1" style={{ flexGrow: 3 }}>
            <div className="flex items-center w-full gap-2">
              <input
                type="text"
                placeholder="Search DS5110"
                className="flex-1 px-4 py-2 text-gray-900 focus:outline-none rounded-lg h-10"
              />
              <button className="bg-[#febd69] hover:bg-[#f3a847] px-4 py-2 rounded-lg h-10">
                <Search className="w-5 h-5 text-gray-900" />
              </button>
            </div>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-6">
            {/* Account & Lists */}
            <div className="hidden lg:flex flex-col px-2 py-1 border border-transparent hover:border-white rounded cursor-pointer">
              <span className="text-xs">Hello, Sign In</span>
              <span className="text-sm">Account & Lists</span>
            </div>

            {/* Returns & Orders */}
            <div className="hidden lg:flex flex-col px-2 py-1 border border-transparent hover:border-white rounded cursor-pointer">
              <span className="text-xs">Returns</span>
              <span className="text-sm">& Orders</span>
            </div>

            {/* Cart */}
            <div className="flex items-center px-2 py-1 border border-transparent hover:border-white rounded cursor-pointer relative">
              <ShoppingCart className="w-8 h-8" />
              <span className="absolute top-0 left-5 bg-[#f08804] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">0</span>
              <span className="ml-1 hidden sm:block">Cart</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Header */}
      <div className="bg-[#232f3e] px-4 py-4">
        <div className="max-w-[1500px] mx-auto flex items-center gap-6">
          <div className="flex items-center gap-1 px-2 py-1 border border-transparent hover:border-white rounded cursor-pointer">
            <Menu className="w-5 h-5" />
            <span className="text-sm">All</span>
          </div>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <a href="#" className="text-white no-underline px-2 py-1 border border-transparent hover:border-white rounded">Today's Deals</a>
            <a href="#" className="text-white no-underline px-2 py-1 border border-transparent hover:border-white rounded">Customer Service</a>
            <a href="#" className="text-white no-underline px-2 py-1 border border-transparent hover:border-white rounded">Registry</a>
            <a href="#" className="text-white no-underline px-2 py-1 border border-transparent hover:border-white rounded">Gift Cards</a>
            <a href="#" className="text-white no-underline px-2 py-1 border border-transparent hover:border-white rounded">Sell</a>
          </nav>
        </div>
      </div>
    </header>
  );
}

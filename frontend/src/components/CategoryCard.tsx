import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  description: string;
}

export function CategoryCard({ title, icon: Icon, description }: CategoryCardProps) {
  return (
    <div className="bg-white p-6 cursor-pointer hover:shadow-lg transition-shadow">
      <div className="mb-4 flex items-center justify-center py-6 bg-gradient-to-br from-red-50 to-green-50 rounded">
        <Icon className="w-20 h-20 text-red-600" />
      </div>
      <h3 className="mb-2 text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <a href="#" className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline">
        Shop now
      </a>
    </div>
  );
}

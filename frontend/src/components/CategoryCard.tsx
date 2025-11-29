import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  description: string;
  color?: 'red' | 'green';
}

export function CategoryCard({ title, icon: Icon, description, color = 'red' }: CategoryCardProps) {
  const iconColorClass = color === 'green' ? 'text-green-600' : 'text-red-600';
  const bgColorClass =
    color === 'green'
      ? 'bg-[#e6f4ea]' // soft green
      : 'bg-[#fee2e2]'; // soft red

  return (
    <div className="bg-white p-6 cursor-pointer hover:shadow-lg transition-shadow">
      <div className={`mb-4 flex items-center justify-center py-6 rounded ${bgColorClass}`}>
        <Icon className={`w-20 h-20 ${iconColorClass}`} />
      </div>
      <h3 className="mb-2 text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <a href="#" className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline">
        Shop now
      </a>
    </div>
  );
}

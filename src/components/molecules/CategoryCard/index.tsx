import type { Category } from '@/features/dashboard';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  index: number;
  category: Category;
  length: number;
}

const CategoryCard = ({ index, category, length }: CategoryCardProps) => {
  return (
    <div
      className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm',
        index > 0 ? '-ml-4' : 'ml-0',
        index > 0 ? 'z-10' : 'z-0',
        category.color
      )}
      style={{
        backgroundColor: category.color,
        marginLeft: index > 0 ? '-16px' : '0',
        zIndex: length - index,
      }}
    >
      <div className='w-6 h-6 flex items-center justify-center'>
        <div className='w-4 h-4 bg-white rounded-sm opacity-80'></div>
      </div>
    </div>
  );
};

export default CategoryCard;

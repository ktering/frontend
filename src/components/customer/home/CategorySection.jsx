import CategoryItem from './CategoryItem';
import categories from '../../../assets/data/categories';

const CategorySection = () => {
  return (
    <div className="py-6 px-4">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide md:overflow-x-visible md:flex-wrap">
        {categories.map((cat) => (
          <CategoryItem key={cat.id} name={cat.name} image={cat.image} />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;

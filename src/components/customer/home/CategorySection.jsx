import CategoryItem from './CategoryItem';
import categories from '../../../assets/data/categories';

const CategorySection = () => {
  return (
    <div className="w-full px-4 mb-10">
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 py-2">
        <div className="flex gap-4 mx-auto w-max">
          {categories.map((cat) => (
            <CategoryItem key={cat.id} name={cat.name} image={cat.image} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;

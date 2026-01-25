// will be used for customer and admin
import ChefCard from "./chefCard";
const chefGrid = ({ chefs, onChefClick, renderActions }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {chefs.map((chef) => (
      <ChefCard key={chef._id} chef={chef} onClick={() => onChefClick?.(chef)}>
        {renderActions && renderActions(chef)}
      </ChefCard>
    ))}
  </div>
);

export default chefGrid;

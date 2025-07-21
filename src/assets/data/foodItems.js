import biryaniImg from "../food/chicken-biryani.jpg";
import sushiImg from "../food/salmon-sushi.jpg";
import hummusImg from "../food/hummus-plate.jpg";
import veganBowlImg from "../food/vegan-bowl.jpg";
import tacosImg from "../food/beef-tacos.jpg";
import butterPaneerImg from "../food/butter-paneer.jpg";
import chocolateCakeImg from "../food/chocolate-cake.jpg";
import springRollsImg from "../food/vegetable-spring-rolls.jpg";


const foodItems = [
  {
    _id: "food-001",
    name: "Chicken Biryani",
    image: biryaniImg,
    price: 12.99,
    chef: "Fatima Khan",
    category: "Asian", // changed from "Indian"
    prepTime: "40 mins",
  },
  {
    _id: "food-002",
    name: "Salmon Sushi Roll",
    image: sushiImg,
    price: 14.5,
    chef: "Kenji Sato",
    category: "Asian",
    prepTime: "25 mins",
  },
  {
    _id: "food-003",
    name: "Hummus with Pita",
    image: hummusImg,
    price: 8.0,
    chef: "Layla Nassar",
    category: "Middle Eastern",
    prepTime: "20 mins",
  },
  {
    _id: "food-004",
    name: "Vegan Power Bowl",
    image: veganBowlImg,
    price: 10.5,
    chef: "Sophie Green",
    category: "Vegan",
    prepTime: "30 mins",
  },
  {
    _id: "food-005",
    name: "Beef Tacos",
    image: tacosImg,
    price: 11.0,
    chef: "Carlos Mendez",
    category: "Trending", // changed from "Mexican"
    prepTime: "35 mins",
  },
  {
    _id: "food-006",
    name: "Butter Paneer",
    image: butterPaneerImg,
    price: 9.75,
    chef: "Amanpreet Kaur",
    category: "Vegetarian",
    prepTime: "30 mins",
  },
  {
    _id: "food-007",
    name: "Chocolate Cake Slice",
    image: chocolateCakeImg,
    price: 6.5,
    chef: "Emily Rose",
    category: "Desserts",
    prepTime: "15 mins",
  },
  {
  _id: "food-008",
  name: "Vegetable Spring Rolls",
  image: springRollsImg, // import at top
  price: 7.5,
  chef: "Mei Lin",
  category: "Asian",
  prepTime: "20 mins",
},

];

export default foodItems;

// src/data/categories.js

import trendingImg from '../category-images/trending.jpg';
import asianImg from '../category-images/asian.jpg';
import middleEasternImg from '../category-images/eastern.jpg';
import vegetarianImg from '../category-images/vegeterian.jpg';
import veganImg from '../category-images/vegan.jpg';
import dessertsImg from '../category-images/dessert.jpg';

const categories = [
  { id: 'trending', name: 'Trending', image: trendingImg },
  { id: 'asian', name: 'Asian', image: asianImg },
  { id: 'middle-eastern', name: 'Middle Eastern', image: middleEasternImg },
  { id: 'vegetarian', name: 'Vegetarian', image: vegetarianImg },
  { id: 'vegan', name: 'Vegan', image: veganImg },
  { id: 'desserts', name: 'Desserts', image: dessertsImg },
];

export default categories;

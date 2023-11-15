interface Image {
    id: string;
    food_id: string;
    image_url: string;
}

interface Quantity {
    id: string;
    food_id: string;
    size: string;
    price: string;
    quantity: string;
}

export interface FoodItem {
    id: string;
    kterer_id: number;
    name: string;
    description: string;
    ingredients: string;
    halal: string;
    kosher: boolean;
    vegetarian: boolean;
    contains_nuts: boolean;
    meat_type: string;
    ethnic_type: string;
    images: Image[];
    quantities: Quantity[];
    rating: number;
}

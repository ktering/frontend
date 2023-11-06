"use client";
import {useState} from "react";
import StarRating from "@/components/starRating";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"

const FoodDetails =
    {
        id: 123123123,
        name: "Chicken Biryani",
        price: "10.99",
        review: 3,
        des: "Chicken Biryani is a savory chicken and rice dish that includes layers of chicken, rice, and aromatics that are steamed together. The bottom layer of rice absorbs all the chicken juices as it cooks, giving it a tender texture and rich flavor, while the top layer of rice turns out white and fluffy.",
        ingredients: "Chicken, Rice, Spices, Oil, Onion, Tomato, Ginger, Garlic, Green Chilli, Coriander, Mint, Yogurt, Lemon, Ghee, Saffron, Milk, Water",
        image: [
            "https://www.indianhealthyrecipes.com/wp-content/uploads/2019/02/chicken-biryani-recipe-500x500.jpg",
            "data:image/jpeg;base64,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",
            "https://static.toiimg.com/thumb/53096628.cms?imgsize=104874&width=800&height=800",
        ],
        ethnicType: "Indian",
        mayContainNuts: "Yes",
        halal: "Hand Slaughtered",
    }


export default function Food() {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [mainImage, setMainImage] = useState(FoodDetails.image[0]);

    const handleThumbnailClick = (imageSrc: string) => {
        setMainImage(imageSrc);
    };

    const incrementQuantity = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity((prevQuantity) => prevQuantity - 1);
        }
    };

    const selectSize = (size: string) => {
        setSelectedSize(size);
    };

    const addToCart = () => {
        // Create a cart item
        const cartItem = {
            id: FoodDetails.id,
            name: FoodDetails.name,
            size: selectedSize,
            quantity: quantity,
            price: FoodDetails.price
        };

        // Get the current cart from local storage
        let cart = localStorage.getItem('cart');
        cart = cart ? JSON.parse(cart) : [];

        // Check if the item already exists and update quantity
        const existingItemIndex = cart.findIndex(item => item.id === cartItem.id && item.size === cartItem.size);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += cartItem.quantity;
        } else {
            // Add the new item to the cart
            cart.push(cartItem);
        }

        // Save the updated cart back to local storage
        localStorage.setItem('cart', JSON.stringify(cart));

        console.log('Item added to cart', cartItem);
        // You can add a success message or similar feedback for the user here
    };


    const renderSizeButton = (size: string) => (
        <button
            onClick={() => selectSize(size)}
            className={`border rounded-full px-4 py-2.5 font-semibold text-primary-color shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color ${selectedSize === size ? 'bg-primary-color text-white hover:bg-primary-color-hover' : 'bg-white hover:bg-gray-50'}`}
        >
            {size}
        </button>
    );

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="col-span-1">
                        <div className="w-full h-96 overflow-hidden rounded-lg">
                            <img src={mainImage} alt="Main Product"
                                 className="w-full h-full object-cover rounded-lg"/>
                        </div>
                        <div className="flex mt-4 space-x-2">
                            {FoodDetails.image.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Thumbnail ${index}`}
                                    className="w-24 h-24 object-cover cursor-pointer rounded-lg"
                                    onClick={() => handleThumbnailClick(image)}
                                />
                            ))}
                        </div>
                    </div>


                    <div>
                        <h1 className="text-3xl font-bold">{FoodDetails.name}</h1>
                        <StarRating rating={FoodDetails.review}/>
                        <div className="mb-2 mt-2 space-x-2">
                             <span
                                 className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                 Halal - Hand Slaughtered
                             </span>
                            <span
                                className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                                Contains Nuts
                            </span>
                            <span
                                className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                                Kosher
                            </span>
                            <span
                                className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                Vegetarian
                            </span>
                        </div>
                        <p className="text-lg mb-6 mt-4 font-bold">${FoodDetails.price}</p>
                        <div className="flex flex-col space-y-2">
                            <p>Size</p>
                            <div className="my-2 space-x-2">
                                {renderSizeButton('Small')}
                                {renderSizeButton('Medium')}
                                {renderSizeButton('Large')}
                            </div>
                        </div>
                        <div className="flex flex-col items-start space-y-2 mt-6 mb-8">
                            <p>Quantity</p>
                            <div className="flex items-center justify-center border border-gray-200 rounded-full">
                                <button
                                    onClick={decrementQuantity}
                                    type="button"
                                    className="flex items-center justify-center w-10 h-10 text-gray-600 transition hover:opacity-75"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5}
                                         stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6"/>
                                    </svg>
                                </button>
                                <input
                                    type="number"
                                    id="Quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                                    className="h-10 w-16 text-center border-transparent appearance-none outline-none"
                                />
                                <button
                                    onClick={incrementQuantity}
                                    type="button"
                                    className="flex items-center justify-center w-10 h-10 text-gray-600 transition hover:opacity-75"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5}
                                         stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={addToCart}
                            className="rounded-full w-full bg-primary-color hover:bg-primary-color-hover px-4 py-2.5 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color">Add
                            to Cart
                        </button>
                        <div className="my-8">
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Description</AccordionTrigger>
                                    <AccordionContent>
                                        {FoodDetails.des}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Ingredients</AccordionTrigger>
                                    <AccordionContent>
                                        {FoodDetails.ingredients}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}
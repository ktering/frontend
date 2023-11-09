"use client";
import {SetStateAction, useEffect, useState} from "react";
import StarRating from "@/components/starRating";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion"
import {useRouter, useSearchParams} from "next/navigation";
import useCart from "@/app/hooks/useCart";

export default function Food() {
    const searchParams = useSearchParams();
    const foodIdMainPage = searchParams.get('food_id');
    const [foodDetails, setFoodDetails] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("small");
    // TODO: fix this main image
    const [mainImage, setMainImage] = useState();
    const {addItemToCart, updateItemQuantity, removeItemFromCart} = useCart();

    const router = useRouter();

    useEffect(() => {
        if (!foodIdMainPage || foodIdMainPage === '' || foodIdMainPage === 'undefined' || foodIdMainPage === 'null') {
            router.push('/kterings');
            return
        }

        const getFoodInfo = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const apiURL = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${apiURL}/api/food/${foodIdMainPage}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            if (!response.ok) {
                console.error(`Error: ${response.statusText}`);
                return;
            }

            const data = await response.json();

            if (data.data && data.data.quantities) {
                const smallSizeAvailable = data.data.quantities.some((q: {
                    size: string;
                }) => q.size === 'small');
                if (smallSizeAvailable) {
                    setSelectedSize('small');
                }
            }

            setFoodDetails(data.data);
            setMainImage(data.data.images[0].image_url);
        }

        getFoodInfo();
    }, [foodIdMainPage]);

    const handleThumbnailClick = (imageSrc: string) => {
        setMainImage(imageSrc);
    };

    const incrementQuantity = () => {
        const currentSizeDetails = foodDetails?.quantities.find((q: { size: string; }) => q.size === selectedSize);
        if (currentSizeDetails && quantity < parseInt(currentSizeDetails.quantity)) {
            setQuantity((prevQuantity) => prevQuantity + 1);
        }
    };
    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity((prevQuantity) => prevQuantity - 1);
        }
    };

    const selectSize = (size: SetStateAction<string>) => {
        const sizeDetails = foodDetails?.quantities.find((q: {
            size: SetStateAction<string>;
        }) => q.size === size);
        if (sizeDetails) {
            setSelectedSize(size);
            setQuantity(1);
        }
    };

    const isSizeAvailable = (size: string) => {
        return foodDetails && foodDetails?.quantities.some((q: {
            size: string;
        }) => q.size === size);
    };

    const addToCart = () => {
        const cartItem = {
            id: `${foodDetails?.id}-${Date.now()}`,
            name: foodDetails?.name,
            size: selectedSize,
            quantity: quantity,
            maxQuantity: foodDetails?.quantities.find((quantityItem: {
                size: string;
            }) => quantityItem.size === selectedSize)?.quantity,
            price: foodDetails
                ?.quantities.find((quantityItem: {
                    size: string;
                }) => quantityItem.size === selectedSize)?.price,
        };

        addItemToCart(cartItem);
    };

    const renderSizeButton = (size: string) => {
        const isSelected = selectedSize === size;
        const capitalizedSize = size.charAt(0).toUpperCase() + size.slice(1);
        return (
            <button
                onClick={() => selectSize(size)}
                disabled={!isSizeAvailable(size)}
                className={`border rounded-full px-4 py-2.5 font-semibold text-primary-color shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color ${isSelected ? 'bg-primary-color text-white hover:bg-primary-color-hover' : 'bg-white hover:bg-gray-50'}`}
            >
                {capitalizedSize}
            </button>
        );
    };

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
                            {foodDetails?.images.map((image, index) => (
                                <img
                                    key={image.id}
                                    src={image.image_url}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-24 h-24 object-cover cursor-pointer rounded-lg"
                                    onClick={() => handleThumbnailClick(image.image_url)}
                                />
                            ))}
                        </div>
                    </div>


                    <div>
                        <h1 className="text-3xl font-bold">{foodDetails?.name}</h1>
                        {/* TODO: update rating from endpoint */}
                        <StarRating rating={5}/>
                        <div className="mb-2 mt-2 space-x-2">
                            {foodDetails?.halal !== "No" ? (
                                <span
                                    className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                    Halal - Hand Slaughtered
                                </span>
                            ) : (
                                <span
                                    className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                                    Non-Halal
                                </span>
                            )}
                            {foodDetails?.contains_nuts && (
                                <span
                                    className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                                    Contains Nuts
                                </span>
                            )}
                            {foodDetails?.kosher && (
                                <span
                                    className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                                    Kosher
                                </span>
                            )}
                            {foodDetails?.vegetarian && (
                                <span
                                    className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                    Vegetarian
                                </span>
                            )}
                        </div>
                        <p className="text-lg mb-6 mt-4 font-bold">
                            ${selectedSize && foodDetails ? foodDetails.quantities.find((q: {
                            size: string;
                        }) => q.size === selectedSize)?.price : "Loading..."}
                        </p>
                        <div className="flex flex-col space-y-2">
                            <p>Size</p>
                            <div className="my-2 space-x-2">
                                {renderSizeButton('small')}
                                {renderSizeButton('medium')}
                                {renderSizeButton('large')}
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
                            <Accordion type="single" collapsible defaultValue="item-1">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Description</AccordionTrigger>
                                    <AccordionContent>
                                        <p><u>Ethnic Type:</u>{" "}{foodDetails?.ethnic_type}</p>
                                        <p className="my-2"><u>Meat Type:</u>{" "} {foodDetails?.meat_type}</p>
                                        {foodDetails?.description}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Ingredients</AccordionTrigger>
                                    <AccordionContent>
                                        {foodDetails?.ingredients.split(/\s+/).join(", ")}
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
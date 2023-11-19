"use client";
import React, {useContext, useEffect, useState} from "react";
import Biryani from "@/static/landing-page/biryani.png";
import AsianIcon from "@/static/home/asian-icon.svg";
import ChickenIcon from "@/static/home/chicken-icon.svg";
import DessertsIcon from "@/static/home/desserts-icon.svg";
import DrinksIcon from "@/static/home/drinks-icon.svg";
import IndianIcon from "@/static/home/indian-icon.svg";
import MexicanIcon from "@/static/home/mexican-icon.svg";
import MiddleEasternIcon from "@/static/home/middle-eastern-icon.svg";
import TrendingIcon from "@/static/home/trending-icon.svg";
import VeganIcon from "@/static/home/vegan-icon.svg";
import Image from "next/image";
import StarRating from "@/components/starRating";
import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
import {CheckCircleIcon, ChevronDownIcon, HeartIcon as HeartIconOutline} from "@heroicons/react/24/outline";
import {HeartIcon as HeartIconSolid} from "@heroicons/react/24/solid";
import {FoodItem} from "@/types/shared/food";
import {SearchContext} from "@/app/context/searchContext";
import {toast} from "@/components/ui/use-toast";

export default function Kterings() {
    const [nearYouFood, setNearYouFood] = useState<FoodItem[]>([]);
    const [position, setPosition] = useState("over4");
    const contextValue = useContext(SearchContext);
    if (!contextValue) {
        return null;
    }
    const {searchInput} = contextValue;
    const isSearching = searchInput.trim().length > 0;
    const tryNewFood = nearYouFood;
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    useEffect(() => {
        const getNearYouFood = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const apiURL = process.env.NEXT_PUBLIC_API_URL;

            try {
                const response = await fetch(`${apiURL}/api/food`, {
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
                setNearYouFood(data.data);

            } catch (error) {
                console.error(`Error: ${error}`);
            }
        }

        getNearYouFood().catch((error) => {
            console.error(`Error: ${error}`);
        });
    }, []);

    const filteredFood = nearYouFood.filter(item =>
        item.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    const toggleFavorite = async (foodId: string) => {
        const accessToken = localStorage.getItem('accessToken');
        const apiURL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiURL}/api/favourite/food/${foodId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        });

        if (!response.ok) {
            console.error(`Error: ${response.statusText}`);
            return;
        }

        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(foodId)) {
                newFavorites.delete(foodId);
            } else {
                newFavorites.add(foodId);
            }
            return newFavorites;
        });

        toast({
            description: (
                <>
                    <div className="flex items-center">
                        <CheckCircleIcon
                            className="w-6 h-6 inline-block align-text-bottom mr-2 text-green-400"/>
                        Kterer Successfully Favorited!
                    </div>
                </>
            ),
            duration: 5000,
        });
    }

    const icons = [
        {src: TrendingIcon, iconName: "Trending", onClick: () => console.log('Trending Icon clicked')},
        {src: IndianIcon, iconName: "Indian", onClick: () => console.log('Indian Icon clicked')},
        {src: AsianIcon, iconName: "Asian", onClick: () => console.log('Asian Icon clicked')},
        {src: MexicanIcon, iconName: "Mexican", onClick: () => console.log('Mexican Icon clicked')},
        {src: MiddleEasternIcon, iconName: "Middle Eastern", onClick: () => console.log('Middle Eastern Icon clicked')},
        {src: VeganIcon, iconName: "Vegan", onClick: () => console.log('Vegan Icon clicked')},
        {src: ChickenIcon, iconName: "Chicken", onClick: () => console.log('Chicken Icon clicked')},
        {src: DessertsIcon, iconName: "Desserts", onClick: () => console.log('Desserts Icon clicked')},
        {src: DrinksIcon, iconName: "Drinks", onClick: () => console.log('Drinks Icon clicked')},
    ];

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div
                    className="flex justify-between space-x-8 scrollbar overflow-x-auto md:overflow-visible md:flex-nowrap mb-4">
                    {icons.map((icon, index) => (
                        <button
                            key={index}
                            onClick={icon.onClick}
                            className="flex-none flex flex-col justify-center items-center font-bold text-sm min-w-0"
                            style={{minWidth: `calc(100% / ${icons.length} - (16px * 2))`}}
                        >
                            <div
                                className="w-full px-2 h-full flex flex-col justify-center items-center">
                                <Image src={icon.src} alt="Navigation Icon" width={48} height={48} className="h-12"/>
                                <p>{icon.iconName}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Filters */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="rounded-full text-primary-color">
                        <Button variant="outline">
                            <div className="flex gap-2 items-center">
                                Over 4 <div className="fa fa-star text-yellow-400"/>
                                <ChevronDownIcon className="w-6 h-6"/>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                            <DropdownMenuRadioItem value="over2">Over 2</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="over3">Over 3</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="over4">Over 4</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Near You */}

                <p className="font-bold text-xl my-12">{isSearching ? "SEARCHED FOOD" : "NEAR YOU"}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    {isSearching && filteredFood.length === 0 ? (
                        <p>No search results found</p>
                    ) : (
                        filteredFood.map((item, index) => {
                            const food_id = new URLSearchParams({
                                food_id: item.id,
                            }).toString();

                            return (
                                <div key={index} className="relative">
                                    <Link href={`/kterings/${item.name}?${food_id}`}>
                                        <div
                                            className="aspect-w-4 aspect-h-3 w-full bg-gray-200 rounded-lg overflow-hidden">

                                            <Image
                                                src={item.images && item.images.length > 0 ? item.images[0].image_url : Biryani}
                                                alt={item.name}
                                                layout="fill"
                                                className="mx-auto rounded-lg w-full"/>
                                        </div>
                                    </Link>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="text-left">
                                            <p className="text-lg">{item.name}</p>
                                            {item.rating !== 0 &&
                                                <StarRating rating={item.rating}/>
                                            }
                                            {/* TODO: update the distance from the endpoint */}
                                            <p className="text-sm mt-1">00 min away</p>
                                        </div>


                                        <span onClick={() => toggleFavorite(item.id)}>
                                            {favorites.has(item.id) ? (
                                                <HeartIconSolid className="h-6 w-6 cursor-pointer text-primary-color"/>
                                            ) : (
                                                <HeartIconOutline className="h-6 w-6 cursor-pointer"/>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* TRY SOMETHING NEW */}
                {!isSearching && (
                    <>
                        <p className="font-bold text-xl my-12">TRY SOMETHING NEW</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                            {nearYouFood.map((item, index) => {
                                const food_id = new URLSearchParams({
                                    food_id: item.id,
                                }).toString();

                                return (
                                    <div key={index} className="relative">
                                        <Link href={`/kterings/${item.name}?${food_id}`}>
                                            <div
                                                className="aspect-w-4 aspect-h-3 w-full bg-gray-200 rounded-lg overflow-hidden">
                                                <Image
                                                    src={item.images && item.images.length > 0 ? item.images[0].image_url : Biryani}
                                                    alt={item.name}
                                                    layout="fill"
                                                    className="mx-auto rounded-lg w-full"/>
                                            </div>
                                        </Link>
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="text-left">
                                                <p className="text-lg">{item.name}</p>
                                                {item.rating !== 0 &&
                                                    <StarRating rating={item.rating}/>
                                                }
                                                {/* TODO: update the distance from the endpoint */}
                                                <p className="text-sm mt-1">00 min away</p>
                                            </div>


                                            <span onClick={() => toggleFavorite(item.id)}>
                                                {favorites.has(item.id) ? (
                                                    <HeartIconSolid
                                                        className="h-6 w-6 cursor-pointer text-primary-color"/>
                                                ) : (
                                                    <HeartIconOutline className="h-6 w-6 cursor-pointer"/>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

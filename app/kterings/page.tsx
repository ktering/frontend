"use client";
import {useEffect, useState} from "react";
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
import Biryani from "@/static/landing-page/biryani.png";

export default function Kterings() {
    const [nearYouFood, setNearYouFood] = useState([]);
    const [position, setPosition] = useState("over4");

    useEffect(() => {
        const getNearYouFood = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const apiURL = process.env.NEXT_PUBLIC_API_URL;
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
        }

        getNearYouFood();
    }, []);

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
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
                                </svg>
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

                <p className="font-bold text-xl my-12">NEAR YOU</p>

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
                                        <Image src={item.images[0].image_url || Biryani} alt={item.name} layout="fill"
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
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 cursor-pointer">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                    </svg>
                                </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* TRY SOMETHING NEW */}

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
                                        <Image src={item.images[0].image_url || Biryani} alt={item.name} layout="fill"
                                               className="mx-auto rounded-lg w-full"/>
                                    </div>
                                </Link>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="text-left">
                                        <p className="text-lg">{item.name}</p>
                                        {/* TODO: update the rating here from the endpoint */}
                                        <StarRating rating={5}/>
                                        {/* TODO: update the distance from the endpoint */}
                                        <p className="text-sm mt-1">00 min away</p>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                                    </svg>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </>
    )
}

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
import SearchIcon from "@/static/search-icon.svg";
import Image from "next/image";
import StarRating from "@/components/starRating";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {CheckCircleIcon, ChevronDownIcon, HeartIcon as HeartIconOutline,} from "@heroicons/react/24/outline";
import {FoodItem} from "@/types/shared/food";
import {SearchContext} from "@/app/context/searchContext";
import {toast} from "@/components/ui/use-toast";
import {useNotifications} from "@/components/notificationContext";
import {X} from "lucide-react";

export default function Kterings() {
    const [nearYouFood, setNearYouFood] = useState<FoodItem[]>([]);
    const [displayedFood, setDisplayedFood] = useState<FoodItem[]>([]);
    const [position, setPosition] = useState("over4");
    const contextValue = useContext(SearchContext);
    if (!contextValue) {
        return null;
    }
    const {searchInput} = contextValue;
    const isSearching = searchInput.trim().length > 0;
    const [currentFilter, setCurrentFilter] = useState("Near You");
    const [isLoading, setIsLoading] = useState(true);
    const [favoritedItems, setFavoritedItems] = useState<FavoritedItems>({});

    const {updateNotifications} = useNotifications();

    interface FavoritedItems {
        [key: string]: boolean;
    }

    useEffect(() => {
        const getNearYouFood = async () => {
            const accessToken = localStorage.getItem("accessToken");
            const apiURL = process.env.NEXT_PUBLIC_API_URL;

            setIsLoading(true);

            try {
                const response = await fetch(`${apiURL}/api/food`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    console.error(`Error: ${response.statusText}`);
                    return;
                }

                const data = await response.json();
                setNearYouFood(data.data);
                setDisplayedFood(data.data);
            } catch (error) {
                console.error(`Error: ${error}`);
            } finally {
                setIsLoading(false);
            }
        };
        const getNotifications = async () => {
            const accessToken = localStorage.getItem("accessToken");
            const apiURL = process.env.NEXT_PUBLIC_API_URL;

            try {
                const response = await fetch(`${apiURL}/api/notifications`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    console.error(`Error: ${response.statusText}`);
                    return;
                }

                const data = await response.json();

                updateNotifications(
                    data.map((not: any) => ({
                        id: not.id,
                        message: not.data.message,
                        created_at: new Date(not.created_at),
                        read_at: not.read_at ? new Date(not.read_at) : null,
                    }))
                );
            } catch (error) {
                console.error(`Error: ${error}`);
            }
        };

        getNearYouFood().catch((error) => {
            console.error(`Error: ${error}`);
        });
        getNotifications().catch((error) => {
            console.error(`Error: ${error}`);
        });
    }, []);

    const filteredFood = isSearching
        ? nearYouFood.filter((item) =>
            item.name.toLowerCase().includes(searchInput.toLowerCase())
        )
        : displayedFood;

    const toggleFavorite = async (foodId: string) => {
        const accessToken = localStorage.getItem("accessToken");
        const apiURL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiURL}/api/favourite/food/${foodId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (response.status === 403) {
            setFavoritedItems(prevState => ({
                ...prevState,
                [foodId]: !prevState[foodId]
            }));
            toast({
                description: (
                    <>
                        <div className="flex items-center">
                            <X className="w-6 h-6 inline-block align-text-bottom mr-2 text-red-400"/>
                            You cannot favourite yourself!
                        </div>
                    </>
                ),
                duration: 5000,
            });
            return;
        }

        if (!response.ok) {
            console.error(`Error: ${response.statusText}`);
            return;
        }
        setFavoritedItems(prevState => ({
            ...prevState,
            [foodId]: !prevState[foodId]
        }));
        toast({
            description: (
                <>
                    <div className="flex items-center">
                        <CheckCircleIcon className="w-6 h-6 inline-block align-text-bottom mr-2 text-green-400"/>
                        Kterer Successfully Favorited!
                    </div>
                </>
            ),
            duration: 5000,
        });
    };

    const filterFood = (category: string) => {
        switch (category) {
            case "Indian":
                return nearYouFood.filter((item) => item.ethnic_type === "Indian");
            case "Asian":
                return nearYouFood.filter((item) => item.ethnic_type === "Asian");
            case "Mexican":
                return nearYouFood.filter((item) => item.ethnic_type === "Mexican");
            case "Middle Eastern":
                return nearYouFood.filter(
                    (item) => item.ethnic_type === "Middle Eastern"
                );
            case "Vegan":
                return nearYouFood.filter((item) => item.vegetarian === "Vegan");
            case "Chicken":
                return nearYouFood.filter((item) => item.meat_type === "Chicken");
            case "Desserts":
                return nearYouFood.filter((item) => item.desserts === "Desserts");
            case "Drinks":
                return nearYouFood.filter((item) => item.desserts === "Drinks");
            default:
                return nearYouFood;
        }
    };

    const handleIconClick = (category: string) => {
        let filtered;
        if (category === "All") {
            filtered = nearYouFood;
            setCurrentFilter("Near You");
        } else {
            filtered = filterFood(category);
            setCurrentFilter(category);
        }
        setDisplayedFood(filtered);
    };

    const icons = [
        {
            src: TrendingIcon,
            iconName: "Trending",
            onClick: () => handleIconClick("All"),
        },
        {
            src: IndianIcon,
            iconName: "Indian",
            onClick: () => handleIconClick("Indian"),
        },
        {
            src: AsianIcon,
            iconName: "Asian",
            onClick: () => handleIconClick("Asian"),
        },
        {
            src: MexicanIcon,
            iconName: "Mexican",
            onClick: () => handleIconClick("Mexican"),
        },
        {
            src: MiddleEasternIcon,
            iconName: "Middle Eastern",
            onClick: () => handleIconClick("Middle Eastern"),
        },
        {
            src: VeganIcon,
            iconName: "Vegan",
            onClick: () => handleIconClick("Vegan"),
        },
        {
            src: ChickenIcon,
            iconName: "Chicken",
            onClick: () => handleIconClick("Chicken"),
        },
        {
            src: DessertsIcon,
            iconName: "Desserts",
            onClick: () => handleIconClick("Desserts"),
        },
        {
            src: DrinksIcon,
            iconName: "Drinks",
            onClick: () => handleIconClick("Drinks"),
        },
    ];

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-color"></div>
                <div>
                    <p className="text-primary-color mt-4">Loading food...</p>
                </div>
            </div>
        );
    }

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
                            <div className="w-full px-2 h-full flex flex-col justify-center items-center">
                                <Image
                                    src={icon.src}
                                    alt="Navigation Icon"
                                    width={48}
                                    height={48}
                                    className="h-12"
                                    priority={true}
                                />
                                <p>{icon.iconName}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Filters */}
                <DropdownMenu>
                    <DropdownMenuTrigger
                        asChild
                        className="rounded-full text-primary-color"
                    >
                        <Button variant="outline">
                            <div className="flex gap-2 items-center">
                                Over 4 <div className="fa fa-star text-yellow-400"/>
                                <ChevronDownIcon className="w-6 h-6"/>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuRadioGroup
                            value={position}
                            onValueChange={setPosition}
                        >
                            <DropdownMenuRadioItem value="over2">
                                Over 2
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="over3">
                                Over 3
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="over4">
                                Over 4
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Near You */}
                <p className="font-bold text-xl my-12">
                    {searchInput.trim().length > 0 ? "SEARCHED FOOD" : currentFilter}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                    {filteredFood.length > 0 ? (
                        filteredFood.map((item, index) => {
                            const food_id = new URLSearchParams({
                                food_id: item.id,
                            }).toString();

                            // @ts-ignore
                            return (
                                <div key={index} className="relative">
                                    <Link href={`/kterings/${item.name}?${food_id}`}>
                                        <div
                                            className="w-full bg-gray-200 rounded-lg overflow-hidden h-72 sm:h-64 object-cover object-center">
                                            <Image
                                                src={
                                                    item.images && item.images.length > 0
                                                        ? item.images[0].image_url
                                                        : Biryani
                                                }
                                                width={300}
                                                height={100}
                                                alt={item.name}
                                                className="mx-auto rounded-lg w-full h-full object-cover object-center"
                                                priority={true}
                                            />
                                        </div>
                                    </Link>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="text-left">
                                            <p className="text-lg">{item.name}</p>
                                            {item.rating !== 0 && <StarRating rating={item.rating}/>}
                                            {/* TODO: update the distance from the endpoint */}
                                            <p className="text-sm mt-1">00 min away</p>
                                        </div>

                                        <span onClick={() => toggleFavorite(item.id)}>
                        <HeartIconOutline
                            className={`h-6 w-6 cursor-pointer ${favoritedItems[item.id] ? 'splash-animation' : ''}`}/>
                    </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-3 flex justify-center py-10 space-x-4 items-center">
                            <Image src={SearchIcon} alt="Search Icon" width={50} height={50}/>
                            <div className="space-y-3">
                                <div>
                                    <p>Looks like we couldn't find what</p>
                                    <p>you were search for.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* TRY SOMETHING NEW */}
                {!isSearching && currentFilter === "Near You" && (
                    <>
                        <p className="font-bold text-xl my-12">TRY SOMETHING NEW</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                            {nearYouFood.map((item, index) => {
                                const food_id = new URLSearchParams({
                                    food_id: item.id,
                                }).toString();

                                return (
                                    <div key={index} className="relative">
                                        <Link href={`/kterings/${item.name}?${food_id}`}>
                                            <div
                                                className="w-full bg-gray-200 rounded-lg overflow-hidden h-72 sm:h-64 object-cover object-center">
                                                <Image
                                                    src={
                                                        item.images && item.images.length > 0
                                                            ? item.images[0].image_url
                                                            : Biryani
                                                    }
                                                    width={300}
                                                    height={100}
                                                    alt={item.name}
                                                    className="mx-auto rounded-lg w-full h-full object-cover object-center"
                                                />
                                            </div>
                                        </Link>
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="text-left">
                                                <p className="text-lg">{item.name}</p>
                                                {item.rating !== 0 && (
                                                    <StarRating rating={item.rating}/>
                                                )}
                                                {/* TODO: update the distance from the endpoint */}
                                                <p className="text-sm mt-1">00 min away</p>
                                            </div>

                                            <span onClick={() => toggleFavorite(item.id)}>
                          <HeartIconOutline className="h-6 w-6 cursor-pointer"/>
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
    );
}

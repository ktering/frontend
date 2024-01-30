"use client";
import { useUser } from "@clerk/nextjs";
import { useContext, useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import Biryani from "@/static/landing-page/biryani.png";
import Image from "next/image";
import StarRating from "@/components/starRating";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { FoodItem } from "@/types/shared/food";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useNotifications } from "@/components/notificationContext";
import { StatusContext } from "@/contexts/StatusContext";
import Food from "@/app/kterings/[food]/page";
import { Filter } from "lucide-react";

export default function Dashboard() {
    const { user } = useUser();

    const router = useRouter();
    const [ktererFood, setKtererFood] = useState<FoodItem[]>([]);
    const [pastFood, setPastFood] = useState<FoodItem[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [deleteMode, setDeleteMode] = useState(0);
    const [deleteDialogContent, setDeleteDialogContent] = useState('This action cannot be undone. This will permanently delete the post.');

    const { updateNotifications } = useNotifications();
    const globalStatus = useContext(StatusContext);

    useEffect(() => {
        if (!user) return;

        const getKtererFood = async () => {
            const accessToken = localStorage.getItem("accessToken");
            const apiURL = process.env.NEXT_PUBLIC_API_URL;
            try {
                const params = new URLSearchParams({ kterer: user.id.toString() });
                const response = await fetch(`${apiURL}/api/food?${params}`, {
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
                setKtererFood(data.data);
            } catch (error) {
                console.error(`Error: ${error}`);
            }
        };

        const getKtererPastFood = async () => {
            const accessToken = localStorage.getItem("accessToken");
            const apiURL = process.env.NEXT_PUBLIC_API_URL;
            try {
                const params = new URLSearchParams({ kterer: user.id.toString() });
                const response = await fetch(`${apiURL}/api/past_food?${params}`, {
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
                setPastFood(data.data);
            } catch (error) {
                console.error(`Error: ${error}`);
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
                    data.map(
                        (not: {
                            id: any;
                            data: { message: any };
                            read_at: string | number | Date;
                        }) => ({
                            id: not.id,
                            message: not.data.message,
                            read_at: not.read_at ? new Date(not.read_at) : null,
                        })
                    )
                );
            } catch (error) {
                console.error(`Error: ${error}`);
            }
        };

        getKtererFood().catch((error) => {
            console.error(`Error: ${error}`);
        });
        getKtererPastFood().catch((error) => {
            console.error(`Error: ${error}`);
        });
        getNotifications().catch((error) => {
            console.error(`Error: ${error}`);
        });
    }, [user]);

    const handleEditPost = (foodId: string) => {
        const food_id = new URLSearchParams({
            food_id: foodId,
        }).toString();
        router.push(`/kterer/edit-food?${food_id}`);
    };

    const handleRepostFood = (foodId: string, index: number) => {
        const repostFood = async () => {
            const accessToken = localStorage.getItem("accessToken");
            const apiURL = process.env.NEXT_PUBLIC_API_URL;
            try {
                const response = await fetch(`${apiURL}/api/food/${foodId}/repost`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    console.error(`Error: ${response.statusText}`);
                    return;
                }
                else {
                    setKtererFood([...ktererFood, pastFood[index]]);
                    setPastFood((pastFoods) => pastFoods.filter((food) => food.id !== foodId));
                }
            } catch (error) {
                console.error(`Error: ${error}`);
            }
        };

        repostFood().catch((error) => {
            console.error(`Error: ${error}`);
        });
    };
    const handleDeletePost = async (foodId: string) => {
        const apiURL = process.env.NEXT_PUBLIC_API_URL;
        const accessToken = localStorage.getItem("accessToken");
        await fetch(`${apiURL}/api/food/${foodId}?deleteMode=${deleteMode}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!deleteMode) { // not permanently delete
            setPastFood([...pastFood, ...(ktererFood.filter(food => food.id === foodId))]);
        }
        setKtererFood((currentFoods) =>
            currentFoods.filter((food) => food.id !== foodId)
        );
        setIsDialogOpen(false);
    };

    const openDeleteDialog = (foodId: string, deleteMode: number = 0) => {
        setDeleteMode(deleteMode);
        setPostToDelete(foodId);
        setIsDialogOpen(true);
    };

    if (globalStatus?.is_serving_time) {
        return (
            <>
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                {deleteMode === 1 ? 'This action cannot be undone. This will permanently delete the post.' : 'This will be a past food.'}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                                <button onClick={() => setIsDialogOpen(false)}>Cancel</button>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <button
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() =>
                                        postToDelete && handleDeletePost(postToDelete)
                                    }
                                >
                                    Delete
                                </button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <p className="font-bold text-xl mb-12">Your Posts</p>
                    {ktererFood.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                            {ktererFood.map((item, index) => {
                                const food_id = new URLSearchParams({
                                    food_id: item.id,
                                }).toString();

                                return (
                                    <div key={index} className="relative">
                                        <Link href={`/kterings/${item.name}?${food_id}`}>
                                            <div
                                                className="aspect-w-4 aspect-h-3 w-full bg-gray-200 rounded-lg overflow-hidden">
                                                <Image
                                                    src={
                                                        item.images && item.images.length > 0
                                                            ? item.images[0].image_url
                                                            : Biryani
                                                    }
                                                    alt="Food Image"
                                                    fill
                                                    className="object-cover object-center"
                                                />
                                            </div>
                                        </Link>

                                        <div className="flex justify-between items-center mt-2">
                                            <div className="text-left">
                                                <p className="text-lg">{item.name}</p>
                                                {item.rating !== 0 && <StarRating rating={item.rating} />}
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <EllipsisVerticalIcon className="h-6 w-6" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onSelect={() => handleEditPost(item.id)}>
                                                        Edit Post
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onSelect={() => openDeleteDialog(item.id)}
                                                    >
                                                        Delete Post
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p>You have not posted any food items yet</p>
                            <Link href="/kterer/post">
                                <p className="text-primary-color hover:underline mt-2 inline-block">
                                    Post Your Food
                                </p>
                            </Link>
                        </div>
                    )}
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <p className="font-bold text-xl mb-12">Past Posts</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                        {pastFood.map((item, index) => {
                            const food_id = new URLSearchParams({
                                food_id: item.id,
                            }).toString();

                            return (
                                <div key={index} className="relative">
                                    <div
                                        className="aspect-w-4 aspect-h-3 w-full bg-gray-200 rounded-lg overflow-hidden">
                                        <Image
                                            src={
                                                item.images && item.images.length > 0
                                                    ? item.images[0].image_url
                                                    : Biryani
                                            }
                                            alt="Food Image"
                                            fill
                                            className="object-cover object-center grayscale"
                                        />
                                    </div>

                                    <div className="flex justify-between items-center mt-2">
                                        <div className="text-left">
                                            <p className="text-lg">{item.name}</p>
                                            {item.rating !== 0 && <StarRating rating={item.rating} />}
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <EllipsisVerticalIcon className="h-6 w-6" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onSelect={() => handleRepostFood(item.id, index)}>
                                                    Repost
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onSelect={() => openDeleteDialog(item.id, 1)}
                                                >
                                                    Delete Permanently
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }
    else {
        return (<>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-red-200 px-3.5 py-5  text-red-700 text-center">
                        <h3 className="font-bold mb-4 center">Kterings is currently closed!</h3>
                        <h3 className="m-0 font-medium italic">Services end at 8pm daily. Come back tomorrow</h3>
                        <h3 className="m-0 font-medium italic">to order more of your favorites!</h3>
                    </div>

                </div>
            </div>
        </>);
    }
}

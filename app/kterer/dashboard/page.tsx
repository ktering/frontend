"use client";
import { useUser } from "@clerk/nextjs";
import { useContext, useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import Biryani from "@/static/landing-page/biryani.png";
import NoFoodIcon from "@/static/dashboard/no-item-post-food-icon.svg";
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
import { Button } from "@/components/ui/button";

export default function Dashboard() {
    const { user } = useUser();
    console.log(user);
    if (!user) {
        return null;
    }
    const router = useRouter();
    const [ktererFood, setKtererFood] = useState<FoodItem[]>([]);
    const [pastFood, setPastFood] = useState<FoodItem[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteMode, setDeleteMode] = useState(0);
    const [isAdminVerified, setIsAdminVerified] = useState(0);

    const { updateNotifications } = useNotifications();
    const globalStatus = useContext(StatusContext);

    useEffect(() => {
        if (!user) return;

        const getKtererAccountInfo = async () => {
            const accessToken = localStorage.getItem("accessToken");
            const apiURL = process.env.NEXT_PUBLIC_API_URL;
            try {
                const response = await fetch(`${apiURL}/api/user`, {
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
                setIsAdminVerified(data.user.kterer.admin_verified);
            } catch (error) {
                console.error("An error occurred:", error);
                return 0;
            }
        };
        getKtererAccountInfo();

        const getKtererFood = async () => {
            const accessToken = localStorage.getItem("accessToken");
            const apiURL = process.env.NEXT_PUBLIC_API_URL;

            setIsLoading(true);

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
            } finally {
                setIsLoading(false);
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
                            created_at: string | number | Date;
                            read_at: string | number | Date;
                        }) => ({
                            id: not.id,
                            message: not.data.message,
                            created_at: new Date(not.created_at),
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

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                {/* Example loading spinner */}
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-color"></div>
                <div>
                    <p className="text-primary-color mt-4">Please wait while we load your data...</p>
                </div>
            </div>
        );
    }

    if (isAdminVerified !== 1) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-red-200 px-3.5 py-5 text-red-700 text-center">
                        <h3 className="font-bold mb-4 center">Your account is not verified!</h3>
                        <h3 className="m-0 font-medium italic">Please wait till we verify your account.</h3>
                    </div>

                </div>
            </div>
        );
    }

    if (!globalStatus?.is_serving_time) {
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
                        <div className="flex justify-center pb-48 pt-28 space-x-8 items-center">
                            <Image src={NoFoodIcon} alt="No Food Icon" width={125} height={125} />
                            <div className="space-y-3">
                                <div>
                                    <p>Looks a little empty here...</p>
                                    <p>Why not try posting a food item?</p>
                                </div>
                                <Button
                                    className="bg-primary-color text-white w-full sm:w-auto hover:bg-primary-color-hover rounded-full">
                                    <Link href="/kterer/post">
                                        Post Food
                                    </Link>
                                </Button>
                            </div>
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

"use client";
import {useUser} from "@clerk/nextjs";
import {useEffect, useState} from "react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
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
import {useRouter} from "next/navigation";
import {FoodItem} from "@/types/shared/food";
import {EllipsisVerticalIcon} from "@heroicons/react/24/outline";
import Link from "next/link";
import {useNotifications} from "@/components/notificationContext";
import {Button} from "@/components/ui/button";

export default function Dashboard() {
    const {user} = useUser();
    console.log(user);
    if (!user) {
        return null;
    }
    const router = useRouter();
    const [ktererFood, setKtererFood] = useState<FoodItem[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);

    const {updateNotifications} = useNotifications();

    useEffect(() => {
        const getKtererFood = async () => {
            const accessToken = localStorage.getItem("accessToken");
            const apiURL = process.env.NEXT_PUBLIC_API_URL;
            try {
                const params = new URLSearchParams({kterer: user.id.toString()});
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
        getNotifications().catch((error) => {
            console.error(`Error: ${error}`);
        });
    }, []);

    const handleEditPost = (foodId: string) => {
        const food_id = new URLSearchParams({
            food_id: foodId,
        }).toString();
        router.push(`/kterer/edit-food?${food_id}`);
    };

    const handleDeletePost = async (foodId: string) => {
        const apiURL = process.env.NEXT_PUBLIC_API_URL;
        const accessToken = localStorage.getItem("accessToken");
        await fetch(`${apiURL}/api/food/${foodId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        setKtererFood((currentFoods) =>
            currentFoods.filter((food) => food.id !== foodId)
        );
        setIsDialogOpen(false);
    };

    const openDeleteDialog = (foodId: string) => {
        setPostToDelete(foodId);
        setIsDialogOpen(true);
    };

    return (
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
                                        {item.rating !== 0 && <StarRating rating={item.rating}/>}
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <EllipsisVerticalIcon className="h-6 w-6"/>
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
                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the
                                    post.
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
                </div>
            ) : (
                <div className="flex justify-center pb-48 pt-36  space-x-8 items-center">
                    <Image src={NoFoodIcon} alt="No Food Icon" width={125} height={125}/>
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
    );
}

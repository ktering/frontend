"use client";
import {useUser} from "@clerk/nextjs";
import {useEffect, useState} from "react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
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
} from "@/components/ui/alert-dialog"


export default function Dashboard() {
    const {user} = useUser();
    if (!user) {
        return null;
    }
    const [ktererFood, setKtererFood] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    useEffect(() => {
        const getKtererFood = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const apiURL = process.env.NEXT_PUBLIC_API_URL;
            const params = new URLSearchParams({kterer: user.id.toString()});
            const response = await fetch(`${apiURL}/api/food?${params}`, {
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
            setKtererFood(data.data);
        }

        getKtererFood();
    }, []);

    const handleDeletePost = async (foodId: string) => {
        const accessToken = localStorage.getItem('accessToken');
        await fetch(`http://localhost:8000/api/food/${foodId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        // Assuming you'll want to update your state after deletion:
        setKtererFood(currentFoods => currentFoods.filter(food => food.id !== foodId));
        // Close the dialog
        setIsDialogOpen(false);
    };

    const openDeleteDialog = (foodId: string) => {
        setPostToDelete(foodId);
        setIsDialogOpen(true);
    };


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p className="font-bold text-xl mb-12">Your Posts</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                {ktererFood.map((item, index) => (
                    <div key={index} className="relative">
                        {/* TODO: update the image from the endpoint */}
                        <Image src={Biryani} alt={item.name} width={300} height={300}
                               className="mx-auto rounded-lg w-full"/>
                        <div className="flex justify-between items-center mt-2">
                            <div className="text-left">
                                <p className="text-lg">{item.name}</p>
                                {/* TODO: update the rating here from the endpoint */}
                                <StarRating rating={5}/>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5"
                                         stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"/>
                                    </svg>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>Edit Post</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => openDeleteDialog(item.id)}>Delete
                                        Post</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}

                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the post.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                                <button onClick={() => setIsDialogOpen(false)}>Cancel</button>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <button className="bg-red-600 hover:bg-red-700"
                                        onClick={() => handleDeletePost(postToDelete)}>Delete
                                </button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}

"use client";
import React, {useEffect, useState} from "react";
import StarRating from "@/components/starRating";
import {HeartIcon} from "@heroicons/react/24/solid";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {Favourites} from "@/types/shared/favourites";
import Link from "next/link";

export default function Favourites() {
    const [favourites, setFavourites] = useState<Favourites[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<number | null>(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const apiURL = process.env.NEXT_PUBLIC_API_URL;
            try {
                const response = await fetch(`${apiURL}/api/favourites`, {
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
                setFavourites(data.kterers);
            } catch (error) {
                console.error(`Error: ${error}`);
            }
        }

        fetchFavorites().catch((error) => {
            console.error(`Error: ${error}`);
        });
    }, []);

    const deleteFavourite = async (id: number) => {
        const accessToken = localStorage.getItem('accessToken');
        const apiURL = process.env.NEXT_PUBLIC_API_URL;
        let response = await fetch(`${apiURL}/api/favourite/kterer/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        });

        if (!response.ok) {
            console.error(`Error: ${response.statusText}`);
            return;
        }

        let data = await response.json();
        setFavourites(data.kterers);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p className="font-bold text-xl mb-12">Saved Kterers</p>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will remove the Kterer from your Favourites.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <button onClick={() => setIsDialogOpen(false)}>Cancel</button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <button className="bg-red-600 hover:bg-red-700"
                                    onClick={() => postToDelete && deleteFavourite(postToDelete)}>Delete
                            </button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {favourites.length === 0 ? (
                <div className="text-center py-10">
                    <p className="">You have no saved kterers.</p>
                    <Link href="/kterings">
                        <p className="text-primary-color hover:underline mt-2 inline-block">
                            Explore Kterings
                        </p>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 place-items-center gap-8">
                    {favourites.map((favourite) => {
                            const kterer_id = new URLSearchParams({
                                kterer_id: favourite.id.toString(),
                            }).toString();

                            return (
                                <div key={favourite.id} className="w-40 flex items-center flex-col my-3">
                                    <Link href={`/kterings/kterer-profile/${favourite.id}?${kterer_id}`}>
                                        <img src={favourite.profile_image_url} alt="Kterer Profile Picture"
                                             className="rounded-full w-32 h-32 object-cover"/>
                                    </Link>
                                    <div className="flex w-full justify-between items-center mt-3">
                                        <div>
                                            <p className="text-lg font-semibold">{favourite.first_name} {favourite.last_name}</p>
                                            <StarRating rating={favourite.rating}/>
                                        </div>
                                        <div>
                                            <HeartIcon className="h-5 w-5 cursor-pointer text-primary-color"
                                                       onClick={() => {
                                                           setIsDialogOpen(true);
                                                           setPostToDelete(favourite.id);
                                                       }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    )}
                </div>
            )}
        </div>
    )
}

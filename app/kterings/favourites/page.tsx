"use client";

import {useEffect, useState} from "react";
import StarRating from "@/components/starRating";
import {HeartIcon} from "@heroicons/react/24/outline";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

export default function Favourites() {

    const [favourites, setFavourites] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    useEffect(() => {

        const fetchFavorites = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const apiURL = process.env.NEXT_PUBLIC_API_URL;
            let response = await fetch(`${apiURL}/api/favourites`, {
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

            let data = await response.json();

            setFavourites(data.kterers);
        }

        fetchFavorites();

    }, []);

    const deleteFavourite = async (id: string) => {
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
        <div className="p-12">
            <h3 className="text-3xl mb-10">Favourites</h3>

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
                                    onClick={() => deleteFavourite(postToDelete)}>Delete
                            </button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex flex-wrap gap-5">
                {favourites.map((favourite) => {
                        return (
                            <div key={favourite.id} className="w-40 flex items-center flex-col my-3">
                                <img src={favourite.profile_image_url} alt=""
                                     className="rounded-full w-32 h-32 object-cover"/>
                                <div className="flex w-full justify-between items-center mt-3">
                                    <div>
                                        <p>{favourite.first_name} {favourite.last_name}</p>
                                        <StarRating rating={favourite.rating}/>
                                    </div>
                                    <div>
                                        <HeartIcon className="h-4 w-4 cursor-pointer"
                                                   onClick={() => {
                                                       setIsDialogOpen(true);
                                                       setPostToDelete(favourite.id);
                                                   }
                                                   }/>
                                    </div>
                                </div>

                            </div>
                        )
                    }
                )}
            </div>
        </div>
    )
}

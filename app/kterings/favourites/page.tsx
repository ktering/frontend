"use client";

import {useEffect, useState} from "react";
import StarRating from "@/components/starRating";

export default function Favourites() {

    const [favourites, setFavourites] = useState([]);

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

    return (
        <div className="p-12">
            <h3 className="text-3xl mb-10">Favourites</h3>

            {favourites.map((favourite) => {
                    return (
                        <div key={favourite.id} className="w-52 flex items-center flex-col my-3">
                            <img src={favourite.profile_image_url} alt="" className="rounded-full w-32 h-32 object-cover"/>
                            <p>{favourite.first_name} {favourite.last_name}</p>
                            <StarRating rating={favourite.rating}/>
                        </div>
                    )
                }
            )}

        </div>
    )
}

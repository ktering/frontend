import React from 'react';
import 'font-awesome/css/font-awesome.min.css';

export default function StarRating({rating}: { rating: number }) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<i key={i} className="fa fa-star text-yellow-400"/>);
        } else {
            stars.push(<i key={i} className="fa fa-star text-gray-300"/>);
        }
    }
    return <div className="flex">{stars}</div>;
}

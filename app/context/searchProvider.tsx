"use client";
import {ReactNode, useState} from 'react';
import {SearchContext} from "./searchContext";

export const SearchProvider = ({children}: {
    children: ReactNode
}) => {
    const [searchInput, setSearchInput] = useState('');

    return (
        <SearchContext.Provider value={{searchInput, setSearchInput}}>
            {children}
        </SearchContext.Provider>
    );
}
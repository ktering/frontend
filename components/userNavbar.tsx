"use client";
import {useContext, useEffect, useState} from "react";
import {
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    BellIcon,
    ChevronDownIcon,
    HeartIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    QuestionMarkCircleIcon,
    ShoppingBagIcon,
    ShoppingCartIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline'
import Logo from "@/static/red-logo.svg"
import Image from "next/image";
import Link from "next/link";
import {Sheet, SheetContent, SheetTrigger,} from "@/components/ui/sheet"
import {useClerk} from "@clerk/clerk-react";
import {useRouter} from 'next/navigation'
import {Input} from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useCart from "@/app/hooks/useCart";
import AddressPopup from "@/components/addressPopup";
import {CartItem} from "@/types/hooks/useCart";
import {fetchHomeAddress} from "@/app/hooks/fetchAddress";
import {SearchContext} from "@/app/context/searchContext";

export default function UserNavbar() {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
    const {signOut, user} = useClerk();
    const router = useRouter();
    const isKterer = user?.publicMetadata?.ktererSignUpCompleted === true;
    let {cartItems, setCartItems, updateItemQuantity, removeItemFromCart, useLocalStorageCart} = useCart();
    const cartLength = useLocalStorageCart();
    const [savedAddress, setSavedAddress] = useState('');
    const [addressChanged, setAddressChanged] = useState(false);

    const contextValue = useContext(SearchContext);
    if (!contextValue) {
        return null;
    }
    const {searchInput, setSearchInput} = contextValue;

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };

    const toggleSideBar = () => {
        setIsSideBarOpen(!isSideBarOpen);
    }

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    }

    const toggleAddressPopup = () => setIsAddressPopupOpen(!isAddressPopupOpen);

    useEffect(() => {
        if (user) {
            fetchHomeAddress(setSavedAddress, user);
            setAddressChanged(false);
        }
    }, [addressChanged, user]);


    useEffect(() => {
        if (isCartOpen) {
            const storedCart = localStorage.getItem('cart');
            setCartItems(storedCart ? JSON.parse(storedCart) : []);
        }
    }, [isCartOpen]);

    const incrementQuantity = (item: CartItem) => {
        const maxQuantity = parseInt(item.maxQuantity, 10);
        if (item.quantity < maxQuantity) {
            updateItemQuantity(item.id, item.size, item.quantity + 1);
        }
    };

    const decrementQuantity = (item: CartItem) => {
        if (item.quantity > 1) {
            updateItemQuantity(item.id, item.size, item.quantity - 1);
        } else {
            removeItemFromCart(item.id, item.size); // Use removeItemFromCart to remove item
        }
    };

    const USER_SIDEBAR_ITEMS = [
        {name: "Home", icon: <HomeIcon className="h-6 w-6"/>, href: "/kterings"},
        {name: "Orders", icon: <ShoppingBagIcon className="h-6 w-6"/>, href: "/kterings"},
        {
            name: "Account",
            icon: <UserCircleIcon className="h-6 w-6"/>,
            href: isKterer ? "/kterer/account" : "/consumer/account"
        },
        {name: "Saved Kterers", icon: <HeartIcon className="h-6 w-6"/>, href: "/kterings/favourites"},
        {name: "Help", icon: <QuestionMarkCircleIcon className="h-6 w-6"/>, href: "/kterings"},
        {name: "Sign Out", icon: <ArrowLeftOnRectangleIcon className="h-6 w-6"/>, href: "/kterings"},
    ];

    const signOutF = () => {
        signOut()
            .then(() => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('cart');
                router.push('/');
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <>
            <div className="border-b">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-24 justify-between">
                        <div className="flex items-center">
                            {/* Hamburger Menu Button */}
                            <Sheet>
                                <SheetTrigger onClick={toggleSideBar}>
                                    <div
                                        className="relative inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-color md:mr-4">
                                        <Bars3Icon className="w-6 h-6"/>
                                    </div>
                                </SheetTrigger>
                            </Sheet>

                            {/* Logo */}
                            <div className="flex flex-shrink-0 items-center">
                                <Link href="/">
                                    <Image
                                        className="h-16 w-auto"
                                        src={Logo}
                                        alt="Kterings Logo"
                                    />
                                </Link>
                            </div>

                            <button onClick={toggleAddressPopup}>
                                <div className="flex space-x-2 ml-8">
                                    <MapPinIcon className="w-6 h-6 text-primary-color"/>
                                    <div>{savedAddress || "Saved Address"}</div>
                                    <ChevronDownIcon className="w-6 h-6 text-primary-color"/>
                                </div>
                            </button>

                            <AddressPopup
                                isAddressPopupOpen={isAddressPopupOpen}
                                setIsAddressPopupOpen={setIsAddressPopupOpen}
                                setAddressChanged={setAddressChanged}
                            />

                            {/* Buttons */}
                            {/*<div className="flex ml-8">*/}
                            {/*    <Button*/}
                            {/*        className="border rounded-full bg-white hover:bg-gray-50 px-4 py-2.5 font-semibold text-primary-color shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color">Pickup</Button>*/}
                            {/*    <Button*/}
                            {/*        className="border rounded-full bg-white hover:bg-gray-50 px-4 py-2.5 font-semibold text-primary-color shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"*/}
                            {/*    >Delivery</Button>*/}
                            {/*</div>*/}

                        </div>
                        <div className="flex items-center">
                            {/* Search bar */}
                            <div className="relative w:40 sm:w-80 mr-4">
                                {/* Icon */}
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="w-5 h-5"/>
                                </div>
                                {/* Input */}
                                <Input
                                    type="text"
                                    className="rounded-full pl-10 pr-3 py-2"
                                    placeholder="Search Kterers, Dishes"
                                    value={searchInput}
                                    onChange={handleSearchInputChange}
                                />
                            </div>

                            {/* Notification Icon */}
                            {/* TODO: align the icons to the center in mobile view */}
                            <div className="md:mr-4 md:flex md:flex-shrink-0 md:items-center space-x-2">
                                <div className="sm:flex sm:flex-end">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger> <BellIcon className="h-6 w-6"
                                                                        aria-hidden="true"/></DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-64">
                                            <DropdownMenuLabel>Your Notifications</DropdownMenuLabel>
                                            <DropdownMenuSeparator/>
                                            <div className="p-2 border-b">
                                                <p>Your order has been placed for Biryani</p>
                                            </div>

                                            <div className="p-2 border-b">
                                                <p>Your order has been placed for Chicken</p>
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                {/* Cart Button */}
                                <Sheet>
                                    <SheetTrigger onClick={toggleCart}>
                                        <div
                                            className="relative rounded-full bg-white p-1 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-offset-2">
                                            <span className="absolute -inset-1.5"/>
                                            <span className="sr-only">Check Shopping Cart</span>
                                            <ShoppingCartIcon className="h-6 w-6 z-100" aria-hidden="true"/>
                                            {/* Badge showing the number of items in the cart */}
                                            {cartLength > 0 && (
                                                <span
                                                    className="flex items-center justify-center absolute -top-2 -right-2 h-6 w-6 text-xs font-semibold rounded-full bg-primary-color text-white">
                                                    {cartItems.length}
                                                </span>
                                            )}
                                        </div>
                                    </SheetTrigger>
                                </Sheet>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Sidebar Component */}
            <Sheet open={isSideBarOpen} onOpenChange={setIsSideBarOpen}>
                <SheetContent side="left">
                    <div className="py-8 space-y-8">
                        {USER_SIDEBAR_ITEMS.map((item) => (
                            <Link key={item.name} href={item.href}>
                                <div className="flex items-center space-x-5 hover:bg-gray-100 rounded py-4 border-b"
                                     onClick={item.name === "Sign Out" ? signOutF : toggleSideBar}
                                >
                                    {item.icon}
                                    <span className="font-bold">{item.name}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
            {/* Cart Component */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetContent side="right">
                    <div className="text-center border-b pb-4">
                        <div className="pb-4 text-2xl font-bold text-center space-y-8">
                            Your Cart
                        </div>
                        <button
                            className="rounded-full bg-primary-color px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-primary-color-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"
                        >Checkout
                        </button>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <p>Your cart is empty</p>
                        </div>
                    ) : (

                        <ul role="list" className="divide-y divide-gray-200">
                            {cartItems.map((item) => {
                                const capitalizedSize = item.size.charAt(0).toUpperCase() + item.size.slice(1);

                                return (
                                    <div key={item.id + item.size} className="flex justify-between items-center">
                                        <li className="py-4 space-y-2">
                                            <div>{item.name}</div>
                                            <div className="text-sm">{capitalizedSize}</div>
                                            <div className="font-bold">CAD ${item.price}</div>
                                        </li>

                                        <div
                                            className="flex items-center justify-center border border-gray-200 rounded-full h-12">
                                            <button
                                                onClick={() => decrementQuantity(item)}
                                                type="button"
                                                className="flex items-center justify-center w-10 h-10 text-gray-600 transition hover:opacity-75"
                                            >
                                                {/* Change icon to trash if quantity is 1 */}
                                                {item.quantity > 1 ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 24 24"
                                                         strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="M18 12H6"/>
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 24 24"
                                                         strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                                    </svg>
                                                )}
                                            </button>
                                            <input
                                                type="number"
                                                id={`quantity_${item.id}_${item.size}`}
                                                value={item.quantity}
                                                readOnly
                                                className="h-10 w-16 text-center border-transparent appearance-none outline-none"
                                            />
                                            <button
                                                onClick={() => incrementQuantity(item)}
                                                type="button"
                                                className="flex items-center justify-center w-10 h-10 text-gray-600 transition hover:opacity-75"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M12 6v12m6-6H6"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </ul>
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}

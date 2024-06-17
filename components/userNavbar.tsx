"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  HeartIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MinusSmallIcon,
  PlusSmallIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Logo from "@/static/red-logo.svg";
import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useClerk } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useCart from "@/app/hooks/useCart";
import AddressPopup from "@/components/addressPopup";
import { CartItem } from "@/types/hooks/useCart";
import { fetchHomeAddress } from "@/app/hooks/fetchAddress";
import { SearchContext } from "@/contexts/SearchContext";
import { useCartCount } from "@/contexts/CartContext";
import { useNotifications } from "./notificationContext";
import { StatusContext } from "@/contexts/StatusContext";
import { formatDistanceToNow } from "date-fns";

export default function UserNavbar() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
  const { signOut, user } = useClerk();
  const router = useRouter();
  const isKterer = user?.publicMetadata?.ktererSignUpCompleted === true;
  let {
    cartItems,
    setCartItems,
    updateItemQuantity,
    removeItemFromCart,
    useLocalStorageCart,
  } = useCart();
  const cartLength = useLocalStorageCart();
  const [savedAddress, setSavedAddress] = useState("");
  // Added status to obtain the complete user address
  const [fullAddress, setFullAddress] = useState("");
  const [addressChanged, setAddressChanged] = useState(false);
  const { cartCount } = useCartCount();
  const { notifications, updateNotifications } = useNotifications();
  const isMobile = window.innerWidth <= 768;
  const globalStatus = useContext(StatusContext);

  const contextValue = useContext(SearchContext);
  const { searchInput, setSearchInput } = contextValue || {
    searchInput: "",
    setSearchInput: () => {},
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (setSearchInput) {
      setSearchInput(event.target.value);
    }
  };

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleAddressPopup = () => setIsAddressPopupOpen(!isAddressPopupOpen);

  useEffect(() => {
    if (user) {
      // Function is modified by adding a new variable that returns the complete address.
      fetchHomeAddress(setSavedAddress, setFullAddress, user);
      setAddressChanged(false);
    }
  }, [addressChanged, user]);

  useEffect(() => {
    if (isCartOpen) {
      const storedCart = localStorage.getItem("cart");
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
    { name: "Home", icon: <HomeIcon className="h-6 w-6" />, href: "/kterings" },
    {
      name: "Orders",
      icon: <ShoppingBagIcon className="h-6 w-6" />,
      href: "/consumer/orders",
    },
    {
      name: "Account",
      icon: <UserCircleIcon className="h-6 w-6" />,
      href: isKterer ? "/kterer/account" : "/consumer/account",
    },
    {
      name: "Saved Kterers",
      icon: <HeartIcon className="h-6 w-6" />,
      href: "/kterings/favourites",
    },
    {
      name: "Help",
      icon: <QuestionMarkCircleIcon className="h-6 w-6" />,
      href: "/help",
    },
    {
      name: "Sign Out",
      icon: <ArrowLeftOnRectangleIcon className="h-6 w-6" />,
      href: "/kterings",
    },
  ];

  if (isMobile) {
    const addressItem = {
      name: "Address",
      href: "#",
      icon: <MapPinIcon className="h-6 w-6" />,
      onClick: toggleAddressPopup, // Function to open the address popup
    };

    USER_SIDEBAR_ITEMS.splice(1, 0, addressItem);
  }

  // render search input if contextValue is not null
  const renderSearchInput = () => {
    if (contextValue) {
      return (
        <Input
          type="text"
          className="rounded-full pl-10 pr-3 py-2"
          placeholder="Search Kterers, Dishes"
          value={searchInput}
          onChange={handleSearchInputChange}
        />
      );
    }
    return null;
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (fullAddress == "") {
      alert("In the option Saved Address you must add your address");
      return;
    }

    // Process cart items to extract the real food IDs
    const cartForBackend = cartItems.map((item) => {
      const lastIndex = item.id.lastIndexOf("-"); // Find the last hyphen
      const realFoodId = item.id.substring(0, lastIndex); // Get the string before the last hyphen
      return {
        food_id: realFoodId,
        quantity: item.quantity,
        size: item.size,
        price: item.price,
      };
    });

    const cartWithAddress = {
      cartItems: cartForBackend,
      addressUser: fullAddress,
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      const apiURL = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${apiURL}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ cart: cartWithAddress }),
      });

      // Session data are deleted from the storage if they exist.
      localStorage.removeItem("myData");

      const { url, session_data, product_stored } = await response.json();

      console.log("url ", url);
      console.log("session_data ", session_data);
      console.log("product_stored ", product_stored);

      // Redirect to Stripe Checkout
      if (url && url.message) {
        alert(url.message);
      } else {
        localStorage.setItem("myData", JSON.stringify(session_data));
        localStorage.setItem("productData", JSON.stringify(product_stored));
        window.location.href = url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("There was an error processing your checkout.");
    }
  };

  const signOutF = () => {
    signOut()
      .then(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("cart");
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const markReadNotification = async (index: number) => {
    const accessToken = localStorage.getItem("accessToken");
    const apiURL = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(
        `${apiURL}/api/notifications/mark_read/${notifications[index].id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        console.error(`Error: ${response.statusText}`);
        return;
      }

      const data = await response.json();

      const tempNots = [...notifications];

      tempNots[index].read_at = data.read_at;

      updateNotifications(tempNots);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleNotificationClick = (index: number) => () => {
    markReadNotification(index)
      .then(() => {
        if (notifications[index].message.startsWith("You have")) {
          router.push("/kterer/earnings");
        }
        if (notifications[index].message.startsWith("Your order")) {
          router.push("/consumer/orders");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-24 justify-between">
            <div className="flex items-center">
              {/* Hamburger Menu Button */}
              <Sheet>
                <SheetTrigger onClick={toggleSideBar}>
                  <div className="relative inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-color md:mr-4">
                    <Bars3Icon className="w-6 h-6" />
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

              {/*<button onClick={toggleAddressPopup}>*/}
              {/*    <div className="flex space-x-2 ml-8">*/}
              {/*        <MapPinIcon className="w-6 h-6 text-primary-color"/>*/}
              {/*        <div>{savedAddress || "Saved Address"}</div>*/}
              {/*        <ChevronDownIcon className="w-6 h-6 text-primary-color"/>*/}
              {/*    </div>*/}
              {/*</button>*/}

              <button onClick={toggleAddressPopup}>
                <div className="hidden sm:flex sm:space-x-2 ml-8">
                  <MapPinIcon className="w-6 h-6 text-primary-color" />
                  <div className="hidden md:block">
                    {savedAddress || "Saved Address"}
                  </div>
                  <ChevronDownIcon className="w-6 h-6 text-primary-color hidden md:block" />
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
              {!globalStatus?.is_serving_time && (
                <div className="text-primary-color mr-4 font-bold">
                  Open from{" "}
                  <span className="underline-offset-1">8am to 8pm</span> daily!
                </div>
              )}
              {/* Search bar */}
              <div className="relative w:40 md:w:60 lg:w-80 mr-4">
                {/* Icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </div>
                {/* Input */}
                <Input
                  type="text"
                  className="rounded-full pl-10 pr-3 py-2"
                  placeholder="Search Kterers, Dishes"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />
                {/*{renderSearchInput()}*/}
              </div>

              {/* Notification Icon */}
              <div className="flex items-center md:mr-4 md:flex md:flex-shrink-0 md:items-center space-x-2">
                <div className="flex flex-end relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      {" "}
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                      {notifications.filter((not) => not.read_at === null)
                        .length ? (
                        <span className="flex items-center justify-center absolute -top-3 -right-2 h-6 w-6 text-xs font-semibold rounded-full bg-primary-color text-white">
                          {
                            notifications.filter((not) => not.read_at === null)
                              .length
                          }
                        </span>
                      ) : (
                        <></>
                      )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-96 rounded-2xl">
                      {notifications.map((notification, index) => (
                        <div
                          key={index}
                          className="p-4 border-b cursor-pointer flex"
                          onClick={handleNotificationClick(index)}
                        >
                          <div
                            className={`rounded-full w-2 h-2 mt-2 mr-3 ${
                              notification.read_at
                                ? "bg-gray-500"
                                : "bg-primary-color"
                            }`}
                            style={{
                              minWidth: "0.5rem",
                              minHeight: "0.5rem",
                            }} // Ensure minimum width and height
                          />
                          <div>
                            <p
                              className={`${
                                notification.read_at ? "" : "font-bold"
                              }`}
                            >
                              {notification.message}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDistanceToNow(
                                new Date(notification.created_at),
                                { addSuffix: true }
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                      {notifications.length ? (
                        <></>
                      ) : (
                        <div className="p-2 text-center">No notifications</div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {/* Cart Button */}
                <Sheet>
                  <SheetTrigger onClick={toggleCart}>
                    <div className="relative rounded-full bg-white p-1 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-offset-2">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Check Shopping Cart</span>
                      <ShoppingCartIcon
                        className="h-6 w-6 z-100"
                        aria-hidden="true"
                      />
                      {/* Badge showing the number of items in the cart */}
                      {cartCount > 0 && (
                        <span className="flex items-center justify-center absolute -top-2 -right-2 h-6 w-6 text-xs font-semibold rounded-full bg-primary-color text-white">
                          {cartCount}
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
                <div
                  className="flex items-center space-x-5 hover:bg-gray-100 rounded py-4 border-b"
                  onClick={() => {
                    if (item.name === "Sign Out") {
                      signOutF();
                    } else if (item.name === "Address") {
                      toggleAddressPopup();
                    } else {
                      toggleSideBar();
                    }
                    setIsSideBarOpen(false);
                  }}
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
              onClick={handleCheckout}
              className="rounded-full bg-primary-color px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-primary-color-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"
            >
              Checkout
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p>Your cart is empty</p>
            </div>
          ) : (
            <ul role="list" className="divide-y divide-gray-200">
              {cartItems.map((item) => {
                const capitalizedSize =
                  item.size.charAt(0).toUpperCase() + item.size.slice(1);

                return (
                  <div
                    key={item.id + item.size}
                    className="flex justify-between items-center"
                  >
                    <li className="py-4 space-y-2">
                      <div>{item.name}</div>
                      <div className="text-sm">{capitalizedSize}</div>
                      <div className="font-bold">CAD ${item.price}</div>
                    </li>

                    <div className="flex items-center justify-center border border-gray-200 rounded-full h-12">
                      <button
                        onClick={() => decrementQuantity(item)}
                        type="button"
                        className="flex items-center justify-center w-10 h-10 text-gray-600 transition hover:opacity-75"
                      >
                        {item.quantity > 1 ? (
                          <MinusSmallIcon className="w-6 h-6" />
                        ) : (
                          <TrashIcon className="w-5 h-5" />
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
                        <PlusSmallIcon className="h-6 w-6" />
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
  );
}

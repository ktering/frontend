"use client";
import React, { SetStateAction, useEffect, useState } from "react";
import StarRating from "@/components/starRating";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter, useSearchParams } from "next/navigation";
import useCart from "@/app/hooks/useCart";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircleIcon,
  MinusSmallIcon,
  PlusSmallIcon,
  StarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "@/components/ui/use-toast";
import { FoodItem } from "@/types/shared/food";
import { Reviews } from "@/types/shared/reviews";
import { CartItem } from "@/types/hooks/useCart";
import { KtererInfo } from "@/types/shared/user";

import { useUser } from "@clerk/nextjs";
import { useCartCount } from "@/components/cartContext";

const formSchema = z.object({
  rating: z.number().min(1).max(5),
  review: z.string().min(10).max(300),
});

export default function Food() {
  const { user } = useUser();
  if (!user) {
    return null;
  }
  // TODO: fix this default image
  const searchParams = useSearchParams();
  const foodIdMainPage = searchParams.get("food_id");
  const [foodDetails, setFoodDetails] = useState<FoodItem>();
  const [reviews, setReviews] = useState<Reviews[]>();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("small");
  // TODO: fix this main image
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);
  const { addItemToCart, cartItems } = useCart();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [ktererInfo, setKtererInfo] = useState<KtererInfo | null>(null);

  const hasReviews = reviews && reviews.length > 0;
  const router = useRouter();

  const { cartCount, updateCartCount } = useCartCount();

  useEffect(() => {
    if (
      !foodIdMainPage ||
      foodIdMainPage === "" ||
      foodIdMainPage === "undefined" ||
      foodIdMainPage === "null"
    ) {
      router.push("/kterings");
      return;
    }

    const getFoodInfo = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const apiURL = process.env.NEXT_PUBLIC_API_URL;
      let response = await fetch(`${apiURL}/api/food/${foodIdMainPage}`, {
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

      let data = await response.json();

      if (data.data && data.data.quantities) {
        const sizePreference = ["small", "medium", "large"];

        const firstAvailableSize = sizePreference.find((size) =>
          data.data.quantities.some((q: { size: string }) => q.size === size)
        );

        if (firstAvailableSize) {
          setSelectedSize(firstAvailableSize);
        }
      }

      setFoodDetails(data.data);
      if (data.data && data.data.images && data.data.images.length > 0) {
        setMainImage(data.data.images[0].image_url);
      }

      response = await fetch(`${apiURL}/api/food/reviews/${data.data.id}`, {
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

      data = await response.json();
      setReviews(data.data);
    };

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
        setKtererInfo(data.user);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    getKtererAccountInfo().catch((error) => {
      console.error("An error occurred:", error);
    });

    getFoodInfo().catch((error) => {
      console.error(`Error: ${error}`);
    });
  }, [foodIdMainPage]);

  const formatDate = (date: string) => {
    if (date.trim() !== "") {
      const dateObj = new Date(date);
      if (!isNaN(dateObj.valueOf())) {
        return formatDistanceToNow(dateObj, { addSuffix: true });
      }
    }
    return "Invalid date";
  };

  const handleThumbnailClick = (imageSrc: string) => {
    setMainImage(imageSrc);
  };

  const incrementQuantity = () => {
    const currentSizeDetails = foodDetails?.quantities.find(
      (q: { size: string }) => q.size === selectedSize
    );
    if (
      currentSizeDetails &&
      quantity < parseInt(currentSizeDetails.quantity)
    ) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    }
  };
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const selectSize = (size: SetStateAction<string>) => {
    const sizeDetails = foodDetails?.quantities.find(
      (q: { size: SetStateAction<string> }) => q.size === size
    );
    if (sizeDetails) {
      setSelectedSize(size);
      setQuantity(1);
    }
  };

  const addToCart = () => {
    console.log(foodDetails);
    if (cartItems.length) {
      let index = cartItems.findIndex(
        (item) => item.kterer_id !== foodDetails?.kterer_id
      );

      if (index >= 0 || foodDetails?.kterer_id === undefined) {
        toast({
          description: (
            <>
              <div className="flex items-center">
                <ExclamationTriangleIcon className="w-6 h-6 inline-block align-text-bottom mr-2 text-red-400" />
                You are allowed to buy food from only 1 keterer in one session
              </div>
            </>
          ),
          duration: 3000,
        });
        return;
      }
    }
    const maxQuantityItem = foodDetails?.quantities.find(
      (quantityItem) => quantityItem.size === selectedSize
    );
    const priceItem = foodDetails?.quantities.find(
      (quantityItem) => quantityItem.size === selectedSize
    );

    const cartItem: CartItem = {
      id: `${foodDetails?.id}-${Date.now()}`,
      name: foodDetails?.name || "",
      size: selectedSize,
      quantity: quantity,
      maxQuantity: maxQuantityItem?.quantity || "0",
      price: priceItem?.price || "0",
      kterer_id: foodDetails?.kterer_id,
    };

    addItemToCart(cartItem);

    toast({
      description: (
        <>
          <div className="flex items-center">
            <CheckCircleIcon className="w-6 h-6 inline-block align-text-bottom mr-2 text-green-400" />
            Food added to cart
          </div>
        </>
      ),
      duration: 3000,
    });

    updateCartCount(cartCount + 1);
  };

  const renderSizeButton = (size: string) => {
    const isSelected = selectedSize === size;
    const isAvailable = foodDetails?.quantities.some((q) => q.size === size);
    const capitalizedSize = size.charAt(0).toUpperCase() + size.slice(1);

    return isAvailable ? (
      <button
        onClick={() => selectSize(size)}
        className={`border rounded-full px-4 py-2.5 font-semibold text-primary-color shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color ${
          isSelected
            ? "bg-primary-color text-white hover:bg-primary-color-hover"
            : "bg-white hover:bg-gray-50"
        }`}
      >
        {capitalizedSize}
      </button>
    ) : null;
  };

  const allSizesOutOfStock = () => {
    return foodDetails?.quantities.every((q) => parseInt(q.quantity) === 0);
  };

  const isOutOfStock = allSizesOutOfStock();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 3,
      review: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const accessToken = localStorage.getItem("accessToken");
    const apiURL = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(
      `${apiURL}/api/review/food/${foodDetails?.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(values),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error ${response.status}: ${errorData.message}`);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: errorData.message,
      });
      return;
    }

    if (response.ok) {
      setIsReviewModalOpen(false);
      // if (reviews && reviews.length > 0) {
      // TODO: add the names from the database, for now its from clerk
      const newReview: Reviews = {
        ...values,
        user: {
          first_name: user?.firstName,
          // first_name: reviews[0].user.first_name,
          last_name: user?.lastName,
          // last_name: reviews[0].user.last_name,
        },
        created_at: new Date().toISOString(),
      };
      setReviews((currentReviews) => [...(currentReviews || []), newReview]);
      form.reset();
      toast({
        description: (
          <>
            <div className="flex items-center">
              <CheckCircleIcon className="w-6 h-6 inline-block align-text-bottom mr-2 text-green-400" />
              Review Successfully Added!
            </div>
          </>
        ),
      });
      // }
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      console.log("hi");
      const leftDiv = document.getElementById("left-side-image");
      const rightDiv = document.getElementById("right-side");

      if (leftDiv && rightDiv) {
        // console.log(leftDiv.)
        // const longDivBottomPosition = rightDiv.getBoundingClientRect().bottom;
        // if (longDivBottomPosition >= window.innerHeight) {
        //   leftDiv.style.top = `${window.scrollY}px`;
        // }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div id="left-side-image" className="col-span-1">
            <div className="w-full h-96 overflow-hidden rounded-lg">
              <img
                src={mainImage}
                alt="Main Product"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex mt-4 space-x-2">
              {foodDetails?.images.map((image, index) => (
                <img
                  key={image.id}
                  src={image.image_url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-24 h-24 object-cover cursor-pointer rounded-lg"
                  onClick={() => handleThumbnailClick(image.image_url)}
                />
              ))}
            </div>
          </div>

          <div id="right-side">
            <h1 className="text-3xl font-bold">{foodDetails?.name}</h1>
            {foodDetails?.rating !== 0 && foodDetails?.rating !== undefined && (
              <StarRating rating={foodDetails?.rating} />
            )}
            <div className="mb-2 mt-2 space-x-2 space-y-2">
              {foodDetails?.halal !== "No" ? (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                  Halal - Hand Slaughtered
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                  Non-Halal
                </span>
              )}
              {foodDetails?.contains_nuts && (
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                  Contains Nuts
                </span>
              )}
              {foodDetails?.kosher && (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                  Kosher
                </span>
              )}
              {foodDetails?.vegetarian &&
                foodDetails?.vegetarian !== "None" && (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    {foodDetails.vegetarian}
                  </span>
                )}
              {foodDetails?.desserts && foodDetails?.desserts !== "None" && (
                <span className="inline-flex items-center rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-700">
                  {foodDetails.desserts}
                </span>
              )}
              {foodDetails?.meat_type &&
                foodDetails?.meat_type !== "None" &&
                foodDetails?.meat_type !== "Other" && (
                  <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                    {foodDetails.meat_type}
                  </span>
                )}

              {/* Conditionally render the ethnic type badge */}
              {foodDetails?.ethnic_type &&
                foodDetails?.ethnic_type !== "None" &&
                foodDetails?.ethnic_type !== "Other" && (
                  <span className="inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium text-gray-800 border-gray-300">
                    {foodDetails.ethnic_type}
                  </span>
                )}
            </div>
            <p className="text-lg mb-6 mt-4 font-bold">
              $
              {selectedSize && foodDetails
                ? foodDetails.quantities.find(
                    (q: { size: string }) => q.size === selectedSize
                  )?.price
                : "Loading..."}
            </p>
            <div className="flex flex-col space-y-2">
              {!isOutOfStock ? <p>Size</p> : <p>No Sizes Available</p>}
              <div className="my-2 space-x-2">
                {["small", "medium", "large"].map((size) =>
                  renderSizeButton(size)
                )}
              </div>
            </div>
            <div className="flex flex-col items-start space-y-2 mt-6 mb-8">
              <p>Quantity</p>
              <div className="flex items-center justify-center border border-gray-200 rounded-full">
                <button
                  onClick={decrementQuantity}
                  type="button"
                  className="flex items-center justify-center w-10 h-10 text-gray-600 transition hover:opacity-75"
                >
                  <MinusSmallIcon className="w-6 h-6" />
                </button>
                <input
                  type="number"
                  id="Quantity"
                  value={quantity}
                  readOnly
                  onChange={(e) =>
                    setQuantity(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="h-10 w-16 text-center border-transparent appearance-none outline-none"
                />
                <button
                  onClick={incrementQuantity}
                  type="button"
                  className="flex items-center justify-center w-10 h-10 text-gray-600 transition hover:opacity-75"
                >
                  <PlusSmallIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            {!isOutOfStock ? (
              <button
                disabled={foodDetails?.kterer_id === ktererInfo?.kterer?.id}
                onClick={addToCart}
                className={
                  foodDetails?.kterer_id === ktererInfo?.kterer?.id
                    ? "rounded-full w-full bg-gray-400 px-4 py-2.5 font-semibold text-white shadow-sm"
                    : "rounded-full w-full bg-primary-color hover:bg-primary-color-hover px-4 py-2.5 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"
                }
              >
                Add to Cart
              </button>
            ) : (
              <button
                disabled
                className="rounded-full w-full bg-gray-400 px-4 py-2.5 font-semibold text-white shadow-sm"
              >
                Out of Stock
              </button>
            )}
            <div className="my-8">
              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Description</AccordionTrigger>
                  <AccordionContent className="text-base">
                    {foodDetails?.description}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Ingredients</AccordionTrigger>
                  <AccordionContent className="text-base">
                    {foodDetails?.ingredients.split(/\s+/).join(", ")}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        <div className="pt-12">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xl my-12">Recent Reviews</h3>
            {foodDetails?.kterer_id !== ktererInfo?.kterer?.id && (
              <Button
                className="rounded-full border bg-white hover:bg-white px-4 py-2.5 font-semibold text-primary-color shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"
                onClick={() => setIsReviewModalOpen(true)}
              >
                Write a review
              </Button>
            )}
          </div>
          {hasReviews ? (
            reviews?.map((review) => (
              <div
                key={review.id}
                className="my-2 flex items-start border-b pb-4"
              >
                <div>
                  <div className="flex items-center my-2 font-bold">
                    <p>
                      {review?.user?.first_name} {review?.user?.last_name}
                    </p>
                  </div>
                  <div className="flex items-center my-3">
                    <StarRating rating={review?.rating} />
                    <span className={`mx-2 text-gray-300`}>|</span>
                    <p className="text-sm text-gray-500">
                      {formatDate(review?.created_at)}
                    </p>
                  </div>
                  <p>{review.review}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="my-2 flex items-start border-b pb-4">
              <p className="text-gray-500">No reviews yet</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{foodDetails?.name} Food Review</DialogTitle>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <Controller
                  name="rating"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <div className="flex flex-col space-y-1 mt-8">
                        <div className="font-semibold mb-2">Rating</div>
                        <div className="space-x-1 sm:space-x-2">
                          {[1, 2, 3, 4, 5].map((starValue) => (
                            <button
                              key={starValue}
                              type="button"
                              onClick={() => onChange(starValue)}
                              className={`rounded-lg border px-4 py-2.5 font-semibold ${
                                value === starValue
                                  ? "bg-primary-color text-white"
                                  : "bg-white text-primary-color"
                              } shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color`}
                            >
                              <div className="flex items-center justify-center">
                                {starValue}
                                <StarIcon className="w-4 h-4 ml-2" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                />
                <FormField
                  control={form.control}
                  name="review"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Write a review..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This review will be public and will be shown to other
                        users.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="rounded-full bg-primary-color hover:bg-primary-color-hover px-4 py-2.5 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"
                  type="submit"
                >
                  Submit
                </Button>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

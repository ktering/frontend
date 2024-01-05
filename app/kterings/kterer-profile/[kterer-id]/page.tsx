"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import StarRating from "@/components/starRating";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { CheckCircleIcon, StarIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { KtererInfo } from "@/types/pages/kterings/kterer-profile";
import { Reviews } from "@/types/shared/reviews";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { FoodItem } from "@/types/shared/food";
import Biryani from "@/static/landing-page/biryani.png";
import { formatDistanceToNow } from "date-fns";

const formSchema = z.object({
  rating: z.number().min(1).max(5),
  review: z.string().min(10).max(300),
});

const DEFAULT_IMAGE_SRC =
  "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg";

export default function KtererProfile() {
  const { user } = useUser();
  if (!user) {
    return null;
  }
  const searchParams = useParams();
  const ktererId = searchParams["kterer-id"];

  const [ktererInfo, setKtererInfo] = useState<KtererInfo | null>(null);
  const [ktererFood, setKtererFood] = useState<FoodItem[]>([]);
  const [favourites, setFavourites] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [reviews, setReviews] = useState<Reviews[]>();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const hasReviews = reviews && reviews.length > 0;

  useEffect(() => {
    const fetchKtererInfo = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const apiURL = process.env.NEXT_PUBLIC_API_URL;

      try {
        const response = await fetch(`${apiURL}/api/kterer/${ktererId}`, {
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
        console.log("data", data.kterer);
        setKtererInfo(data.kterer);
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    };

    const getKtererFood = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const apiURL = process.env.NEXT_PUBLIC_API_URL;
      let response = await fetch(`${apiURL}/api/food/kterer/${ktererId}`, {
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
      console.log("kterer food", data.data);
      setKtererFood(data.data);

      response = await fetch(
        `${apiURL}/api/kterer/reviews/${data.data[0].kterer_id}`,
        {
          method: "GET",
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

      data = await response.json();
      console.log("review", data);
      setReviews(data.data);
    };

    fetchKtererInfo().catch((error) => {
      console.error(`Error: ${error}`);
    });
    getKtererFood().catch((error) => {
      console.error(`Error: ${error}`);
    });
  }, []);

  const deleteFavourite = async (id: string) => {
    const accessToken = localStorage.getItem("accessToken");
    const apiURL = process.env.NEXT_PUBLIC_API_URL;
    let response = await fetch(`${apiURL}/api/favourite/kterer/${id}`, {
      method: "DELETE",
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
    setFavourites(data.kterers);
  };

  const formatDate = (date: string | undefined) => {
    if (date && date.trim() !== "") {
      const dateObj = new Date(date);
      if (!isNaN(dateObj.valueOf())) {
        return dateObj.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      }
    }
    return "Invalid date";
  };

  const formatDateReview = (date: string) => {
    if (date.trim() !== "") {
      const dateObj = new Date(date);
      if (!isNaN(dateObj.valueOf())) {
        return formatDistanceToNow(dateObj, { addSuffix: true });
      }
    }
    return "Invalid date";
  };

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
      `${apiURL}/api/review/kterer/${ktererInfo?.id}`,
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
      // TODO: when the initial review is made, the name doesnt show up correctly
      const newReview = {
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
    let prevY = window.scrollY;
    const handleScroll = () => {
      let currentY = window.scrollY;
      let difference = currentY - prevY;
      const leftDiv = document.getElementById("left-side-image");
      const rightDiv = document.getElementById("right-side");

      if (leftDiv && rightDiv) {
        var position = leftDiv.getBoundingClientRect();
        const longDivBottomPosition = rightDiv.getBoundingClientRect().bottom;

        console.log(position, longDivBottomPosition);

        if (
          difference >= 0 &&
          position.bottom + difference <= longDivBottomPosition &&
          position.top < 0
        ) {
          leftDiv.style.paddingTop =
            Number(leftDiv.style.paddingTop.split("px")[0]) + difference + "px";
        }

        if (difference < 0) {
          let realH =
            position.height - Number(leftDiv.style.paddingTop.split("px")[0]);
          if (position.bottom + difference > realH) {
            leftDiv.style.paddingTop =
              Number(leftDiv.style.paddingTop.split("px")[0]) +
              difference +
              "px";
          }
        }
      }

      prevY = currentY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {ktererInfo ? (
          <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 gap-16 pb-12 border-b">
            <div className="col-span-1 sticky top-0">
              <div id="left-side-image" className="pt-0">
                <Card>
                  <CardContent>
                    <div className="flex items-center flex-col my-3">
                      <img
                        src={ktererInfo?.profile_image_url || DEFAULT_IMAGE_SRC}
                        alt="Kterer Profile Picture"
                        className="rounded-full w-32 h-32 object-cover"
                      />
                      <div className="flex flex-col w-full justify-between items-center mt-3">
                        <p className="text-lg font-semibold">
                          {ktererInfo?.user?.first_name}{" "}
                          {ktererInfo?.user?.last_name}
                        </p>
                        <StarRating rating={ktererInfo?.rating || 0} />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full space-y-2">
                      {[
                        { label: "Ethnicity", value: ktererInfo?.ethnicity },
                        {
                          label: "Experience",
                          value: `${ktererInfo?.experienceUnit} ${ktererInfo?.experienceValue}`,
                        },
                        {
                          label: "Member Since",
                          value: formatDate(ktererInfo?.created_at),
                        },
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <p className="font-bold">{item.label}</p>
                          <p>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </CardFooter>
                </Card>

                <div className="text-center mt-8">
                  <p className="font-bold">Bio</p>
                  <p>{ktererInfo?.bio}</p>
                </div>
              </div>
            </div>
            <div id="right-side" className="col-span-1 lg:col-span-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {ktererFood.map((item, index) => {
                  const food_id = new URLSearchParams({
                    food_id: item.id,
                  }).toString();

                  return (
                    <div key={index} className="relative">
                      <Link href={`/kterings/${item.name}?${food_id}`}>
                        <div className="aspect-w-4 aspect-h-3 w-full bg-gray-200 rounded-lg overflow-hidden">
                          <Image
                            src={item?.images[0]?.image_url || Biryani}
                            alt="Food Image"
                            fill
                            className="object-cover object-center"
                          />
                        </div>
                      </Link>

                      <div className="flex justify-between items-center mt-2">
                        <div className="text-left">
                          <p className="text-lg">{item.name}</p>
                          {item.rating !== 0 && (
                            <StarRating rating={item.rating} />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {ktererFood.length ? (
                  <></>
                ) : (
                  <div className="text-center">No Food Found</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>No Kterer Found</div>
        )}
        {/*  Reviews  */}
        <div className="pt-12">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xl my-12">Recent Reviews</h3>
            <Button
              className="rounded-full border bg-white hover:bg-white px-4 py-2.5 font-semibold text-primary-color shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"
              onClick={() => setIsReviewModalOpen(true)}
            >
              Write a review
            </Button>
          </div>
          {hasReviews ? (
            reviews?.map((review: any) => (
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
                      {formatDateReview(review?.created_at)}
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
            <DialogTitle>
              {ktererInfo?.user?.first_name}'s Kterer Review
            </DialogTitle>
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
                        <div className="space-x-2">
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

"use client";
import React, {useEffect, useState} from "react";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import Link from "next/link";
import {useToast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";
import {ExclamationCircleIcon, PhotoIcon, TrashIcon} from "@heroicons/react/24/outline";
import {useNotifications} from "@/components/notificationContext";
import {InformationCircleIcon} from "@heroicons/react/24/solid";
import {KtererInfo} from "@/types/shared/user";
import {Alert, AlertDescription, AlertTitle,} from "@/components/ui/alert"

const formSchema = z
    .object({
        images: z
            .array(
                z.object({
                    path: z.string(),
                    size: z.number(),
                    type: z.string(),
                })
            )
            .min(1, "At least one image is required"),
        name: z
            .string()
            .min(2, "Food name must be at least 2 characters")
            .max(50, "Food name can't be longer than 50 characters"),
        small_price: z.coerce
            .number()
            .nonnegative("Price must be a positive number")
            .optional(),
        small_amount: z.coerce
            .number()
            .nonnegative("Amount must be a positive number")
            .optional(),
        medium_price: z.coerce
            .number()
            .nonnegative("Price must be a positive number")
            .optional(),
        medium_amount: z.coerce
            .number()
            .nonnegative("Amount must be a positive number")
            .optional(),
        large_price: z.coerce
            .number()
            .nonnegative("Price must be a positive number")
            .optional(),
        large_amount: z.coerce
            .number()
            .nonnegative("Amount must be a positive number")
            .optional(),
        description: z
            .string()
            .min(25, "Description must be at least 25 characters"),
        ingredients: z
            .string()
            .min(
                10,
                "Ingredients list cannot be empty and must be at least 10 characters"
            ),
        halal: z.string().refine((value) => value !== "", {
            message: "Halal is required, please select an option",
        }),
        kosher: z.boolean(),
        vegetarian: z.string().refine((value) => value !== "", {
            message: "Vegetarian/Vegan is required, please select an option",
        }),
        desserts: z.string().refine((value) => value !== "", {
            message: "Desserts is required, please select an option",
        }),
        contains_nuts: z.boolean(),
        meat_type: z.string().refine((value) => value !== "", {
            message: "Meat Type is required, please select an option",
        }),
        ethnic_type: z.string().refine((value) => value !== "", {
            message: "Ethnic Type is required, please select an option",
        }),
    })
    .refine(
        (data) => {
            return (
                ((data.small_price || 0) > 0 && (data.small_amount || 0) > 0) ||
                ((data.medium_price || 0) > 0 && (data.medium_amount || 0) > 0) ||
                ((data.large_price || 0) > 0 && (data.large_amount || 0) > 0)
            );
        },
        {
            message: "At least one price and amount must be provided",
        }
    );

export default function PostFood() {
    const {toast} = useToast();
    const router = useRouter();
    const [ingredientsList, setIngredientsList] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isSmallActive, setIsSmallActive] = useState(false);
    const [isMediumActive, setIsMediumActive] = useState(false);
    const [isLargeActive, setIsLargeActive] = useState(false);
    const [ktererInfo, setKtererInfo] = useState<KtererInfo | null>(null);

    useEffect(() => {
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
                setKtererInfo(data.user.kterer.stripe_account_id);
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };

        getKtererAccountInfo().catch((error) => {
            console.error("An error occurred:", error);
        });
    }, []);

    // Toggle functions for each size
    const toggleSize = (size: string) => {
        switch (size) {
            case 'small':
                setIsSmallActive(!isSmallActive);
                if (isSmallActive) {
                    form.resetField('small_price');
                    form.resetField('small_amount');
                }
                break;
            case 'medium':
                setIsMediumActive(!isMediumActive);
                if (isMediumActive) {
                    form.resetField('medium_price');
                    form.resetField('medium_amount');
                }
                break;
            case 'large':
                setIsLargeActive(!isLargeActive);
                if (isLargeActive) {
                    form.resetField('large_price');
                    form.resetField('large_amount');
                }
                break;
            default:
                break;
        }
    };

    // Button class based on active state
    const getButtonClass = (isActive: boolean) =>
        `rounded-full px-4 py-2 text-center w-full ${isActive ? 'bg-primary-color text-white' : 'bg-gray-200'}`;

    const {updateNotifications} = useNotifications();

    function handleTextareaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const ingredients = event.currentTarget.value
            .split("\n")
            .filter((i) => i.trim() !== "");
        setIngredientsList(ingredients);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            images: [],
            name: "",
            small_price: undefined,
            small_amount: undefined,
            medium_price: undefined,
            medium_amount: undefined,
            large_price: undefined,
            large_amount: undefined,
            description: "",
            ingredients: "",
            halal: "",
            kosher: false,
            vegetarian: "",
            desserts: "",
            contains_nuts: false,
            meat_type: "",
            ethnic_type: "",
        },
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(event.target.files || []);
        const allFiles = [...selectedFiles, ...newFiles];
        if (allFiles.length > 3) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "You can only upload up to 3 images.",
            });
            return;
        }
        setSelectedFiles(allFiles);
        setPreviewUrls(allFiles.map((file) => URL.createObjectURL(file)));
        form.setValue(
            "images",
            allFiles.map((file) => ({
                path: file.name,
                size: file.size,
                type: file.type,
            }))
        );
    };

    const removeImage = (index: number) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles.splice(index, 1);
        setSelectedFiles(updatedFiles);
        const updatedUrls = [...previewUrls];
        updatedUrls.splice(index, 1);
        setPreviewUrls(updatedUrls);
        form.setValue(
            "images",
            updatedFiles.map((file) => ({
                path: file.name,
                size: file.size,
                type: file.type,
            }))
        );
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // A final check just in case
        if (selectedFiles.length === 0) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please upload at least one image.",
            });
            return;
        }

        const formData = new FormData();

        selectedFiles.forEach((file, index) => {
            const fieldName = `image_${index + 1}`;
            formData.append(fieldName, file);
        });

        function isKeyOfValues(key: string): key is keyof typeof values {
            return key in values;
        }

        for (const key in values) {
            if (!isKeyOfValues(key)) continue;

            if (key !== "images") {
                const value = values[key];
                if (
                    Array.isArray(value) ||
                    (typeof value === "object" && value !== null)
                ) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value?.toString() || "");
                }
            }
        }

        formData.append(
            "quantities",
            JSON.stringify(
                [
                    {
                        size: "small",
                        price: values.small_price || 0,
                        quantity: values.small_amount || 0,
                    },
                    {
                        size: "medium",
                        price: values.medium_price || 0,
                        quantity: values.medium_amount || 0,
                    },
                    {
                        size: "large",
                        price: values.large_price || 0,
                        quantity: values.large_amount || 0,
                    },
                ].filter((size) => size.price > 0 && size.quantity > 0)
            )
        );

        const accessToken = localStorage.getItem("accessToken");
        const apiURL = process.env.NEXT_PUBLIC_API_URL;

        try {
            const addFoodPostResponse = await fetch(`${apiURL}/api/food`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData,
            });

            if (addFoodPostResponse.ok) {
                router.push("/kterer/dashboard");
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "There was a problem submitting your post.",
                });
            }
        } catch (error) {
            console.error("Error submitting form", error);
        }
    }

    useEffect(() => {
        const getNotifications = async () => {
            const accessToken = localStorage.getItem("accessToken");
            const apiURL = process.env.NEXT_PUBLIC_API_URL;

            try {
                const response = await fetch(`${apiURL}/api/notifications`, {
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

                updateNotifications(
                    data.map(
                        (not: {
                            id: any;
                            data: { message: any };
                            created_at: string | number | Date;
                            read_at: string | number | Date;
                        }) => ({
                            id: not.id,
                            message: not.data.message,
                            created_at: new Date(not.created_at),
                            read_at: not.read_at ? new Date(not.read_at) : null,
                        })
                    )
                );
            } catch (error) {
                console.error(`Error: ${error}`);
            }
        };

        getNotifications().catch((error) => {
            console.error(`Error: ${error}`);
        });
    }, []);

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <p className="font-bold text-xl mb-12">Post Food</p>
                <div className="max-w-2xl mx-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {previewUrls.map((url, index) => (
                                    <div className="space-y-2" key={index}>
                                        <div className="h-48 overflow-hidden rounded-lg relative">
                                            <img
                                                src={url}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="p-1 rounded-lg hover:bg-gray-50"
                                        >
                                            <TrashIcon className="h-6 w-6"/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {selectedFiles.length < 1 ? (
                                <div className="bg-yellow-50 px-3.5 py-2 flex justify-center items-center">
                                    <InformationCircleIcon className="h-6 w-6 text-primary-color mr-2"/>
                                    <p className="text-sm font-semibold text-primary-color">
                                        Please upload at least one (1) photo of your item.
                                    </p>
                                </div>
                            ) : null}
                            <FormField
                                control={form.control}
                                name="images"
                                render={() => (
                                    <FormItem>
                                        <FormControl>
                                            <div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id="foodImagesInput"
                                                    className="hidden"
                                                    multiple
                                                    onChange={(event) => {
                                                        handleFileChange(event);
                                                    }}
                                                    disabled={selectedFiles.length >= 3}
                                                />
                                                <label
                                                    htmlFor="foodImagesInput"
                                                    className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-offset-2"
                                                >
                                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400"/>
                                                    <span className="mt-2 block text-sm font-semibold text-gray-900">
                            {" "}
                                                        {selectedFiles.length < 3
                                                            ? "Upload Food Images"
                                                            : "Max Food Images Uploaded"}
                          </span>
                                                    <span className="mt-2 block text-xs font-semibold text-gray-900">
                            {selectedFiles.length} out of 3 Uploaded
                          </span>
                                                </label>
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />`
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name of Food</FormLabel>
                                        <FormControl>
                                            <Input className="rounded-full" {...field} />
                                        </FormControl>
                                        <FormDescription>Try to keep it short and precise!</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            {/* Size Start */}
                            <div>
                                <FormLabel>Select the size(s) you are selling</FormLabel>
                                <div className="grid grid-cols-1 sm:grid-cols-3 col-span-1 gap-8 pt-3">
                                    {/* Small Size */}
                                    <div className="space-y-4">
                                        <button
                                            type="button"
                                            onClick={() => toggleSize('small')}
                                            className={getButtonClass(isSmallActive)}
                                        >
                                            Small
                                        </button>
                                        {isSmallActive && (
                                            <>
                                                <FormField
                                                    control={form.control}
                                                    name="small_price"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Price</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="$"
                                                                    type="number"
                                                                    className="rounded-full"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>Price for this size.</FormDescription>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="small_amount"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Quantity</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="1, 2, 3..."
                                                                    type="number"
                                                                    className="rounded-full"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>Quantity in this size?</FormDescription>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                            </>
                                        )}
                                    </div>

                                    {/* Medium Size */}
                                    <div className="space-y-4">
                                        <button
                                            type="button"
                                            onClick={() => toggleSize('medium')}
                                            className={getButtonClass(isMediumActive)}
                                        >
                                            Medium
                                        </button>
                                        {isMediumActive && (
                                            <>
                                                <FormField
                                                    control={form.control}
                                                    name="medium_price"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Price</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="$"
                                                                    type="number"
                                                                    className="rounded-full"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>Price for this size.</FormDescription>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="medium_amount"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Quantity</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="1, 2, 3..."
                                                                    type="number"
                                                                    className="rounded-full"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>Quantity in this size?</FormDescription>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                            </>
                                        )}
                                    </div>

                                    {/* Large Size */}
                                    <div className="space-y-4">
                                        <button
                                            type="button"
                                            onClick={() => toggleSize('large')}
                                            className={getButtonClass(isLargeActive)}
                                        >
                                            Large
                                        </button>
                                        {isLargeActive && (
                                            <>
                                                <FormField
                                                    control={form.control}
                                                    name="large_price"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Price</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="$"
                                                                    type="number"
                                                                    className="rounded-full"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>Price for this size.</FormDescription>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="large_amount"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel>Quantity</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="1, 2, 3..."
                                                                    type="number"
                                                                    className="rounded-full"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>Quantity in this size?</FormDescription>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                            </>
                                        )}
                                    </div>

                                    {/* @ts-ignore */}
                                    {form.formState.errors[""] && (
                                        <div className="col-span-3">
                                            <p className="text-sm font-medium text-destructive">
                                                {/* @ts-ignore */}
                                                {form.formState.errors[""].message}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Size End */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="resize-none h-48"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>Tell us a little bit about your food item. Is
                                            it perfect for dinner? Lunch? Is it good
                                            for 3 people? Let customers know!</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="ingredients"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Ingredients</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="resize-none h-48"
                                                {...field}
                                                onChange={(e) => {
                                                    handleTextareaChange(e);
                                                    field.onChange(e);
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Please include all ingredients and enter each ingredient
                                            on a new line.
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="halal"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Halal?</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="rounded-full">
                                                    <SelectValue/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="No">No</SelectItem>
                                                <SelectItem value="hand-slaughtered">
                                                    Halal - Hand Slaughtered
                                                </SelectItem>
                                                <SelectItem value="machine-slaughtered">
                                                    Halal - Machine Slaughtered
                                                </SelectItem>
                                                <SelectItem value="doesnt-have-meat">
                                                    Halal - Doesn't Have Meat
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Pork, Alcohol, and Gelatin are NOT halal. For more
                                            information, please visit
                                            <Link href="https://www.jamiaislamia.org/images/halalharam.pdf">
                                                Your Website Link
                                            </Link>
                                            .
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="kosher"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Kosher?</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(value === "1")}
                                            defaultValue={field.value ? "1" : "0"}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="rounded-full">
                                                    <SelectValue/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="1">Yes</SelectItem>
                                                <SelectItem value="0">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Kosher is food prepared according to the
                                            requirements of Jewish law.</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="vegetarian"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Vegetarian/Vegan?</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="rounded-full">
                                                    <SelectValue/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                                                <SelectItem value="Vegan">Vegan</SelectItem>
                                                <SelectItem value="None">None</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="desserts"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Desserts/Drinks?</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="rounded-full">
                                                    <SelectValue/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Desserts">Desserts</SelectItem>
                                                <SelectItem value="Drinks">Drinks</SelectItem>
                                                <SelectItem value="None">None</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contains_nuts"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>May Contain Nuts?</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(value === "1")}
                                            defaultValue={field.value ? "1" : "0"}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="rounded-full">
                                                    <SelectValue/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="1">Yes</SelectItem>
                                                <SelectItem value="0">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="meat_type"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Meat Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="rounded-full">
                                                    <SelectValue placeholder="Chicken/Beef..."/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Beef">Beef</SelectItem>
                                                <SelectItem value="Goat">Goat</SelectItem>
                                                <SelectItem value="Lamb">Lamb</SelectItem>
                                                <SelectItem value="Chicken">Chicken</SelectItem>
                                                <SelectItem value="Pork">Pork</SelectItem>
                                                <SelectItem value="Fish">Fish</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                                <SelectItem value="None">None</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="ethnic_type"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Ethnic Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="rounded-full">
                                                    <SelectValue placeholder="Pakistani/Indian/Chinese..."/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Pakistan">Pakistan</SelectItem>
                                                <SelectItem value="Indian">Indian</SelectItem>
                                                <SelectItem value="Chinese">Chinese</SelectItem>
                                                <SelectItem value="Italian">Italian</SelectItem>
                                                <SelectItem value="Thai">Thai</SelectItem>
                                                <SelectItem value="Mexican">Mexican</SelectItem>
                                                <SelectItem value="Korean">Korean</SelectItem>
                                                <SelectItem value="Asian">Asian</SelectItem>
                                                <SelectItem value="Middle-Eastern">
                                                    Middle Eastern
                                                </SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                                <SelectItem value="None">None</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button
                                // disabled={selectedFiles.length === 0 || !ktererInfo}
                                //Added this for sarim to test wihtout adding the stripe info
                                disabled={selectedFiles.length === 0}
                                className="bg-primary-color w-full sm:w-auto hover:bg-primary-color-hover rounded-full"
                                type="submit"
                            >
                                Post Food
                            </Button>
                            {!ktererInfo && (
                                <>
                                    <Alert variant="destructive">
                                        <ExclamationCircleIcon className="h-5 w-5 mr-2"/>
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>
                                            Please complete your banking information to enable food posting. <Link
                                            href="/kterer/earnings" className="underline">Click here to complete</Link>
                                        </AlertDescription>
                                    </Alert>
                                </>
                            )}
                        </form>
                    </Form>
                </div>
            </div>
        </>
    )
        ;
}

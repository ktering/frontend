"use client";
import React, {useEffect, useState} from "react";
import * as z from 'zod'
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import Link from "next/link";
import {useToast} from "@/components/ui/use-toast"
import {useRouter, useSearchParams} from "next/navigation";
import {ArrowLeftIcon} from "@heroicons/react/20/solid";
import {FoodItem} from "@/types/shared/food";
import {PhotoIcon, TrashIcon} from "@heroicons/react/24/outline";
import {SizeMap} from "@/types/pages/kterer/edit-food";
import {InformationCircleIcon} from "@heroicons/react/24/solid";

const formSchema = z.object({
    images: z.array(z.object({
        path: z.string(),
        size: z.number(),
        type: z.string(),
    })),
    name: z.string().min(2, "Food name must be at least 2 characters").max(50, "Food name can't be longer than 50 characters"),
    small_price: z.union([z.string().transform(val => val === "" ? 0 : parseFloat(val)), z.number()]),
    small_amount: z.union([z.string().transform(val => val === "" ? 0 : parseFloat(val)), z.number()]),
    medium_price: z.union([z.string().transform(val => val === "" ? 0 : parseFloat(val)), z.number()]),
    medium_amount: z.union([z.string().transform(val => val === "" ? 0 : parseFloat(val)), z.number()]),
    large_price: z.union([z.string().transform(val => val === "" ? 0 : parseFloat(val)), z.number()]),
    large_amount: z.union([z.string().transform(val => val === "" ? 0 : parseFloat(val)), z.number()]),
    description: z.string().min(25, "Description must be at least 25 characters"),
    ingredients: z.string().min(10, "Ingredients list cannot be empty and must be at least 10 characters"),
    halal: z.string().refine(value => value !== "", {
        message: "Halal is required, please select an option",
    }),
    kosher: z.boolean(),
    vegetarian: z.string().refine(value => value !== "", {
        message: "Vegetarian/Vegan is required, please select an option",
    }),
    desserts: z.string().refine(value => value !== "", {
        message: "Desserts is required, please select an option",
    }),
    contains_nuts: z.boolean(),
    meat_type: z.string().refine(value => value !== "", {
        message: "Meat Type is required, please select an option",
    }),
    ethnic_type: z.string().refine(value => value !== "", {
        message: "Ethnic Type is required, please select an option",
    }),
}).refine(data => {
    return (data.small_price > 0 && data.small_amount > 0) ||
        (data.medium_price > 0 && data.medium_amount > 0) ||
        (data.large_price > 0 && data.large_amount > 0);

}, {
    message: "At least one price and amount must be provided",
});

export default function EditFood() {
    const searchParams = useSearchParams();
    const foodId = searchParams.get('food_id');
    const [foodDetails, setFoodDetails] = useState<FoodItem | null>(null);
    const {toast} = useToast();
    const router = useRouter();
    const [ingredientsList, setIngredientsList] = useState<string[]>([]);

    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [deletedImages, setDeletedImages] = useState<string[]>([]);
    const totalImageCount = existingImages.length + newImages.length;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            images: [],
            name: "",
            small_price: 0,
            small_amount: 0,
            medium_price: 0,
            medium_amount: 0,
            large_price: 0,
            large_amount: 0,
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
    })

    useEffect(() => {
        if (!foodId || foodId === '' || foodId === 'undefined' || foodId === 'null') {
            router.push('/kterings');
            return
        }

        const getFoodInfo = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const apiURL = process.env.NEXT_PUBLIC_API_URL;
            try {
                const response = await fetch(`${apiURL}/api/food/${foodId}`, {
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
                setFoodDetails(data.data);
            } catch (error) {
                console.error('Error fetching food info', error);
            }
        }

        getFoodInfo().catch(error => {
            console.error('Error fetching food info', error);
        });
    }, [foodId]);


    useEffect(() => {
        if (!foodDetails) return;

        console.log('foodDetails', foodDetails);

        const initialSizes: SizeMap = {};

        const {small, medium, large} = foodDetails.quantities.reduce((sizes, {size, price, quantity}) => {
            sizes[size as keyof SizeMap] = {price: parseFloat(price) || 0, quantity: parseInt(quantity) || 0};
            return sizes;
        }, initialSizes);

        const defaultValues = {
            small_price: small?.price || 0,
            small_amount: small?.quantity || 0,
            medium_price: medium?.price || 0,
            medium_amount: medium?.quantity || 0,
            large_price: large?.price || 0,
            large_amount: large?.quantity || 0,
        };

        const imageUrls = foodDetails.images.map(image => image.image_url);
        setExistingImages(imageUrls);

        const imageObjects = imageUrls.map(url => ({
            path: url,
            size: 0,
            type: 'image/png'
        }));

        form.reset({
            ...defaultValues,
            images: imageObjects,
            name: foodDetails.name,
            description: foodDetails.description,
            ingredients: foodDetails.ingredients,
            halal: foodDetails.halal,
            kosher: foodDetails.kosher,
            vegetarian: foodDetails.vegetarian,
            desserts: foodDetails.desserts,
            contains_nuts: foodDetails.contains_nuts,
            meat_type: foodDetails.meat_type,
            ethnic_type: foodDetails.ethnic_type,
        });
    }, [foodDetails, form]);

    function handleTextareaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const ingredients = event.currentTarget.value.split('\n').filter(i => i.trim() !== '');
        setIngredientsList(ingredients);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = Array.from(event.target.files || []);
        const totalFiles = existingImages.length + newImages.length + uploadedFiles.length;
        if (totalFiles > 3) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "You can only upload up to 3 images.",
            });
            return;
        }
        setNewImages(prev => [...prev, ...uploadedFiles]);
    };

    const removeExistingImage = (index: number) => {
        const updatedExistingImages = [...existingImages];
        const [removedImage] = updatedExistingImages.splice(index, 1); // Remove and capture the deleted image
        setExistingImages(updatedExistingImages);
        setDeletedImages(prev => [...prev, removedImage]); // Add the removed image to the deletedImages state
    };

    const removeNewImage = (index: number) => {
        const updatedNewImages = newImages.filter((_, i) => i !== index);
        setNewImages(updatedNewImages);
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // TODO: when the user removes all images and doesnt add any new ones, show an error message and dont submit the form
        const formData = new FormData();

        function isKeyOfValues(key: string): key is keyof typeof values {
            return key in values;
        }

        for (const key in values) {
            if (!isKeyOfValues(key)) continue;

            if (key !== 'images') {
                if (key === 'small_price' || key === 'small_amount' ||
                    key === 'medium_price' || key === 'medium_amount' ||
                    key === 'large_price' || key === 'large_amount') {
                    continue;
                }
                formData.append(key, values[key].toString());
            }
        }

        newImages.forEach((image, index) => {
            formData.append(`image_${index + 1}`, image);
        });

        deletedImages.forEach((url, index) => {
            formData.append(`deleted_image_${index + 1}`, url);
        });

        const quantities = [
            {size: 'small', price: values.small_price, quantity: values.small_amount},
            {size: 'medium', price: values.medium_price, quantity: values.medium_amount},
            {size: 'large', price: values.large_price, quantity: values.large_amount},
        ].filter(size => size.price > 0 && size.quantity > 0);

        formData.append('quantities', JSON.stringify(quantities));

        formData.append('_method', 'PUT');

        const accessToken = localStorage.getItem('accessToken');
        const apiURL = process.env.NEXT_PUBLIC_API_URL;

        try {
            const addFoodPostResponse = await fetch(`${apiURL}/api/food/${foodDetails?.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: formData,
            });

            if (addFoodPostResponse.ok) {
                router.push('/kterer/dashboard');
            } else {
                console.log(addFoodPostResponse.statusText);
            }
        } catch (error) {
            console.error('Error submitting form', error);
        }
    }

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <p className="font-bold text-xl mb-12 flex items-center">
                    <Link href="/kterer/dashboard">
                        <ArrowLeftIcon className="h-6 w-6 text-primary-color mr-2"/>
                    </Link>
                    Edit Food
                </p>
                <div className="max-w-2xl mx-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {existingImages.map((url, index) => (
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
                                            onClick={() => removeExistingImage(index)}
                                            className="p-1 rounded-lg hover:bg-gray-50"
                                        >
                                            <TrashIcon className="h-6 w-6"/>
                                        </button>
                                    </div>
                                ))}
                                {newImages.map((file, index) => (
                                    <div className="space-y-2" key={index}>
                                        <div className="h-48 overflow-hidden rounded-lg relative">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`New Image ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(index)}
                                            className="p-1 rounded-lg hover:bg-gray-50"
                                        >
                                            <TrashIcon className="h-6 w-6"/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {totalImageCount < 1 ? (
                                <div className="bg-yellow-50 px-3.5 py-2 flex justify-center items-center">
                                    <InformationCircleIcon className="h-6 w-6 text-primary-color mr-2"/>
                                    <p className="text-sm font-semibold text-primary-color">Please upload at least one
                                        (1)
                                        photo of your item.</p>
                                </div>) : null}
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
                                                    onChange={(event) => handleFileChange(event)}
                                                    disabled={totalImageCount >= 3}
                                                />
                                                <label htmlFor="foodImagesInput"
                                                       className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-offset-2">
                                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400"/>
                                                    <span
                                                        className="mt-2 block text-sm font-semibold text-gray-900"> {totalImageCount < 3 ? 'Upload Food Images' : 'Max Food Images Uploaded'}</span>
                                                    <span
                                                        className="mt-2 block text-xs font-semibold text-gray-900">{totalImageCount} out of 3 Uploaded</span>
                                                </label>
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name of Food</FormLabel>
                                        <FormControl>
                                            <Input className="rounded-full" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            {/* Size Start */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 col-span-1 gap-8">
                                <div className="space-y-4">
                                    <div className="bg-primary-color rounded-full p-2 text-white text-center">
                                        Small
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="small_price"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Small Prices</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="$" type="number"
                                                           className="rounded-full" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="small_amount"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Small Amounts</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="1, 2, 3..." type="number"
                                                           className="rounded-full" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-primary-color rounded-full p-2 text-white text-center">
                                        Medium
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="medium_price"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Medium Prices</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="$" type="number"
                                                           className="rounded-full" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="medium_amount"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Medium Amounts</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="1, 2, 3..." type="number"
                                                           className="rounded-full" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-primary-color rounded-full p-2 text-white text-center">
                                        Large
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="large_price"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Large Prices</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="$" type="number"
                                                           className="rounded-full" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="large_amount"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Large Amounts</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="1, 2, 3..."
                                                           type="number"
                                                           className="rounded-full" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {/* No Size price, amount selected error message */}
                                {/* @ts-ignore */}
                                {form.formState.errors[""]?.message && (
                                    <div className="col-span-3">
                                        <p className="text-sm font-medium text-destructive">
                                            {/* @ts-ignore */}
                                            {form.formState.errors[""].message}
                                        </p>
                                    </div>
                                )}
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
                                                placeholder="Tell us a little bit about the food"
                                                className="resize-none h-48"
                                                {...field}
                                            />
                                        </FormControl>
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
                                        <FormDescription>Please include all ingredients and enter each ingredient on a
                                            new line.</FormDescription>
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
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="rounded-full">
                                                    <SelectValue/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="No">No</SelectItem>
                                                <SelectItem value="hand-slaughtered">Halal - Hand
                                                    Slaughtered</SelectItem>
                                                <SelectItem value="machine-slaughtered">Halal - Machine
                                                    Slaughtered</SelectItem>
                                                <SelectItem value="doesnt-have-meat">Halal - Doesn't Have
                                                    Meat</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Pork, Alcohol, and Gelatin are NOT halal. For more
                                            information, please
                                            visit
                                            <Link href="/examples/forms">Your Website Link</Link>.
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
                                            onValueChange={(value) => field.onChange(value === '1')}
                                            value={field.value ? '1' : '0'}
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
                                name="vegetarian"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Vegetarian/Vegan?</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
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
                                        <Select onValueChange={field.onChange} value={field.value}>
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
                                        <Select onValueChange={(value) => field.onChange(value === '1')}
                                                value={field.value ? '1' : '0'}>
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
                                        <Select onValueChange={field.onChange} value={field.value}>
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
                                        <Select onValueChange={field.onChange} value={field.value}>
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
                                                <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                                <SelectItem value="None">None</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button
                                className="bg-primary-color w-full sm:w-auto hover:bg-primary-color-hover rounded-full"
                                type="submit">Post Food</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </>
    )
}
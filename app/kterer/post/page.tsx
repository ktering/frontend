"use client";
import React, {useState} from "react";
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
import {useRouter} from "next/navigation";
import {PhotoIcon, TrashIcon} from "@heroicons/react/24/outline";

const formSchema = z.object({
    images: z.array(z.object({
        path: z.string(),
        size: z.number(),
        type: z.string(),
    })),
    name: z.string().min(2, "Food name must be at least 2 characters").max(50, "Food name can't be longer than 50 characters"),
    small_price: z.coerce.number(),
    small_amount: z.coerce.number(),
    medium_price: z.coerce.number(),
    medium_amount: z.coerce.number(),
    large_price: z.coerce.number(),
    large_amount: z.coerce.number(),
    description: z.string().min(2, "Description must be at least 2 characters").max(1000, "Description can't be longer than 1000 characters"),
    ingredients: z.string().min(1, "Ingredients list cannot be empty"),
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

export default function PostFood() {
    const {toast} = useToast();
    const router = useRouter();
    const [ingredientsList, setIngredientsList] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    function handleTextareaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const ingredients = event.currentTarget.value.split('\n').filter(i => i.trim() !== '');
        setIngredientsList(ingredients);
    }

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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(event.target.files || []);
        const allFiles = [...selectedFiles, ...newFiles];
        if (allFiles.length > 3) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "You can only upload up to 3 images.",
            })
            return;
        }
        setSelectedFiles(allFiles);
        setPreviewUrls(allFiles.map(file => URL.createObjectURL(file)));
        form.setValue('images', allFiles.map(file => ({
            path: file.name,
            size: file.size,
            type: file.type,
        })));
    };

    const removeImage = (index: number) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles.splice(index, 1);
        setSelectedFiles(updatedFiles);
        const updatedUrls = [...previewUrls];
        updatedUrls.splice(index, 1);
        setPreviewUrls(updatedUrls);
        form.setValue('images', updatedFiles.map(file => ({
            path: file.name,
            size: file.size,
            type: file.type,
        })));
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
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

            if (key !== 'images') {
                const value = values[key];
                if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value.toString());
                }
            }
        }

        formData.append('quantities', JSON.stringify([
            {size: 'small', price: values.small_price, quantity: values.small_amount},
            {size: 'medium', price: values.medium_price, quantity: values.medium_amount},
            {size: 'large', price: values.large_price, quantity: values.large_amount},
        ].filter(size => size.price > 0 && size.quantity > 0)));

        const accessToken = localStorage.getItem('accessToken');
        const apiURL = process.env.NEXT_PUBLIC_API_URL;

        try {
            const addFoodPostResponse = await fetch(`${apiURL}/api/food`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: formData,
            });

            if (addFoodPostResponse.ok) {
                router.push('/kterer/dashboard');
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "There was a problem submitting your post.",
                });
            }
        } catch (error) {
            console.error('Error submitting form', error);
        }
    }

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <p className="font-bold text-xl mb-12">Post Food</p>
                <div className="max-w-2xl mx-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                                <label htmlFor="foodImagesInput"
                                                       className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-offset-2">
                                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400"/>
                                                    <span
                                                        className="mt-2 block text-sm font-semibold text-gray-900"> {selectedFiles.length < 3 ? 'Upload Food Images' : 'Max Food Images Uploaded'}</span>
                                                    <span
                                                        className="mt-2 block text-xs font-semibold text-gray-900">{selectedFiles.length} out of 3 Uploaded</span>
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                            <Link href="https://www.jamiaislamia.org/images/halalharam.pdf">Your Website
                                                Link</Link>.
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
                                            defaultValue={field.value ? '1' : '0'}
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                                defaultValue={field.value ? '1' : '0'}>
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                                <SelectItem value="Middle-Eastern">Middle Eastern</SelectItem>
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
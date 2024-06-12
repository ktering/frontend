"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { Fragment, useState } from "react";
import VendorTermsAndConditionsPage from "@/app/legal/vendor-terms-and-conditions/page";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  street_address: z
    .string()
    .min(5, { message: "Street Address must contain at least 5 character(s)" })
    .max(100, {
      message: "Street Address can't be longer than 100 characters",
    }),
  city: z
    .string()
    .min(2, { message: "City must contain at least 2 character(s)" })
    .max(50, { message: "City can't be longer than 50 characters" }),
  apartment: z.string().optional(),
  province: z
    .string()
    .min(2, { message: "Province must contain at least 2 character(s)" })
    .max(50, { message: "Province can't be longer than 50 characters" }),
  country: z
    .string()
    .min(2, { message: "Country must contain at least 2 character(s)" })
    .max(50, { message: "Country can't be longer than 50 characters" }),
  postal_code: z
    .string()
    .min(5, { message: "Postal Code must contain at least 5 character(s)" })
    .max(10, { message: "Postal Code can't be longer than 10 characters" }),

  profile_image_url: z.union([
    z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png, and .webp formats are supported."
      ),
    z.string().url({ message: "Must be a valid URL" }),
  ]),
  bio: z.string().max(500, "Bio can't be longer than 500 characters"),
  ethnicity: z.string(),
  experienceUnit: z.coerce.number(),
  experienceValue: z.enum(["Days", "Months", "Years"]),

  terms: z.boolean().refine((value) => value, {
    message: "You must accept the terms and conditions",
  }),
});

export default function KtererSetup() {
  const [profileImageSrc, setProfileImageSrc] = useState<string>(
    "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isKycVerifiedButtonClicked, setIsKycVerifiedButtonClicked] =
    useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      street_address: "",
      city: "",
      apartment: "",
      province: "",
      country: "Canada",
      postal_code: "",

      profile_image_url:
        "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg",
      bio: "",
      ethnicity: "",
      experienceUnit: 0,
      experienceValue: "Years",

      terms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    formData.append("street_address", values.street_address);
    formData.append("city", values.city);
    if (values.apartment) {
      formData.append("apartment", values.apartment);
    }
    formData.append("province", values.province);
    formData.append("country", values.country);
    formData.append("postal_code", values.postal_code);
    formData.append("bio", values.bio);
    formData.append("ethnicity", values.ethnicity);
    formData.append("experienceUnit", values.experienceUnit.toString());
    formData.append("experienceValue", values.experienceValue);
    formData.append("_method", "PUT");

    if (values.profile_image_url instanceof File) {
      formData.append(
        "profile_image_url",
        values.profile_image_url,
        values.profile_image_url.name
      );
    } else {
      formData.append("profile_image_url", values.profile_image_url);
    }

    const accessToken = localStorage.getItem("accessToken");
    const apiURL = process.env.NEXT_PUBLIC_API_URL;
    const addKtererInfoResponse = await fetch(`${apiURL}/api/kterer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (addKtererInfoResponse.ok) {
      setIsModalOpen(true);
    } else {
      console.log(addKtererInfoResponse.statusText);
    }
  }

  const openIdentityVerification = () => {
    setIsKycVerifiedButtonClicked(true);
    // :TODO: change the state of the website so they cant see the kterer setup page again
    const hostedFlowLink = process.env.NEXT_PUBLIC_PERSONA_KYC_API_URL;
    window.open(hostedFlowLink, "_blank");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setProfileImageSrc(result);
        }
      };
      reader.readAsDataURL(file);
      form.setValue("profile_image_url", file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-3">
      {isModalOpen ? (
        <Transition.Root show={isModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => {}}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                    <div>
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckIcon
                          className="h-6 w-6 text-green-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-5">
                        {!isKycVerifiedButtonClicked ? (
                          <>
                            <Dialog.Title
                              as="h3"
                              className="text-base font-semibold leading-6 text-gray-900"
                            >
                              Please verify your identity
                            </Dialog.Title>
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">
                                Click the button below to complete the identity
                                verification process.
                              </p>
                            </div>
                            <div className="mt-4">
                              <button
                                type="button"
                                className="inline-flex justify-center rounded-full border border-transparent bg-primary-color px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-color-hover focus:outline-none focus:ring-2 focus:ring-primary-color focus:ring-offset-2"
                                onClick={openIdentityVerification}
                                disabled={isKycVerifiedButtonClicked}
                              >
                                Verify Identity
                              </button>
                            </div>
                          </>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Please go to the opened tab to complete your
                            verification. You may close this tab.
                          </p>
                        )}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      ) : (
        <>
          <div className="text-center text-3xl font-bold my-8">
            Kterer Account Setup
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="my-10 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="street_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input className="rounded-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input className="rounded-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apartment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apartment Number</FormLabel>
                      <FormControl>
                        <Input className="rounded-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province</FormLabel>
                      <FormControl>
                        <Input className="rounded-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input className="rounded-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip/Postal Code</FormLabel>
                      <FormControl>
                        <Input className="rounded-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1 sm:col-span-3  text-xl font-bold my-8">
                Kterer Profile Setup
              </div>

              <div className="my-10 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-5">
                <div className="col-span-5 md:col-span-2 text-center bg-primary-color rounded-xl flex items-center justify-center ">
                  {/* <h1 className="text-xl font-bold mb-2">Profile Picture</h1> */}
                  <div className=" flex flex-col lg:flex-row items-center justify-center px-2 py-5">
                    <div className="lg:w-1/2">
                        <img
                        className="inline-block h-40 w-40 rounded-full"
                        src={profileImageSrc}
                        alt=""
                      />
                    </div>
                    <div className="lg:w-1/2">
                        <p className="mb-4 max-w-xs mx-auto text-white ">
                        A profile picture helps people recognize & trust you more, leading to more sales!
                        </p>
                        
                        <FormField
                          control={form.control}
                          name="profile_image_url"
                          render={() => (
                            <FormItem>
                              <FormControl>
                                <div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    id="profilePictureInput"
                                    className="hidden"
                                    onChange={handleImageChange}
                                  />
                                  <label
                                    htmlFor="profilePictureInput"
                                    className="cursor-pointer text-sm md:text-base rounded-full bg-white text-primary-color px-3 md:px-4 py-2 font-semibold  shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  >
                                    Upload a Photo
                                  </label>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </div>
                  </div>
                </div>

                <div className="col-span-5 md:col-span-3 space-y-8">
                  <span className=" text-white  bg-primary-color rounded-xl px-4 py-1">
                      Other Information
                  </span>
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us a little bit about yourself"
                            className="resize-none border-gray-600"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 sm:space-x-8 space-y-3 sm:space-y-0">
                    {/* <FormField
                      control={form.control}
                      name="ethnicity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ethnicity</FormLabel>
                          <FormControl>
                            <Input className="rounded-full" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                    <div className="sm:col-span-2">
                      
                      <FormField
                      control={form.control}
                      name="ethnicity"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            >
                            <FormLabel>Ethnicity</FormLabel>
                            <FormControl className="rounded-xl border-gray-600 exclu ">
                              <SelectTrigger>
                                <SelectValue placeholder="e.g: Pakistani" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Pakistani">Pakistani</SelectItem>
                              <SelectItem value="Indian">Indian</SelectItem>
                              <SelectItem value="Chinese">Chinese</SelectItem>
                              <SelectItem value="Japanese">Japanese</SelectItem>
                              <SelectItem value="Canadian">Canadian</SelectItem>
                              <SelectItem value="African">African</SelectItem>
                              <SelectItem value="American">American</SelectItem>
                              <SelectItem value="Mexican">Mexican</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="experienceUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cooking Experience</FormLabel>
                          <FormControl className="rounded-xl border-gray-600 ">
                            <Input
                              placeholder="e.g: 1,2,3..."
                              
                              type="number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experienceValue"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormLabel className="text-white hidden md:inline">.</FormLabel>
                            <FormControl className="rounded-xl border-gray-600 exclu">
                              <SelectTrigger>
                                <SelectValue placeholder="e.g: Days, Months, Year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Days">Days</SelectItem>
                              <SelectItem value="Months">Months</SelectItem>
                              <SelectItem value="Years">Years</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-3 pt-5">
                <ScrollArea className="h-[500px] rounded-md border p-4 w-full">
                  <VendorTermsAndConditionsPage />
                </ScrollArea>
              </div>

              <div className="col-span-1 sm:col-span-3 flex items-center justify-center space-x-2">
                <Controller
                  name="terms"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="bg-stone-300"
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I’ve read and accepted the Vendor Terms and Conditions
                      </label>
                      {fieldState.invalid && (
                        <span className="text-destructive ">
                          {form.formState.errors.terms?.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="col-span-1 sm:col-span-3 text-center">
                <Button
                  type="submit"
                  className="bg-primary-color w-full sm:w-auto hover:bg-primary-color-hover rounded-full"
                >
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}

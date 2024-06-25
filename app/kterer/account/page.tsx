"use client";
import React, { useEffect, useState } from "react";
import { loadGoogleMapsAPI } from "@/lib/loadGoogleMapsAPI";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useClerk } from "@clerk/nextjs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KtererInfo } from "@/types/shared/user";
import { CheckCircleIcon, MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNotifications } from "@/components/notificationContext";
import { UserInfo } from "@/types/shared/user";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const DEFAULT_IMAGE_SRC =
  "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg";

const formSchema = z.object({
  profile_image_url: z
    .any()
    .refine(
      (file) => !(file instanceof File) || file.size <= MAX_FILE_SIZE, // Check if file and size are valid
      { message: "Max image size is 5MB." }
    )
    .refine(
      (file) =>
        !(file instanceof File) || ACCEPTED_IMAGE_TYPES.includes(file.type), // Check if file and type are valid
      { message: "Only .jpg, .jpeg, .png, and .webp formats are supported." }
    ),

  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(20, "First name can't be longer than 20 characters"),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(20, "Last name can't be longer than 20 characters"),
  email: z.string().email(),
  phone: z.string().refine((value) => /^\+1\d{10}$/.test(value), {
    message:
      "Phone number must start with +1 and be followed by exactly 10 digits",
    path: [],
  }),
  country: z.string(),
  email_notification: z.boolean(),
  bio: z.string().max(500, "Bio can't be longer than 500 characters"),
  ethnicity: z.string(),
  experienceUnit: z.coerce.number(),
  experienceValue: z.enum(["Days", "Months", "Years"]),
  street_address: z.string(),
  province: z.string(),
  city: z.string(),
  apartment: z.coerce.number(),
  postal_code: z.string(),
});

export default function KtererAccount() {
  const { user, signOut } = useClerk();
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [signOutOfOtherSessions, setSignOutOfOtherSessions] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [updateError, setUpdateError] = useState("");

  const [ktererInfo, setKtererInfo] = useState<KtererInfo | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [profileImageSrc, setProfileImageSrc] = useState(DEFAULT_IMAGE_SRC);

  const { updateNotifications } = useNotifications();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profile_image_url: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      country: "",
      email_notification: false,
      bio: "",
      ethnicity: "",
      experienceUnit: 0,
      experienceValue: "Days",
      street_address: "",
      province: "",
      city: "",
      apartment: 0,
      postal_code: "",
    },
  });

  const {setValue} = form;

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
        setKtererInfo(data.user);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

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

    getKtererAccountInfo().catch((error) => {
      console.error("An error occurred:", error);
    });
  }, []);

  useEffect(() => {
    if (ktererInfo) {


      let {
        first_name = "",
        last_name = "",
        email = "",
        phone = "",
        country = "",
        email_notification = false,
        kterer = {},
      } = ktererInfo;

      email_notification = Boolean(email_notification);

      const formValues = {
        first_name,
        last_name,
        email,
        phone:phone ? phone : "+1",
        country,
        email_notification,
        profile_image_url: kterer?.profile_image_url || "",
        bio: kterer?.bio || "",
        ethnicity: kterer?.ethnicity || "",
        experienceUnit: kterer?.experienceUnit || 0,
        experienceValue: kterer?.experienceValue || "Days",
        street_address:kterer?.street_address,
        province:kterer?.province,
        city:kterer?.city,
        apartment:kterer?.apartment,
        postal_code:kterer?.postal_code,
      };


      (Object.keys(formValues) as Array<keyof typeof formValues>).forEach(
        (key) => {
          form.setValue(key, formValues[key], { shouldValidate: true });
        }
      );
    }

  }, [ktererInfo, form]);

  useEffect(() => {
    if (!isPasswordResetOpen) {
      setUpdateError("");
      setCurrentPassword("");
      setNewPassword("");
    }
  }, [isPasswordResetOpen]);

  const deleteAccount = async () => {
    // TODO: We should use a transaction here to delete the user from the db and Clerk. Dont have time to implement this now.
    if (!ktererInfo || !ktererInfo.client_id) {
      console.error("User info or Client ID missing");
      return;
    }

    try {
      // First, delete the user from the database
      const accessToken = localStorage.getItem("accessToken");
      const apiURL = process.env.NEXT_PUBLIC_API_URL;
      const dbResponse = await fetch(`${apiURL}/api/user`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!dbResponse.ok) {
        console.error(`Error: ${dbResponse.statusText}`);
        return;
      }

      // Now, if the db deletion was successful, delete the user from Clerk
      const clerkResponse = await fetch(`/api/consumer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: ktererInfo.client_id }),
      });

      if (!clerkResponse.ok) {
        console.error(`Error: ${clerkResponse.statusText}`);
        return;
      }

      const clerkData = await clerkResponse.json();

      if (clerkData.success) {
        try {
          await signOut();
          localStorage.removeItem("accessToken");
          router.push("/");
        } catch (error) {
          console.error("Failed to sign out");
        }
      } else {
        console.error("Failed to delete account");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {

    const formData = new FormData();

    formData.append("bio", values.bio);
    formData.append("ethnicity", values.ethnicity);
    formData.append("experienceUnit", values.experienceUnit.toString());
    formData.append("experienceValue", values.experienceValue);

    formData.append("first_name", values.first_name);
    formData.append("last_name", values.last_name);
    formData.append("phone", values.phone);
    formData.append("email_notification", String(Number(values.email_notification)));
    
    formData.append("street_address", values.street_address);
    formData.append("city", values.city);
    formData.append("province", values.province);
    formData.append("apartment", values.apartment.toString());
    formData.append("postal_code", values.postal_code);


    if (values.profile_image_url instanceof File) {
      formData.append(
        "profile_image_url",
        values.profile_image_url,
        values.profile_image_url.name
      );
    } else {
      formData.append("profile_image_url", values.profile_image_url);
    }
    formData.append("_method", "PUT");

    const accessToken = localStorage.getItem("accessToken");
    const apiURL = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiURL}/api/kterer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });
    
    if (response.ok) {
      const data = await response.json();

      if(data?.status == 400){
        toast({
          description: (
            <>
            <div className="flex items-center">
              <XCircleIcon className="w-6 h-6 inline-block align-text-bottom mr-2 text-red-400" />
              {data.message}
            </div>
          </>
          ),
        });
      }else{
        toast({
          description: (
            <>
            <div className="flex items-center">
              <CheckCircleIcon className="w-6 h-6 inline-block align-text-bottom mr-2 text-green-400" />
              Account Info Successfully Updated!
            </div>
          </>
          ),
        });
      }
    } else {
      console.error(`Error: ${response.statusText}`);
    }
  }

  useEffect(() => {
    if (ktererInfo) {
      setProfileImageSrc(
        ktererInfo?.kterer?.profile_image_url || DEFAULT_IMAGE_SRC
      );
    }
  }, [ktererInfo]);

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

  const handleRemovePicture = () => {
    setProfileImageSrc(DEFAULT_IMAGE_SRC);
    form.setValue("profile_image_url", "");
  };

  const handlePasswordUpdate = async () => {
    try {
      await user?.updatePassword({
        newPassword: newPassword,
        currentPassword: currentPassword,
        signOutOfOtherSessions: signOutOfOtherSessions,
      });
      setUpdateSuccess(true);
      setUpdateError("");
    } catch (error) {
      console.error("Error updating password:", error);
      const errorMessage =
        "Error! Please check your current and new passwords or have a strong new password.";
      setUpdateError(errorMessage);
    }
  };

  const handleInputPhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    event.target.value = value.replace(/[^\d+]/g, ''); // Solo permite dígitos y el símbolo +
  };

  // Google Places 
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);

  const handleFocus = () => {
    setInput("");
  };

  useEffect(() => {
    loadGoogleMapsAPI(() => {});
  }, []);

  const fetchSuggestions = (value: string) => {
    setInput(value);
    if (value.length > 2) {
      const autocompleteService = new google.maps.places.AutocompleteService();
      autocompleteService.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: "CA" },
        },
        (predictions, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
        }
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestion =  (suggestion:any) =>{
    suggestion.terms.pop();

    const length = suggestion.terms.length;
    const reverse = suggestion.terms.reverse();
    let stree = '';
    if(length >= 3){
      for (let i = length-1 ; i >= 0 ; i--) {
        if(i== 0 ){
          setValue('province' , reverse[i].value , { shouldValidate: true });
        }else if(i==1){
          setValue('city' , reverse[i].value , { shouldValidate: true });
        }else{
          stree += reverse[i].value + ', ';
        }
        

      }
      setValue('street_address' , stree.slice(0, -2) , { shouldValidate: true });
    }
    setInput(suggestion.description);
    setSuggestions([]);
  };


  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between my-8">
          <div className="text-2xl font-bold ">Kterer Account</div>
          <button
            onClick={() => setIsPasswordResetOpen(true)}
            className="rounded-full px-4 py-2.5 font-semibold border text-primary-color hover:bg-gray-50 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"
          >
            Change Password
          </button>
        </div>
        <div className="max-w-2xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" id="kterer_acount_form">
              <div className="my-10 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2">
                <div className="col-span-2 text-center">
                  <h1 className="text-xl font-bold mb-2">Profile Picture</h1>
                  <img
                    className="inline-block h-28 w-28 rounded-full mb-4"
                    src={profileImageSrc}
                    alt=""
                  />
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
                            <div className="space-x-2">
                              <label
                                htmlFor="profilePictureInput"
                                className="cursor-pointer text-sm md:text-base rounded-full bg-primary-color px-3 md:px-4 py-2 font-semibold text-white shadow-sm hover:bg-primary-color-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              >
                                Choose File
                              </label>
                              {/* TODO: default pic doesnt save to db */}
                              <button
                                type="button"
                                onClick={handleRemovePicture}
                                className="mt-4 text-sm md:text-base border rounded-full px-3 md:px-4 py-2 font-semibold text-primary-color shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input className="rounded-full" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input className="rounded-full" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input disabled className="rounded-full" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input className="rounded-full" {...field} onInput={handleInputPhone} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* address fields */}
                {/* Search Google Place API */}
                <div className="py-4 col-span-2">
                  {/* Search bar */}
                  <div className="relative">
                    {/* Icon */}
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="w-5 h-5" />
                    </div>
                    {/* Input */}
                    <Input
                      type="text"
                      className="rounded-full pl-10 pr-3 py-2"
                      placeholder="Search for an address"
                      onChange={(e) => fetchSuggestions(e.target.value)}
                      onFocus={handleFocus}
                      autoComplete="off"
                      value={input}
                    />
                    {suggestions.length > 0 && (
                      <div className="absolute z-10 bg-white shadow-lg max-h-60 overflow-auto w-full mt-1 rounded-md">
                        {suggestions.map((suggestion) => (
                          <div
                            key={suggestion.place_id}
                            className="p-4 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSuggestion(suggestion)}
                          >
                            {suggestion.description}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                  {/* ----------------------- */}
                <div className="col-span-2 sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="street_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input className="rounded-full" {...field} disabled/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input className="rounded-full" {...field} disabled/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
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
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                          <Input className="rounded-full" {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input className="rounded-full" disabled {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
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
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="email_notification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mt-4">Email Notification</FormLabel>
                        <FormControl>
                          <Switch className="rounded-full" checked={field.value} onCheckedChange={(checked) => field.onChange(checked)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>



                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us a little bit about yourself"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <FormField
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
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <FormField
                    control={form.control}
                    name="experienceUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g: 1,2,3..."
                            className="rounded-full"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 self-end">
                  <FormField
                    control={form.control}
                    name="experienceValue"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl className="rounded-full">
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
                <Button
                  type="submit"
                  className="col-span-2 bg-primary-color w-full sm:w-auto hover:bg-primary-color-hover rounded-full"
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className="flex flex-col my-16 max-w-xs w-full mx-auto items-center">
          <button
            onClick={() => setIsDeleteAccountOpen(true)}
            className="border mt-4 rounded-full px-4 py-2.5 font-semibold text-primary-color hover:bg-gray-50 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"
          >
            Delete Account
          </button>
        </div>
      </div>

      <AlertDialog
        open={isDeleteAccountOpen}
        onOpenChange={setIsDeleteAccountOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure to delete this account?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <Button onClick={deleteAccount}>Confirm</Button>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={isPasswordResetOpen}
        onOpenChange={setIsPasswordResetOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Password</AlertDialogTitle>
            {!updateSuccess ? (
              <AlertDialogDescription>
                Enter your current and new password.
              </AlertDialogDescription>
            ) : (
              <>
                <AlertDialogDescription>
                  Your password has been updated successfully.
                </AlertDialogDescription>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </>
            )}
          </AlertDialogHeader>
          {!updateSuccess && (
            <AlertDialogFooter>
              <div className="flex flex-col w-full space-y-8">
                <div className="space-y-4">
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current Password"
                  />
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                  />
                </div>
                {updateError && (
                  <div className="rounded-md bg-red-50 p-4 col-span-6">
                    <div className="flex">
                      <div className="ml-2">
                        <h3 className="text-sm font-medium text-red-800">
                          {updateError}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}
                <div className="space-x-4">
                  <Button onClick={handlePasswordUpdate}>
                    Update Password
                  </Button>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </div>
              </div>
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

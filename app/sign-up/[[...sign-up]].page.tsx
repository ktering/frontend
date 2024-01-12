"use client"
import {useState} from "react";
import {useSignUp} from "@clerk/nextjs";
import {useRouter} from "next/navigation";
import RedLogo from "@/static/newlogo.svg"
import Image from "next/image";

export default function SignUpForm() {
    const {isLoaded, signUp, setActive} = useSignUp();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!isLoaded) {
            return;
        }

        try {
            await signUp.create({
                firstName,
                lastName,
                phoneNumber,
                emailAddress,
                password,
            });

            // send the email.
            await signUp.prepareEmailAddressVerification({strategy: "email_code"});

            // change the UI to our pending section.
            setPendingVerification(true);
        } catch (err: any) {
            const errorMessage = JSON.stringify(err.errors[0].longMessage);
            setErrorMessage(errorMessage.slice(1, -1));
            console.error(JSON.stringify(err, null, 2));

            setTimeout(() => {
                setErrorMessage("");
            }, 5000);
        }
    };

    // This verifies the user using email code that is delivered.
    const onPressVerify = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!isLoaded) {
            return;
        }

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });
            if (completeSignUp.status !== "complete") {
                console.log('completeSignUp', completeSignUp);
                /*  investigate the response, to see if there was an error
                 or if the user needs to complete more steps.*/
                console.log(JSON.stringify(completeSignUp, null, 2));
            }
            if (completeSignUp.status === "complete") {
                await setActive({session: completeSignUp.createdSessionId})
                const userId = completeSignUp.createdUserId;

                // Update the metadata
                const response = await fetch('/api/kterer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({userId, ktererSignUpCompleted: false}),
                });

                const apiURL = process.env.NEXT_PUBLIC_API_URL;
                const registerResponse = await fetch(`${apiURL}/api/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        client_id: userId,
                        first_name: completeSignUp.firstName,
                        last_name: completeSignUp.lastName,
                        user_type: "kterer",
                        email: completeSignUp.emailAddress,
                        phone: completeSignUp.phoneNumber,
                    }),
                });

                const registerData = await registerResponse.json();
                localStorage.setItem('accessToken', registerData.token);

                if (response.ok && registerResponse.ok) {
                    const responseJson = await response.json();
                    const user = responseJson.user;
                    if (user.publicMetadata.ktererSignUpCompleted === false) {
                        router.push("/kterer-onboarding/kterer-setup");
                    } else {
                        console.log('Metadata updated not updated to false');
                    }
                } else {
                    console.log(response.statusText);
                }
            }
        } catch (err: any) {
            const errorMessage = JSON.stringify(err.errors[0].longMessage);
            setErrorMessage(errorMessage.slice(1, -1));
            console.error(JSON.stringify(err, null, 2));

            setTimeout(() => {
                setErrorMessage("");
            }, 5000);
        }
    };

    return (
        <>
            {!pendingVerification && (
                <div>
                    <div className="mt-3">
                        <Image src={RedLogo} width={75} alt="logo" className="mb-4"/>
                        <p className="text-xl font-bold mb-1">Create your Kterer account</p>
                        <p>to continue to Kterings</p>


                        <form className="text-black">
                            <div className="mt-2">
                                <div className="mt-10 grid grid-cols-1 auto-cols-fr gap-x-6 gap-y-4 sm:grid-cols-6">
                                    {/* First Name */}
                                    <div className="col-span-3 sm:col-span-3">
                                        <label
                                            htmlFor="firstName"
                                            className="block text-left text-sm font-medium leading-6 text-gray-900"
                                        >
                                            First Name
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                onChange={(e) => setFirstName(e.target.value)}
                                                id="firstName"
                                                name="firstName"
                                                type="text"
                                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-color sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    {/* Last Name */}
                                    <div className="col-span-3 sm:col-span-3">
                                        <label
                                            htmlFor="lastName"
                                            className="block text-left text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Last Name
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                onChange={(e) => setLastName(e.target.value)}
                                                id="lastName"
                                                name="lastName"
                                                type="text"
                                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-color sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="col-span-6">
                                        <label
                                            htmlFor="email"
                                            className="block text-left text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Email
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                onChange={(e) => setEmailAddress(e.target.value)}
                                                id="email"
                                                name="email"
                                                type="email"
                                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-color sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Number */}
                                    <div className="col-span-6">
                                        <label
                                            htmlFor="phoneNumber"
                                            className="block text-left text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Phone Number
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                type="text"
                                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-color sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="col-span-6">
                                        <label
                                            htmlFor="password"
                                            className="block text-left text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Password
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                onChange={(e) => setPassword(e.target.value)}
                                                id="password"
                                                name="password"
                                                type="password"
                                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-color sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    {errorMessage && (
                                        <div className="rounded-md bg-red-50 p-4 col-span-6">
                                            <div className="flex">
                                                <div className="ml-2">
                                                    <h3 className="text-sm font-medium text-red-800">{errorMessage}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div
                                        className="mt-4 col-span-6 sm:mt-4">
                                        <button
                                            type="submit"
                                            onClick={handleSubmit}
                                            className="inline-flex w-full justify-center rounded-md bg-primary-color px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-color-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color sm:col-start-2"
                                        >
                                            Sign Up
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {pendingVerification && (
                <div>
                    <div className="mt-3">
                        <Image src={RedLogo} width={75} alt="logo" className="mb-4"/>
                        <p className="text-xl font-bold mb-1">Create your Kterer account</p>
                        <p>to continue to Kterings</p>

                        <form className="text-black">
                            <div className="mt-2">
                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                                    {/* Verification Code */}
                                    <div className="col-span-6">
                                        <label className="block text-left text-sm font-medium leading-6 text-gray-900">
                                            Verification Code
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                value={code}
                                                onChange={(e) => setCode(e.target.value)}
                                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-color sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    {errorMessage && (
                                        <div className="rounded-md bg-red-50 p-4 col-span-6">
                                            <div className="flex">
                                                <div className="ml-2">
                                                    <h3 className="text-sm font-medium text-red-800">{errorMessage}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div
                                        className="mt-5 col-span-6 sm:mt-6">
                                        <button
                                            onClick={onPressVerify}
                                            className="inline-flex w-full justify-center rounded-md bg-primary-color px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-color-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color sm:col-start-2"
                                        >
                                            Verify Email
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { AccountCircle, Edit } from "@mui/icons-material";
import "react-international-phone/style.css";
import VerificationInput from "react-verification-input";
import RedLogo from "@/static/red-logo.svg";
import Image from "next/image";
import { MuiPhone } from "@/components/MuiPhone";

export default function SignUpForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [iso2, setIso2] = useState<string>("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [pendingVerificationPhoneNumber, setPendingVerificationPhoneNumber] =
    useState(false);
  const [code, setCode] = useState("");
  const [codePhoneNumber, setCodePhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(30);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const router = useRouter();

  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  /** #################################################################################################### */
  const startTimer = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    setIsResendDisabled(true);
    setTimer(30);

    countdownRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(countdownRef.current as NodeJS.Timeout);
          setIsResendDisabled(false);
          return 0;
        }
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (pendingVerification || pendingVerificationPhoneNumber) {
      startTimer();
    }
  }, [pendingVerification, pendingVerificationPhoneNumber]);

  const handleResendCode = async (type: string) => {
    try {
      if (type === "email") {
        await signUp?.prepareEmailAddressVerification({
          strategy: "email_code",
        });
      } else if (type === "phone") {
        await signUp?.preparePhoneNumberVerification({
          strategy: "phone_code",
        });
      } else {
        return;
      }

      //----
      startTimer();
    } catch (error: any) {}
  };

  const handleBackRegisterForm = () => {
    setCode("");
    setCodePhoneNumber("");
    setPendingVerification(false);
    setPendingVerificationPhoneNumber(false);

    //----
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    //----
    setIsResendDisabled(true);
    setTimer(30);
  };
  /** #################################################################################################### */

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }
    // Telephone field in the form has been hidden to allow the correct registration of the user kterer.
    try {
      await signUp.create({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        emailAddress: email,
        password,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err: any) {
      if (err.errors[0].code === "form_param_format_invalid") {
        setErrorMessage("Phone number is required");
      } else {
        const errorMessage = JSON.stringify(err.errors[0].longMessage);
        setErrorMessage(errorMessage.slice(1, -1));
      }
      //----
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  // This verifies the user using email code that is delivered.
  const onPressVerify = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    setIsVerifyingEmail(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      // console.log("Complete Email code", completeSignUp);

      if (completeSignUp.status !== "complete") {
        // console.log("completeSignUp", completeSignUp);
        /*  investigate the response, to see if there was an error
                 or if the user needs to complete more steps.*/
        // console.log(JSON.stringify(completeSignUp, null, 2));
      }
      //----
      await signUp.preparePhoneNumberVerification({ strategy: "phone_code" });
      //----
      setPendingVerification(false);
      setPendingVerificationPhoneNumber(true);
      //----
      setIsResendDisabled(true);
      startTimer();
    } catch (err: any) {
      const errorMessage = JSON.stringify(err.errors[0].longMessage);
      setErrorMessage(errorMessage.slice(1, -1));
      // console.error(JSON.stringify(err, null, 2));

      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const onPressVerifyPhoneNumber = async (e: {
    preventDefault: () => void;
  }) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    setIsVerifyingPhone(true);

    try {
      const completeSignUp = await signUp.attemptPhoneNumberVerification({
        code: codePhoneNumber,
      });

      // console.log("Complete Phone code", completeSignUp);

      if (completeSignUp.status !== "complete") {
        // console.log("completeSignUp", completeSignUp);
        /*  investigate the response, to see if there was an error or if the user needs to complete more steps.*/
        // console.log(JSON.stringify(completeSignUp, null, 2));
      }

      await setActive({ session: completeSignUp.createdSessionId });
      const userId = completeSignUp.createdUserId;

      // Update the metadata
      const response = await fetch("/api/kterer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, ktererSignUpCompleted: false }),
      });

      const apiURL = process.env.NEXT_PUBLIC_API_URL;
      const registerResponse = await fetch(`${apiURL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      localStorage.setItem("accessToken", registerData.token);

      if (response.ok && registerResponse.ok) {
        const responseJson = await response.json();
        const user = responseJson.user;

        if (user.publicMetadata.ktererSignUpCompleted === false) {
          // console.log("metadata", user.publicMetadata.ktererSignUpCompleted);
          router.push("/kterer-onboarding/kterer-setup");
        } else {
          // console.log("Metadata updated not updated to false");
        }
      } else {
        // console.log(response.statusText);
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setIsVerifyingPhone(false);
    }
  };

  const handlePhoneChange = (
    newPhone: string,
    newInputValue: string,
    newIso2: string
  ) => {
    setPhoneNumber(newPhone);
    setInputValue(newInputValue);
    setIso2(newIso2);
  };

  return (
    <>
      {!pendingVerification && !pendingVerificationPhoneNumber && (
        <div>
          <div className="mt-3">
            <Image src={RedLogo} width={75} alt="logo" className="mb-4" />
            <p className="text-xl font-bold mb-1">Create your Kterer account</p>
            <p>to continue to Kterings</p>

            <form onSubmit={handleSubmit} className="text-black">
              <div className="mt-2">
                <div className="mt-10 grid grid-cols-1 auto-cols-fr gap-x-6 gap-y-4 sm:grid-cols-6">
                  <div className="col-span-3 sm:col-span-3">
                    <label
                      htmlFor="first_name"
                      className="block text-left text-sm font-medium leading-6 text-gray-900"
                    >
                      First Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-color sm:text-sm sm:leading-6"
                        required={true}
                      />
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-3">
                    <label
                      htmlFor="last_name"
                      className="block text-left text-sm font-medium leading-6 text-gray-900"
                    >
                      Last Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-color sm:text-sm sm:leading-6"
                        required={true}
                      />
                    </div>
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="email"
                      className="block text-left text-sm font-medium leading-6 text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-color sm:text-sm sm:leading-6"
                        required={true}
                      />
                    </div>
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="phone_number"
                      className="block text-left text-sm font-medium leading-6 text-gray-900"
                    >
                      Phone Number
                    </label>
                    <div className="mt-2">
                      <MuiPhone
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        required={true}
                      />
                    </div>
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="password"
                      className="block text-left text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="mt-2">
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-color sm:text-sm sm:leading-6"
                        required={true}
                      />
                    </div>
                  </div>
                  <div className="mt-4 col-span-6 sm:mt-4">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-primary-color px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-color-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color sm:col-start-2"
                    >
                      Sign Up
                    </button>
                  </div>
                  {errorMessage && (
                    <div className="rounded-md bg-red-50 p-4 col-span-6">
                      <div className="flex">
                        <div className="ml-2">
                          <h3 className="text-sm font-medium text-red-800">
                            {errorMessage}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {pendingVerification && (
        <div>
          <div className="mt-3">
            <Image src={RedLogo} width={75} alt="logo" className="mb-4" />
            <p className="text-xl font-bold mb-1">Verify your email</p>
            <p>to continue to Kterings</p>
            {/* EditEmailPhone */}
            <EditEmailPhone
              text={email || "info@cropdefenders.com"}
              onClick={handleBackRegisterForm}
            />
            {/* EditEmailPhone */}
            <form className="text-black">
              <div className="mt-2">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                  {/* Verification Code */}
                  <div className="col-span-6">
                    <label className="block text-left text-sm font-medium leading-6 text-gray-900">
                      Verification Code
                      <p>
                        Enter the verification code sent to your email address
                      </p>
                    </label>
                    <div className="mt-2">
                      <VerificationInput
                        validChars="0-9"
                        inputProps={{ inputMode: "numeric" }}
                        length={6}
                        placeholder=""
                        classNames={{
                          character: "character",
                          characterInactive: "character--inactive",
                          characterSelected: "character--selected",
                        }}
                        value={code}
                        onChange={(value) => setCode(value)}
                      />
                    </div>
                  </div>
                  <div className="mt-5 col-span-6 sm:mt-6">
                    <TimerButton
                      disabled={isResendDisabled}
                      timer={timer}
                      onClick={() => handleResendCode("email")}
                    />
                  </div>
                  <div className="mt-5 col-span-6 sm:mt-6">
                    <button
                      onClick={onPressVerify}
                      disabled={code.length !== 6 || isVerifyingEmail}
                      className="inline-flex w-full justify-center rounded-md bg-primary-color px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-color-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color sm:col-start-2 disabled:opacity-45"
                    >
                      {isVerifyingEmail ? <CircularProgress size={24} style={{ color: '#fff' }} /> : "Verify Email"}
                    </button>
                  </div>
                  {errorMessage && (
                    <div className="rounded-md bg-red-50 p-4 col-span-6">
                      <div className="flex">
                        <div className="ml-2">
                          <h3 className="text-sm font-medium text-red-800">
                            {errorMessage}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {pendingVerificationPhoneNumber && (
        <div>
          <div className="mt-3">
            <Image src={RedLogo} width={75} alt="logo" className="mb-4" />
            <p className="text-xl font-bold mb-1">Create your Kterer account</p>
            <p>to continue to Kterings</p>
            {/* EditEmailPhone */}
            <EditEmailPhone
              text={`${iso2.toLocaleUpperCase() || "CA"} ${
                inputValue || "+1 (519) 564-3878"
              }`}
              onClick={handleBackRegisterForm}
            />
            {/* EditEmailPhone */}
            <form className="text-black">
              <div className="mt-2">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                  {/* Verification Code */}
                  <div className="col-span-6">
                    <label className="block text-left text-sm font-medium leading-6 text-gray-900">
                      Verification Code
                      <p>
                        Enter the verification code sent to your phone number
                      </p>
                    </label>
                    <div className="mt-2">
                      <VerificationInput
                        validChars="0-9"
                        inputProps={{ inputMode: "numeric" }}
                        length={6}
                        placeholder=""
                        classNames={{
                          character: "character",
                          characterInactive: "character--inactive",
                          characterSelected: "character--selected",
                        }}
                        value={codePhoneNumber}
                        onChange={(value) => setCodePhoneNumber(value)}
                      />
                    </div>
                  </div>
                  <div className="mt-5 col-span-6 sm:mt-6">
                    <TimerButton
                      disabled={isResendDisabled}
                      timer={timer}
                      onClick={() => handleResendCode("phone")}
                    />
                  </div>
                  <div className="mt-5 col-span-6 sm:mt-6">
                    <button
                      onClick={onPressVerifyPhoneNumber}
                      disabled={codePhoneNumber.length !== 6 || isVerifyingPhone}
                      className="inline-flex w-full justify-center rounded-md bg-primary-color px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-color-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color sm:col-start-2 disabled:opacity-45"
                    >
                      {isVerifyingPhone ? <CircularProgress size={24} style={{ color: '#fff' }} /> : "Verify Phone Number"}
                    </button>
                  </div>
                  {errorMessage && (
                    <div className="rounded-md bg-red-50 p-4 col-span-6">
                      <div className="flex">
                        <div className="ml-2">
                          <h3 className="text-sm font-medium text-red-800">
                            {errorMessage}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

interface EditEmailPhoneProps {
  text?: string;
  onClick?: () => void;
}

const EditEmailPhone: React.FC<EditEmailPhoneProps> = ({ text, onClick }) => {
  return (
    <div className="mt-10">
      <div className="bg-gray-100 border-2 drop-shadow-sm inline-flex items-center px-4 py-1 rounded-full">
        <div>
          <AccountCircle color="action" fontSize="medium" />
        </div>
        <div className="ms-2">
          <p className="text-gray-500 text-sm">{text}</p>
        </div>
        <div className="ms-1">
          <IconButton size="small" onClick={onClick}>
            <Edit color="primary" fontSize="inherit" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

interface TimerButtonProps {
  disabled: boolean;
  timer?: number;
  onClick: () => void;
}

const TimerButton: React.FC<TimerButtonProps> = ({
  disabled,
  timer,
  onClick,
}) => {
  return (
    <Button
      disabled={disabled}
      variant="text"
      size="medium"
      style={{ textTransform: "none" }}
      onClick={onClick}
    >
      Didn't receive a code? Resend {timer > 0 ? `(${timer})` : ""}
    </Button>
  );
};

import { SetStateAction, useEffect, useState } from "react";
import { loadGoogleMapsAPI } from "@/lib/loadGoogleMapsAPI";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Radio } from "@mui/material";
import { BriefcaseIcon, HomeIcon } from "@heroicons/react/24/solid";
import { PencilIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useUser } from "@clerk/nextjs";
import {
  AddressPopupProps,
  AddressSectionProps,
  AddressType,
} from "@/types/components/addressPopup";

const AddressSection = ({
  label,
  address,
  onEdit,
  isEditing,
  showRadioButton,
  selectedAddress,
  onRadioChange,
}: AddressSectionProps & {
  showRadioButton: boolean;
  selectedAddress: any;
  onRadioChange: any;
}) => (
  <div
    className={`flex justify-between items-center ${
      isEditing || selectedAddress === label ? "bg-red-100" : ""
    } p-4 rounded-md`}
  >
    {/* Conditional and Radius element are added */}
    {showRadioButton && (
      <Radio
        size="small"
        color="error"
        value={label}
        checked={selectedAddress === label}
        onChange={onRadioChange}
        name="selectedAddress"
        inputProps={{ "aria-label": label }}
      />
    )}
    {label === "home" ? (
      <HomeIcon className="h-6 w-6" />
    ) : (
      <BriefcaseIcon className="h-6 w-6" />
    )}
    {/* Validates to paint the text according to the selected option. */}
    <p className="flex-grow mx-4 text-left italic">
      <span className="not-italic font-bold">
        {address && label === "home"
          ? "Home"
          : address && label === "work"
          ? "Workplace"
          : ""}
      </span>
      {address && <br />}
      {address || (label === "home" ? "No Home Address" : "No Work Address")}
    </p>
    <button
      onClick={onEdit}
      className={`${
        address
          ? "p-2"
          : "bg-primary-color hover:bg-primary-color-hover text-white shadow-sm focus-visible:outline px-2 py-1 text-xs"
      }`}
    >
      {address ? <PencilIcon className="h-5 w-5" /> : "Add"}
    </button>
  </div>
);

const AddressPopup = ({
  isAddressPopupOpen,
  setIsAddressPopupOpen,
  setAddressChanged,
}: AddressPopupProps) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [homeAddress, setHomeAddress] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [editing, setEditing] = useState("");
  // The dialog title is dynamically updated according to the type of address being edited.
  const [dialogTitle, setDialogTitle] = useState("Add/Edit Addresses");
  // This status has been added to control the visibility of the search engine and the buttons
  const [showSearchAndButtons, setShowSearchAndButtons] = useState(false);
  // Is added state Validate Radius checked
  const [selectedAddress, setSelectedAddress] = useState<null | string>(null);
  const handleRadioChange = (event: { target: { value: string } }) => {
    setSelectedAddress(event.target.value);
  };

  const user = useUser();

  if (!user) {
    return null;
  }

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

  // Event is added to the input so that the content is erased
  const handleFocus = () => {
    setInput("");
  };

  // Automatic event to clear the input search
  useEffect(() => {
    if (
      (editing === "home" && homeAddress !== "") ||
      (editing === "work" && officeAddress !== "")
    ) {
      handleFocus();
    }
  }, [editing, homeAddress, officeAddress]);

  const fetchAddresses = () => {
    const accessToken = localStorage.getItem("accessToken");
    const apiURL = process.env.NEXT_PUBLIC_API_URL;
    if (user && user.user && user.user.id) {
      const user_id = new URLSearchParams({
        user_id: user.user.id,
      }).toString();

      fetch(`${apiURL}/api/address?${user_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch addresses");
          }
          return response.json();
        })
        .then((data) => {
          const homeAddress = data.home ? data.home.address : "";
          const officeAddress = data.work ? data.work.address : "";

          setHomeAddress(homeAddress);
          setOfficeAddress(officeAddress);

          if (homeAddress !== "") {
            setSelectedAddress("home");
          }
        })
        .catch((error) => {
          console.error("Error fetching addresses:", error);
        });
    }
  };

  const saveAddress = (type: AddressType) => {
    const addressValue = input;

    if (addressValue.trim()) {
      const apiURL = process.env.NEXT_PUBLIC_API_URL;
      // const url = `${apiURL}/api/address/${user.id}}`;
      const url = `${apiURL}/api/address`;

      const payload = {
        address: addressValue,
        type: type,
      };

      // console.log("Saving address:", payload);

      const accessToken = localStorage.getItem("accessToken");

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setAddressChanged(true);
          setIsAddressPopupOpen(false);
          if (type === "home") {
            setHomeAddress(addressValue);
          } else {
            setOfficeAddress(addressValue);
          }
          setInput("");
          setEditing("");
          setShowSearchAndButtons(false);
        })
        .catch((error) => {
          console.error("Failed to update address:", error);
        });
    } else {
      console.error("No address to save, input is empty.");
    }
  };

  useEffect(() => {
    if (!isAddressPopupOpen) {
      setInput("");
      setEditing("");
    }
  }, [isAddressPopupOpen]);

  useEffect(() => {
    if (isAddressPopupOpen) {
      fetchAddresses();
    }
  }, [isAddressPopupOpen]);

  const editAddress = (type: string) => {
    if (type === "home") {
      setInput(homeAddress);
      setEditing("home");
      if (homeAddress === "") {
        setDialogTitle("Add Home Address");
      } else {
        setDialogTitle("Edit Address");
      }
    } else if (type === "work") {
      setInput(officeAddress);
      setEditing("work");
      if (officeAddress === "") {
        setDialogTitle("Add Work Address");
      } else {
        setDialogTitle("Edit Address");
      }
    }
    setShowSearchAndButtons(true);
  };

  useEffect(() => {
    loadGoogleMapsAPI(() => {});
  }, []);

  // It is responsible for restoring the initial view
  const handleCancel = () => {
    setShowSearchAndButtons(false);
    setDialogTitle("Add/Edit Addresses");
    setInput("");
    setEditing("");
  };

  // Added to validate when the RadioButton is displayed.
  const showRadioButton = homeAddress !== "" || officeAddress !== "";

  return (
    // the dialogTitle variable displays dynamic text according to the selected option
    <Dialog open={isAddressPopupOpen} onOpenChange={setIsAddressPopupOpen}>
      <DialogContent>
        <DialogTitle>
          {editing === "home" && homeAddress === "" ? (
            <HomeIcon className="h-6 w-6 inline-block mr-2 pb-1" />
          ) : editing === "work" && officeAddress === "" ? (
            <BriefcaseIcon className="h-6 w-6 inline-block mr-2 pb-1" />
          ) : null}
          {dialogTitle}
        </DialogTitle>

        {editing === "home" && homeAddress !== "" ? (
          <p className="flex-grow mx-4 text-left italic">
            <span className="not-italic font-bold">Current Address</span>
            <br />
            {homeAddress}
          </p>
        ) : editing === "work" && officeAddress !== "" ? (
          <p className="flex-grow mx-4 text-left italic">
            <span className="not-italic font-bold">Current Address</span>
            <br />
            {officeAddress}
          </p>
        ) : null}

        {showSearchAndButtons ? (
          <div className="py-4">
            {/* Search bar */}
            <div className="relative mr-4">
              {/* Icon */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </div>
              {/* Input */}
              <Input
                type="text"
                className="rounded-md pl-10 pr-3 py-2"
                placeholder={
                  editing === "home" && homeAddress !== ""
                    ? "New Address"
                    : editing === "work" && officeAddress !== ""
                    ? "New Address"
                    : "Search for an address"
                }
                onChange={(e) => fetchSuggestions(e.target.value)}
                onFocus={handleFocus}
                value={input}
              />
              {suggestions.length > 0 && (
                <div className="absolute z-10 bg-white shadow-lg max-h-60 overflow-auto w-full mt-1 rounded-md">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.place_id}
                      className="p-4 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setInput(suggestion.description);
                        setSuggestions([]);
                      }}
                    >
                      {suggestion.description}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {!showSearchAndButtons ? (
          <div className="space-y-4 py-4">
            <AddressSection
              label="home"
              address={homeAddress}
              onEdit={() => editAddress("home")}
              isEditing={editing === "home"}
              showRadioButton={showRadioButton}
              selectedAddress={selectedAddress}
              onRadioChange={handleRadioChange}
            />
            <AddressSection
              label="work"
              address={officeAddress}
              onEdit={() => editAddress("work")}
              isEditing={editing === "work"}
              showRadioButton={showRadioButton}
              selectedAddress={selectedAddress}
              onRadioChange={handleRadioChange}
            />
          </div>
        ) : null}

        {showSearchAndButtons ? (
          <div className="flex flex-col items-center pt-4 space-y-2">
            {/* Added conditions for displaying informative text */}
            {editing === "home" && homeAddress !== "" ? (
              <span className="text-sm">Editing Home Address</span>
            ) : editing === "work" && officeAddress !== "" ? (
              <span className="text-sm">Editing Work Address</span>
            ) : null}

            <div className="flex space-x-2">
              <button
                onClick={() =>
                  saveAddress(editing === "work" ? "work" : "home")
                }
                className="rounded-full bg-primary-color hover:bg-primary-color-hover px-5 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"
              >
                {editing === "home" && homeAddress !== ""
                  ? "Save"
                  : editing === "work" && officeAddress !== ""
                  ? "Save"
                  : "Add & Save"}
              </button>

              {/* A "Cancel" button was added to restore the initial view. */}
              <button
                onClick={handleCancel}
                className="rounded-full bg-gray-400 hover:bg-gray-500 px-5 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
              >
                {editing === "home" && homeAddress !== ""
                  ? "Back"
                  : editing === "work" && officeAddress !== ""
                  ? "Back"
                  : "Cancel"}
              </button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default AddressPopup;

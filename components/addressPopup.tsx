import {useEffect, useState} from 'react';
import {loadGoogleMapsAPI} from "@/lib/loadGoogleMapsAPI";
import {Dialog, DialogContent, DialogTitle,} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input";
import {BriefcaseIcon, HomeIcon, PencilSquareIcon} from "@heroicons/react/24/solid";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {useUser} from "@clerk/nextjs";

const AddressSection = ({label, address, onEdit, isEditing}) => (
    <div className={`flex justify-between items-center ${isEditing ? 'bg-red-100' : ''} p-4 rounded-md`}>
        {label === 'home' ? <HomeIcon className="h-6 w-6"/> : <BriefcaseIcon className="h-6 w-6"/>}
        <p className="justify-between mx-4">{address || 'Add address'}</p>
        <button onClick={onEdit} className="h-6 w-6">
            <PencilSquareIcon/>
        </button>
    </div>
);

const AddressPopup = ({isAddressPopupOpen, setIsAddressPopupOpen}) => {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [homeAddress, setHomeAddress] = useState('');
    const [officeAddress, setOfficeAddress] = useState('');
    const [editing, setEditing] = useState('');
    const user = useUser();

    if (!user) {
        return null;
    }

    const fetchSuggestions = (value) => {
        setInput(value);
        if (value.length > 2) {
            const autocompleteService = new google.maps.places.AutocompleteService();
            autocompleteService.getPlacePredictions({
                input: value,
                componentRestrictions: {country: 'CA'}
            }, (predictions, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    setSuggestions(predictions);
                } else {
                    setSuggestions([]);
                }
            });
        } else {
            setSuggestions([]);
        }
    };

    const fetchAddresses = () => {
        const accessToken = localStorage.getItem('accessToken');
        const apiURL = process.env.NEXT_PUBLIC_API_URL;
        fetch(`${apiURL}/api/address`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`, // Include the Authorization header with your access token
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch addresses');
                }
                return response.json();
            })
            .then(data => {
                console.log('Addresses fetched successfully:', data);
                const home = data.address.find((a) => a.type === 'home');
                const office = data.address.find((a) => a.type === 'office');

                setHomeAddress(home ? home.address : '');
                setOfficeAddress(office ? office.address : '');
            })
            .catch(error => {
                console.error('Error fetching addresses:', error);
            });
    };

    const saveAddress = (type) => {
        const addressValue = input; // Get the current value from the input state
        const addressKey = type === 'home' ? 'homeAddress' : 'officeAddress';

        // Assuming 'type' is either 'home' or 'office' and corresponds to your backend logic
        if (addressValue.trim()) {
            const apiURL = process.env.NEXT_PUBLIC_API_URL;
            // const url = `${apiURL}/api/address/${user.id}}`;
            const url = `${apiURL}/api/address`;

            const payload = {
                address: addressValue,
                type: type,
            };

            const accessToken = localStorage.getItem('accessToken');

            fetch(url, {
                method: 'POST', // Use PUT for updating existing data
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload), // Convert the JavaScript object to a JSON string
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Address updated successfully:', data);
                    // Perform any actions on success, such as updating state or UI
                    if (type === 'home') {
                        setHomeAddress(addressValue); // Update the home address in the state
                    } else {
                        setOfficeAddress(addressValue); // Update the office address in the state
                    }
                    setInput(''); // Clear the input field after saving
                    setEditing(''); // Reset editing state
                })
                .catch(error => {
                    console.error('Failed to update address:', error);
                    // Perform any actions on failure, such as showing an error message
                });
        } else {
            console.error('No address to save, input is empty.');
            // Optionally, provide user feedback about the input being empty
        }
    };

    useEffect(() => {
        if (!isAddressPopupOpen) {
            setInput(''); // Reset input when dialog is closed
            setEditing(''); // Reset editing state
        }
    }, [isAddressPopupOpen]);

    useEffect(() => {
        if (isAddressPopupOpen) {
            fetchAddresses();
        }
    }, [isAddressPopupOpen]);

    const editAddress = (type) => {
        if (type === 'home') {
            setInput(homeAddress);
            setEditing('home');
        } else if (type === 'office') {
            setInput(officeAddress);
            setEditing('office');
        }
    };

    useEffect(() => {
        loadGoogleMapsAPI(() => {
        });
    }, []);

    return (
        <Dialog open={isAddressPopupOpen} onOpenChange={setIsAddressPopupOpen}>
            <DialogContent>
                <DialogTitle>Addresses</DialogTitle>
                <div className="py-4">
                    {/* Search bar */}
                    <div className="relative mr-4">
                        {/* Icon */}
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="w-5 h-5"/>
                        </div>
                        {/* Input */}
                        <Input
                            type="text"
                            className="rounded-full pl-10 pr-3 py-2"
                            placeholder="Search for an address"
                            onChange={(e) => fetchSuggestions(e.target.value)}
                            value={input}
                        />
                        {suggestions.length > 0 && (
                            <div
                                className="absolute z-10 bg-white shadow-lg max-h-60 overflow-auto w-full mt-1 rounded-md">
                                {suggestions.map((suggestion, index) => (
                                    <div key={suggestion.place_id} className="p-4 hover:bg-gray-100 cursor-pointer"
                                         onClick={() => {
                                             setInput(suggestion.description);
                                             setSuggestions([]);
                                         }}>
                                        {suggestion.description}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4 py-4">
                    <AddressSection
                        label="home"
                        address={homeAddress}
                        onEdit={() => editAddress('home')}
                        isEditing={editing === 'home'}
                    />
                    <AddressSection
                        label="office"
                        address={officeAddress}
                        onEdit={() => editAddress('office')}
                        isEditing={editing === 'office'}
                    />
                </div>

                <div className="flex flex-col items-center pt-4 space-y-2">
                    {editing && (
                        <span className="text-sm">
                            {`Editing ${editing === 'home' ? 'Home' : 'Office'} Address`}
                        </span>
                    )}
                    <button
                        onClick={() => saveAddress(editing || 'home')}
                        className="rounded-full w-full bg-primary-color hover:bg-primary-color-hover px-4 py-2.5 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-color"
                    >
                        Save Address
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddressPopup;

import {useEffect, useState} from 'react';
import {loadGoogleMapsAPI} from "@/lib/loadGoogleMapsAPI";
import {Dialog, DialogContent, DialogTitle,} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input";
import {BriefcaseIcon, HomeIcon, PencilSquareIcon} from "@heroicons/react/24/solid";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {useUser} from "@clerk/nextjs";
import {AddressPopupProps, AddressSectionProps, AddressType} from "@/types/components/addressPopup";

const AddressSection = ({label, address, onEdit, isEditing}: AddressSectionProps) => (
    <div className={`flex justify-between items-center ${isEditing ? 'bg-red-100' : ''} p-4 rounded-md`}>
        {label === 'home' ? <HomeIcon className="h-6 w-6"/> : <BriefcaseIcon className="h-6 w-6"/>}
        <p className="justify-between mx-4">{address || 'Add address'}</p>
        <button onClick={onEdit} className="h-6 w-6">
            <PencilSquareIcon/>
        </button>
    </div>
);

const AddressPopup = ({isAddressPopupOpen, setIsAddressPopupOpen, setAddressChanged}: AddressPopupProps) => {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
    const [homeAddress, setHomeAddress] = useState('');
    const [officeAddress, setOfficeAddress] = useState('');
    const [editing, setEditing] = useState('');
    const user = useUser();

    if (!user) {
        return null;
    }

    const fetchSuggestions = (value: string) => {
        setInput(value);
        if (value.length > 2) {
            const autocompleteService = new google.maps.places.AutocompleteService();
            autocompleteService.getPlacePredictions({
                input: value,
                componentRestrictions: {country: 'CA'}
            }, (predictions, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
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
        if (user && user.user && user.user.id) {
            const user_id = new URLSearchParams({
                user_id: user.user.id,
            }).toString();

            fetch(`${apiURL}/api/address?${user_id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch addresses');
                    }
                    return response.json();
                })
                .then(data => {
                    const homeAddress = data.home ? data.home.address : '';
                    const officeAddress = data.work ? data.work.address : '';

                    setHomeAddress(homeAddress);
                    setOfficeAddress(officeAddress);
                })
                .catch(error => {
                    console.error('Error fetching addresses:', error);
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

            console.log('Saving address:', payload)

            const accessToken = localStorage.getItem('accessToken');

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setAddressChanged(true);
                    if (type === 'home') {
                        setHomeAddress(addressValue);
                    } else {
                        setOfficeAddress(addressValue);
                    }
                    setInput('');
                    setEditing('');
                })
                .catch(error => {
                    console.error('Failed to update address:', error);
                });
        } else {
            console.error('No address to save, input is empty.');
        }
    };

    useEffect(() => {
        if (!isAddressPopupOpen) {
            setInput('');
            setEditing('');
        }
    }, [isAddressPopupOpen]);

    useEffect(() => {
        if (isAddressPopupOpen) {
            fetchAddresses();
        }
    }, [isAddressPopupOpen]);

    const editAddress = (type: string) => {
        if (type === 'home') {
            setInput(homeAddress);
            setEditing('home');
        } else if (type === 'work') {
            setInput(officeAddress);
            setEditing('work');
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
                                {suggestions.map((suggestion) => (
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
                        label="work"
                        address={officeAddress}
                        onEdit={() => editAddress('work')}
                        isEditing={editing === 'work'}
                    />
                </div>

                <div className="flex flex-col items-center pt-4 space-y-2">
                    {editing && (
                        <span className="text-sm">
                            {`Editing ${editing === 'home' ? 'Home' : 'Work'} Address`}
                        </span>
                    )}
                    <button
                        onClick={() => saveAddress(editing === 'work' ? 'work' : 'home')}
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

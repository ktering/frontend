import {FetchAddressProps} from "@/types/hooks/fetchAddress"

export const fetchHomeAddress = async ({setHomeAddress, user}: FetchAddressProps) => {
    const accessToken = localStorage.getItem('accessToken');
    const apiURL = process.env.NEXT_PUBLIC_API_URL;
    const userId = user?.id;

    if (!userId || !accessToken) return;

    try {
        const response = await fetch(`${apiURL}/api/address?user_id=${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch addresses');
        }

        const data = await response.json();
        const fullHomeAddress = data.home ? data.home.address : '';
        const addressUntilFirstComma = fullHomeAddress.split(',')[0];
        setHomeAddress(addressUntilFirstComma);

    } catch (error) {
        console.error('Error fetching addresses:', error);
    }
};

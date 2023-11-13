
export type AddressType = 'home' | 'office';

export type Address = {
    type: 'home' | 'office';
    address: string;
};

export interface AddressSectionProps {
    label: AddressType;
    address: string;
    onEdit: () => void;
    isEditing: boolean;
}

export interface AddressPopupProps {
    isAddressPopupOpen: boolean;
    setIsAddressPopupOpen: (isOpen: boolean) => void;
}


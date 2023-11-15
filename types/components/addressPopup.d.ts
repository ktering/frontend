
export type AddressType = 'home' | 'work';

export type Address = {
    type: 'home' | 'work';
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
    setAddressChanged: (addresses: boolean) => void;
}


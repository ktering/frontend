interface Size {
    price: number;
    quantity: number;
}

export interface SizeMap {
    small?: Size;
    medium?: Size;
    large?: Size;
}

interface Earning {
    amount: number;
    currency: string;
    source_types: {
        card: number;
    };
}

export interface Earnings {
    available: Earning[];
    pending: Earning[];
}
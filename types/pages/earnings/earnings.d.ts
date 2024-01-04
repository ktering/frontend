interface Earning {
  amount: number;
}

export interface Earnings {
  available: Earning[];
  pending: Earning[];
}

export interface UserInfo {
    client_id?: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    country?: string;
}

export interface KtererSpecificInfo {
    apartment?: string;
    bio?: string;
    city: string;
    country: string;
    ethnicity: string;
    experienceUnit: number;
    experienceValue: string;
    postal_code: string;
    profile_image_url: string;
    province: string;
    street_address: string;
}

export interface KtererInfo extends UserInfo {
    kterer: Partial<KtererSpecificInfo>;
}
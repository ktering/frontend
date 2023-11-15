import UserInfo from "@/types/shared/user"

export interface Favourites {
    apartment?: string | null;
    bio: string;
    city: string;
    country: string;
    created_at: string;
    ethnicity: string;
    experienceUnit: number;
    experienceValue: string;
    first_name: string;
    id: number;
    last_name: string;
    postal_code: string;
    profile_image_url: string;
    province: string;
    rating: number;
    street_address: string;
    user: UserInfo;
}

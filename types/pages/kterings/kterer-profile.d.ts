import {UserInfo} from "@/types/shared/user";

export interface KtererInfo {
    id: number;
    user_id: number;
    is_verified: boolean;
    profile_image_url: string;
    bio: string;
    ethnicity: string;
    experienceUnit: number;
    experienceValue: string;
    street_address: string;
    city: string;
    apartment: string | null;
    province: string;
    country: string;
    postal_code: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    rating: number;
    user: UserInfo;
}
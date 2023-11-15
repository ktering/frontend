import UserInfo from "@/types/shared/user"

export interface Reviews {
    created_at: string;
    id?: string;
    rating: number;
    review: string;
    user: UserInfo;
}
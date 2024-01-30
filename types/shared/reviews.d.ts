import UserInfo from "@/types/shared/user"

interface Image {
    id: string;
    review_id: string;
    image_url: string;
}

export interface Reviews {
    created_at: string;
    id?: string;
    rating: number;
    review: string;
    user: UserInfo;
    images: Image[];
}
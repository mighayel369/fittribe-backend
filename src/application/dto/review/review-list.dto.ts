
export interface ReviewListDTO {
    profilePic: string;
    name: string;
    time: string;
    program: string;
    comment: string;
    rating: number;
}

export interface AdminReviewListDTO{
    reviewId:string,
    clientName:string,
    clientProfilePic:string,
    time:string,
    trainerName:string,
    program:string,
    comment:string,
    rating:number,
    reviewStatus:boolean
}

export interface AdminReviewListResponseDTO{
    reviews:AdminReviewListDTO[],
    totalReviews:number,
    flaggedCount:number,
    newToday:number
}

export interface TrainerReviewsListsResponseDTO{
    reviews:ReviewListDTO[],
    totalReviewCount:number,
    rating:number
}
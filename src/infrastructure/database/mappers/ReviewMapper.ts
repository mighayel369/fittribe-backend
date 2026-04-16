import { ReviewEntity } from "domain/entities/ReviewEntity";
import { IReview } from "../models/ReviewModel";
import { TrainerMapper } from "./TrainerMapper";
import { UserMapper } from "./UserMapper";
import { BookingMapper } from "./BookingMapper";
export class ReviewMapper {
    static toEntity(doc: IReview): ReviewEntity {
        return new ReviewEntity(
            doc.reviewId, 
            typeof doc.trainerId === 'object' ? TrainerMapper.toEntity(doc.trainerId) : doc.trainerId,
            typeof doc.userId === 'object' ? UserMapper.toEntity(doc.userId) : doc.userId,   
            typeof doc.bookingId === 'object' ? BookingMapper.toEntity(doc.bookingId) : doc.bookingId,    
            doc.rating,       
            doc.comment,      
            doc.isDeleted,   
            doc.createdAt  
        );
    }

    static toPersistence(entity: ReviewEntity): Partial<IReview> {
        return {
            reviewId: entity.reviewId,
            trainerId: typeof entity.trainerId === 'object' 
                ? (entity.trainerId as any).trainerId 
                : entity.trainerId,
            
            userId: typeof entity.userId === 'object' 
                ? (entity.userId as any).userId 
                : entity.userId,
            
            bookingId: typeof entity.bookingId === 'object' 
                ? (entity.bookingId as any).bookingId 
                : entity.bookingId,
            
            rating: entity.rating,
            comment: entity.comment,
            isDeleted: entity.isDeleted
        };
    }
}
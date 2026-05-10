import mongoose, { Schema, Document } from "mongoose";
import { ReviewEntity } from "domain/entities/ReviewEntity";
export interface IReview extends Document, ReviewEntity { }

const reviewSchema = new Schema<IReview>({
    reviewId: { type: String, required: true, index: true },
    trainerId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    bookingId: { type: String, required: true, unique: true },
    comment: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

reviewSchema.index({ trainerId: 1, isDeleted: 1 });

reviewSchema.loadClass(ReviewEntity)

export default mongoose.model<IReview>('Review', reviewSchema);
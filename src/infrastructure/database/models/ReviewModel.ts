import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    reviewId:string,
    trainerId: string;
    userId: string;
    bookingId: string;
    comment: string;
    rating: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

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

export default mongoose.model<IReview>('Review', reviewSchema);
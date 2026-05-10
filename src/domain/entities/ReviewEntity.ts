

export class ReviewEntity {
  constructor(
    public readonly reviewId: string,
    public readonly trainerId: string,
    public readonly userId: string,
    public readonly bookingId: string,
    public readonly rating: number,
    public readonly comment: string,
    public isDeleted = false,
    public readonly createdAt?: Date
  ) { }
}
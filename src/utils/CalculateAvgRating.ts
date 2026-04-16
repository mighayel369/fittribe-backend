
export const CalculateAverageRating = (oldRating: number, oldCount: number, newRating: number): number => {
    const totalPoints = (oldRating * oldCount) + newRating;
    const newCount = oldCount + 1;
    const result = totalPoints / newCount;
    
    return Math.round(result * 10) / 10;
};
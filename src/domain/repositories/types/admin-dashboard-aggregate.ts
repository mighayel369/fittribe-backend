export interface TrainerPerformanceAnalytics {
    month: string;
    name: string;
    bookings: number;
    rating: number;
    revenue: number;
    usage: string;
}

export interface BookingTrend {
    label: string;
    bookings: number;
}

export interface StatusDistribution {
    label: string;
    count: number;
}

export interface AdminDashboardMetricsAggregate {
    stats: {
        todaySessions: number;
        pendingRequests: number;
        totalBookings: number;
        successRate: string;
    };
    trends: BookingTrend[];
    distribution: StatusDistribution[];
}

export interface MonthlyPerformance {
    period: string;
    revenue: number;
    users: number;
    bookings: number;
}

export interface BookingStatusCount {
    label: string;
    count: number;
}

export interface PeakHourData {
    time: number;
    count: number;
}

export interface AdminDashboardStats {
    metrics: {
        totalRevenue: number;
        totalBookings: number;
    };
    performanceData: MonthlyPerformance[];
    bookingStatus: BookingStatusCount[];
    peakHoursData: PeakHourData[];
}
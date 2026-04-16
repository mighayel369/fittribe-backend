export interface DashboardMetrics {
  stats: {
    todaySessions: number;
    pendingRequests: number;
    totalBookings: number;
    successRate: string;
  };
  trends: Array<{ label: string; bookings: number }>; 
  distribution: Array<{ label: string; count: number }>;
}
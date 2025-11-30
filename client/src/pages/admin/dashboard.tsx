import { useQuery } from "@tanstack/react-query";
import { Car, CalendarDays, DollarSign, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "@/components/stats-card";
import type { Car as CarType, Booking, BookingWithCar } from "@shared/schema";
import { bookingStatusLabels } from "@shared/schema";

export default function AdminDashboard() {
  const { data: cars, isLoading: carsLoading } = useQuery<CarType[]>({
    queryKey: ["/api/cars"],
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery<BookingWithCar[]>({
    queryKey: ["/api/bookings"],
  });

  const isLoading = carsLoading || bookingsLoading;

  const totalCars = cars?.length || 0;
  const rentedCars = cars?.filter((car) => car.status === "rented").length || 0;
  const pendingBookings = bookings?.filter((b) => b.status === "pending").length || 0;
  const totalRevenue = bookings
    ?.filter((b) => b.status === "returned")
    .reduce((sum, b) => sum + b.totalPrice, 0) || 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case "confirmed":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "renting":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "returned":
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      default:
        return "";
    }
  };

  const recentBookings = bookings?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">Tổng Quan</h1>
        <p className="text-muted-foreground">Chào mừng bạn đến với trang quản trị</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Tổng Số Xe"
            value={totalCars}
            icon={Car}
            description="Tất cả xe trong hệ thống"
          />
          <StatsCard
            title="Xe Đang Cho Thuê"
            value={rentedCars}
            icon={CalendarDays}
            description={`${totalCars - rentedCars} xe sẵn sàng`}
          />
          <StatsCard
            title="Đơn Chờ Xác Nhận"
            value={pendingBookings}
            icon={Clock}
            description="Cần xử lý"
          />
          <StatsCard
            title="Doanh Thu"
            value={formatPrice(totalRevenue)}
            icon={DollarSign}
            description="Từ các đơn đã hoàn thành"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Đơn Thuê Gần Đây</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4" data-testid={`booking-item-${booking.id}`}>
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                      <Car className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {booking.car?.brand} {booking.car?.model}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {booking.customerName}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(booking.status)} border shrink-0`}>
                      {bookingStatusLabels[booking.status as keyof typeof bookingStatusLabels]}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Chưa có đơn thuê nào
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống Kê Xe</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm">Sẵn Sàng</span>
                  </div>
                  <span className="font-medium">
                    {cars?.filter((c) => c.status === "available").length || 0} xe
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="text-sm">Đang Cho Thuê</span>
                  </div>
                  <span className="font-medium">
                    {cars?.filter((c) => c.status === "rented").length || 0} xe
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-sm">Bảo Trì</span>
                  </div>
                  <span className="font-medium">
                    {cars?.filter((c) => c.status === "maintenance").length || 0} xe
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Search, Eye, CalendarDays, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { BookingWithCar } from "@shared/schema";
import { bookingStatuses, bookingStatusLabels } from "@shared/schema";

export default function AdminBookingsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewingBooking, setViewingBooking] = useState<BookingWithCar | null>(null);

  const { data: bookings, isLoading } = useQuery<BookingWithCar[]>({
    queryKey: ["/api/bookings"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest("PATCH", `/api/bookings/${id}`, { status }),
    onSuccess: () => {
      toast({ title: "Cập nhật trạng thái thành công!" });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
    },
    onError: () => {
      toast({ title: "Cập nhật thất bại", variant: "destructive" });
    },
  });

  const filteredBookings = bookings?.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerPhone.includes(searchQuery) ||
      (booking.car && 
        `${booking.car.brand} ${booking.car.model}`.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
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

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: bookingId, status: newStatus });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-bookings-title">Đơn Thuê Xe</h1>
        <p className="text-muted-foreground">Quản lý các đơn đặt thuê xe</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, SĐT, xe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-bookings"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-filter-status">
            <SelectValue placeholder="Lọc trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {bookingStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {bookingStatusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : filteredBookings && filteredBookings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách Hàng</TableHead>
                  <TableHead>Xe</TableHead>
                  <TableHead>Ngày Thuê</TableHead>
                  <TableHead>Tổng Tiền</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id} data-testid={`row-booking-${booking.id}`}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.customerName}</p>
                        <p className="text-sm text-muted-foreground">{booking.customerPhone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.car ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={booking.car.image}
                            alt={`${booking.car.brand} ${booking.car.model}`}
                            className="h-10 w-14 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{booking.car.brand} {booking.car.model}</p>
                            <p className="text-sm text-muted-foreground">{booking.car.year}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Xe đã bị xóa</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(booking.startDate)}</p>
                        <p className="text-muted-foreground">đến {formatDate(booking.endDate)}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{formatPrice(booking.totalPrice)}</TableCell>
                    <TableCell>
                      <Select
                        value={booking.status}
                        onValueChange={(value) => handleStatusChange(booking.id, value)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <SelectTrigger className="w-[140px]" data-testid={`select-status-${booking.id}`}>
                          <Badge className={`${getStatusColor(booking.status)} border`}>
                            {bookingStatusLabels[booking.status as keyof typeof bookingStatusLabels]}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {bookingStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              <Badge className={`${getStatusColor(status)} border`}>
                                {bookingStatusLabels[status]}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingBooking(booking)}
                        data-testid={`button-view-${booking.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center">
              <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chưa có đơn thuê nào</h3>
              <p className="text-muted-foreground">
                Đơn thuê sẽ xuất hiện ở đây khi khách hàng đặt xe
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!viewingBooking} onOpenChange={() => setViewingBooking(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi Tiết Đơn Thuê</DialogTitle>
            <DialogDescription>
              Mã đơn: {viewingBooking?.id}
            </DialogDescription>
          </DialogHeader>

          {viewingBooking && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Thông Tin Khách Hàng</h4>
                <div className="space-y-1">
                  <p><span className="text-muted-foreground">Họ tên:</span> {viewingBooking.customerName}</p>
                  <p><span className="text-muted-foreground">SĐT:</span> {viewingBooking.customerPhone}</p>
                  <p><span className="text-muted-foreground">CMND/CCCD:</span> {viewingBooking.customerId}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Thông Tin Xe</h4>
                {viewingBooking.car ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={viewingBooking.car.image}
                      alt={`${viewingBooking.car.brand} ${viewingBooking.car.model}`}
                      className="h-16 w-24 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{viewingBooking.car.brand} {viewingBooking.car.model}</p>
                      <p className="text-sm text-muted-foreground">{viewingBooking.car.year}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Xe đã bị xóa</p>
                )}
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Thời Gian Thuê</h4>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày nhận</p>
                    <p className="font-medium">{formatDate(viewingBooking.startDate)}</p>
                  </div>
                  <div className="text-muted-foreground">→</div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày trả</p>
                    <p className="font-medium">{formatDate(viewingBooking.endDate)}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng Tiền</p>
                  <p className="text-xl font-bold text-primary">{formatPrice(viewingBooking.totalPrice)}</p>
                </div>
                <Badge className={`${getStatusColor(viewingBooking.status)} border`}>
                  {bookingStatusLabels[viewingBooking.status as keyof typeof bookingStatusLabels]}
                </Badge>
              </div>

              {viewingBooking.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Ghi Chú</h4>
                    <p className="text-sm">{viewingBooking.notes}</p>
                  </div>
                </>
              )}

              <div className="text-xs text-muted-foreground">
                Ngày đặt: {format(new Date(viewingBooking.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

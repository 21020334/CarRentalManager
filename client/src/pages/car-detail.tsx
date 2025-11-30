import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Users, Fuel, Settings2, Calendar, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CustomerHeader } from "@/components/customer-header";
import { CustomerFooter } from "@/components/customer-footer";
import { BookingForm } from "@/components/booking-form";
import { CarCard } from "@/components/car-card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Car, InsertBooking } from "@shared/schema";
import {
  carTypeLabels,
  transmissionLabels,
  fuelLabels,
  carStatusLabels,
} from "@shared/schema";

export default function CarDetailPage() {
  const [, params] = useRoute("/cars/:id");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("book") === "true") {
      setShowBookingForm(true);
    }
  }, []);

  const { data: car, isLoading } = useQuery<Car>({
    queryKey: ["/api/cars", params?.id],
    enabled: !!params?.id,
  });

  const { data: allCars } = useQuery<Car[]>({
    queryKey: ["/api/cars"],
  });

  const relatedCars = allCars
    ?.filter((c) => c.id !== params?.id && c.type === car?.type && c.status === "available")
    .slice(0, 3) || [];

  const bookingMutation = useMutation({
    mutationFn: async (data: Omit<InsertBooking, "carId">) => {
      return apiRequest("POST", "/api/bookings", {
        ...data,
        carId: params?.id,
      });
    },
    onSuccess: () => {
      toast({
        title: "Đặt xe thành công!",
        description: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      setShowBookingForm(false);
    },
    onError: () => {
      toast({
        title: "Đặt xe thất bại",
        description: "Có lỗi xảy ra, vui lòng thử lại sau.",
        variant: "destructive",
      });
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "rented":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case "maintenance":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      default:
        return "";
    }
  };

  const handleBookingSubmit = (data: any) => {
    bookingMutation.mutate({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerId: data.customerId,
      startDate: data.startDate.toISOString().split("T")[0],
      endDate: data.endDate.toISOString().split("T")[0],
      totalPrice: data.totalPrice,
      notes: data.notes || "",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <CustomerHeader />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="grid lg:grid-cols-[1fr_400px] gap-8">
              <div>
                <Skeleton className="aspect-[16/10] rounded-lg mb-6" />
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/4 mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-lg" />
                  ))}
                </div>
              </div>
              <div>
                <Skeleton className="h-[500px] rounded-lg" />
              </div>
            </div>
          </div>
        </main>
        <CustomerFooter />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col">
        <CustomerHeader />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy xe</h1>
            <p className="text-muted-foreground mb-6">
              Xe bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <Button onClick={() => navigate("/cars")}>Quay Lại Danh Sách</Button>
          </div>
        </main>
        <CustomerFooter />
      </div>
    );
  }

  const features = car.features?.split(",").map((f) => f.trim()).filter(Boolean) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/cars")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay Lại
          </Button>

          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            <div>
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-6">
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className={`${getStatusColor(car.status)} border`} data-testid="badge-car-status">
                    {carStatusLabels[car.status as keyof typeof carStatusLabels]}
                  </Badge>
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-1" data-testid="text-car-title">
                    {car.brand} {car.model}
                  </h1>
                  <p className="text-muted-foreground">Năm sản xuất: {car.year}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary" data-testid="text-car-price">
                    {formatPrice(car.pricePerDay)}
                  </p>
                  <p className="text-sm text-muted-foreground">/ngày</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Users className="h-6 w-6 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Số Ghế</p>
                    <p className="font-semibold">{car.seats} chỗ</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Settings2 className="h-6 w-6 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Hộp Số</p>
                    <p className="font-semibold">
                      {transmissionLabels[car.transmission as keyof typeof transmissionLabels]}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Fuel className="h-6 w-6 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Nhiên Liệu</p>
                    <p className="font-semibold">
                      {fuelLabels[car.fuel as keyof typeof fuelLabels]}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Calendar className="h-6 w-6 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Loại Xe</p>
                    <p className="font-semibold">
                      {carTypeLabels[car.type as keyof typeof carTypeLabels]}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {car.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Mô Tả</h2>
                  <p className="text-muted-foreground leading-relaxed">{car.description}</p>
                </div>
              )}

              {features.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Tính Năng</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              {car.status === "available" ? (
                showBookingForm ? (
                  <BookingForm
                    car={car}
                    onSubmit={handleBookingSubmit}
                    isSubmitting={bookingMutation.isPending}
                  />
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-semibold mb-2">Đặt Thuê Xe Này</h3>
                      <p className="text-muted-foreground mb-6">
                        Xe đang sẵn sàng để cho thuê. Đặt ngay để có trải nghiệm tuyệt vời!
                      </p>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => setShowBookingForm(true)}
                        data-testid="button-show-booking-form"
                      >
                        Đặt Xe Ngay
                      </Button>
                    </CardContent>
                  </Card>
                )
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-semibold mb-2">Xe Không Khả Dụng</h3>
                    <p className="text-muted-foreground mb-4">
                      {car.status === "rented"
                        ? "Xe đang được cho thuê. Vui lòng quay lại sau."
                        : "Xe đang trong quá trình bảo trì."}
                    </p>
                    <Button variant="outline" onClick={() => navigate("/cars")}>
                      Xem Xe Khác
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {relatedCars.length > 0 && (
            <div className="mt-16">
              <Separator className="mb-8" />
              <h2 className="text-2xl font-bold mb-6">Xe Tương Tự</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedCars.map((relatedCar) => (
                  <CarCard key={relatedCar.id} car={relatedCar} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
}

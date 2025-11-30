import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Car, Shield, Clock, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerHeader } from "@/components/customer-header";
import { CustomerFooter } from "@/components/customer-footer";
import { CarCard } from "@/components/car-card";
import type { Car as CarType } from "@shared/schema";
import heroImage from "@assets/stock_images/car_dealership_showr_4625a04d.jpg";

const features = [
  {
    icon: Car,
    title: "Đa Dạng Xe",
    description: "Hơn 50+ mẫu xe từ sedan, SUV đến xe thể thao sang trọng",
  },
  {
    icon: Shield,
    title: "An Toàn Tuyệt Đối",
    description: "Xe được bảo dưỡng định kỳ, đảm bảo an toàn cho mọi chuyến đi",
  },
  {
    icon: Clock,
    title: "Đặt Xe Nhanh Chóng",
    description: "Quy trình đặt xe đơn giản, xác nhận trong vòng 15 phút",
  },
  {
    icon: Headphones,
    title: "Hỗ Trợ 24/7",
    description: "Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc",
  },
];

export default function HomePage() {
  const { data: cars, isLoading } = useQuery<CarType[]>({
    queryKey: ["/api/cars"],
  });

  const availableCars = cars?.filter((car) => car.status === "available").slice(0, 6) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader />

      <main className="flex-1">
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Car showroom"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
          </div>
          
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
                Thuê Xe Dễ Dàng
                <br />
                <span className="text-primary">Trải Nghiệm Tuyệt Vời</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                Hệ thống cho thuê xe uy tín số 1 Việt Nam. Đa dạng dòng xe, giá cả hợp lý, 
                dịch vụ chuyên nghiệp. Đặt xe ngay hôm nay!
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/cars">
                  <Button size="lg" className="text-lg px-8" data-testid="button-hero-browse">
                    Xem Xe Ngay
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                    data-testid="button-hero-contact"
                  >
                    Liên Hệ Ngay
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover-elevate" data-testid={`card-feature-${index}`}>
                  <CardContent className="pt-6">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2" data-testid="text-featured-title">Xe Nổi Bật</h2>
                <p className="text-muted-foreground">Những chiếc xe được thuê nhiều nhất</p>
              </div>
              <Link href="/cars">
                <Button variant="outline" data-testid="button-view-all">
                  Xem Tất Cả
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-[4/3]" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : availableCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Chưa có xe nào</h3>
                <p className="text-muted-foreground">Vui lòng quay lại sau</p>
              </Card>
            )}
          </div>
        </section>

        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Sẵn Sàng Để Lên Đường?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Đặt xe ngay hôm nay và nhận ưu đãi đặc biệt cho khách hàng mới. 
              Quy trình đơn giản, nhanh chóng.
            </p>
            <Link href="/cars">
              <Button size="lg" variant="secondary" className="text-lg px-8" data-testid="button-cta-browse">
                Đặt Xe Ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <CustomerFooter />
    </div>
  );
}

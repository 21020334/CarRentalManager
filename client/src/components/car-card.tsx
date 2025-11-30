import { Link } from "wouter";
import { Car, Users, Fuel, Settings2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Car as CarType } from "@shared/schema";
import { carTypeLabels, transmissionLabels, fuelLabels, carStatusLabels } from "@shared/schema";

interface CarCardProps {
  car: CarType;
}

export function CarCard({ car }: CarCardProps) {
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

  return (
    <Card className="group overflow-hidden hover-elevate" data-testid={`card-car-${car.id}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Badge className={`${getStatusColor(car.status)} border`} data-testid={`badge-status-${car.id}`}>
            {carStatusLabels[car.status as keyof typeof carStatusLabels]}
          </Badge>
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            {carTypeLabels[car.type as keyof typeof carTypeLabels]}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-semibold text-lg leading-tight" data-testid={`text-car-name-${car.id}`}>
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-muted-foreground">{car.year}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-bold text-primary text-lg" data-testid={`text-price-${car.id}`}>
              {formatPrice(car.pricePerDay)}
            </p>
            <p className="text-xs text-muted-foreground">/ngày</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{car.seats} chỗ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Settings2 className="h-4 w-4" />
            <span>{transmissionLabels[car.transmission as keyof typeof transmissionLabels]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="h-4 w-4" />
            <span>{fuelLabels[car.fuel as keyof typeof fuelLabels]}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link href={`/cars/${car.id}`} className="flex-1">
          <Button variant="outline" className="w-full" data-testid={`button-view-${car.id}`}>
            Xem Chi Tiết
          </Button>
        </Link>
        {car.status === "available" && (
          <Link href={`/cars/${car.id}?book=true`} className="flex-1">
            <Button className="w-full" data-testid={`button-book-${car.id}`}>
              Đặt Ngay
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

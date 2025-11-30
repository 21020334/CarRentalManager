import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Car } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerHeader } from "@/components/customer-header";
import { CustomerFooter } from "@/components/customer-footer";
import { CarCard } from "@/components/car-card";
import { CarFilter, type CarFilters } from "@/components/car-filter";
import type { Car as CarType } from "@shared/schema";

const defaultFilters: CarFilters = {
  search: "",
  type: "all",
  transmission: "all",
  minPrice: 0,
  maxPrice: 5000000,
  seats: [],
  availableOnly: false,
};

export default function CarsPage() {
  const [filters, setFilters] = useState<CarFilters>(defaultFilters);

  const { data: cars, isLoading } = useQuery<CarType[]>({
    queryKey: ["/api/cars"],
  });

  const filteredCars = useMemo(() => {
    if (!cars) return [];

    return cars.filter((car) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          car.brand.toLowerCase().includes(searchLower) ||
          car.model.toLowerCase().includes(searchLower) ||
          `${car.brand} ${car.model}`.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (filters.type !== "all" && car.type !== filters.type) return false;

      if (filters.transmission !== "all" && car.transmission !== filters.transmission) return false;

      if (car.pricePerDay < filters.minPrice || car.pricePerDay > filters.maxPrice) return false;

      if (filters.seats.length > 0 && !filters.seats.includes(car.seats)) return false;

      if (filters.availableOnly && car.status !== "available") return false;

      return true;
    });
  }, [cars, filters]);

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Xe Cho Thuê</h1>
            <p className="text-muted-foreground">
              Khám phá bộ sưu tập xe đa dạng của chúng tôi
            </p>
          </div>

          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
            <aside className="mb-6 lg:mb-0">
              <Card className="sticky top-24">
                <CardContent className="p-4">
                  <CarFilter filters={filters} onFiltersChange={setFilters} />
                </CardContent>
              </Card>
            </aside>

            <div>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 9 }).map((_, i) => (
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
              ) : filteredCars.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground mb-4" data-testid="text-result-count">
                    Tìm thấy {filteredCars.length} xe
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCars.map((car) => (
                      <CarCard key={car.id} car={car} />
                    ))}
                  </div>
                </>
              ) : (
                <Card className="p-12 text-center">
                  <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Không tìm thấy xe</h3>
                  <p className="text-muted-foreground">
                    Thử thay đổi bộ lọc để xem thêm kết quả
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <CustomerFooter />
    </div>
  );
}

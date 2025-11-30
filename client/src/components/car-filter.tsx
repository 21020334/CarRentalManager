import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { carTypes, transmissionTypes, carTypeLabels, transmissionLabels } from "@shared/schema";

export interface CarFilters {
  search: string;
  type: string;
  transmission: string;
  minPrice: number;
  maxPrice: number;
  seats: number[];
  availableOnly: boolean;
}

interface CarFilterProps {
  filters: CarFilters;
  onFiltersChange: (filters: CarFilters) => void;
}

const seatOptions = [2, 4, 5, 7, 9];

export function CarFilter({ filters, onFiltersChange }: CarFilterProps) {
  const [priceRange, setPriceRange] = useState([filters.minPrice, filters.maxPrice]);
  const [isOpen, setIsOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handlePriceCommit = (value: number[]) => {
    onFiltersChange({ ...filters, minPrice: value[0], maxPrice: value[1] });
  };

  const handleSeatToggle = (seat: number) => {
    const newSeats = filters.seats.includes(seat)
      ? filters.seats.filter((s) => s !== seat)
      : [...filters.seats, seat];
    onFiltersChange({ ...filters, seats: newSeats });
  };

  const clearFilters = () => {
    const clearedFilters: CarFilters = {
      search: "",
      type: "all",
      transmission: "all",
      minPrice: 0,
      maxPrice: 5000000,
      seats: [],
      availableOnly: false,
    };
    setPriceRange([0, 5000000]);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters =
    filters.search ||
    filters.type !== "all" ||
    filters.transmission !== "all" ||
    filters.minPrice > 0 ||
    filters.maxPrice < 5000000 ||
    filters.seats.length > 0 ||
    filters.availableOnly;

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-2 block">Loại Xe</Label>
        <Select
          value={filters.type}
          onValueChange={(value) => onFiltersChange({ ...filters, type: value })}
        >
          <SelectTrigger data-testid="select-car-type">
            <SelectValue placeholder="Tất cả loại xe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại xe</SelectItem>
            {carTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {carTypeLabels[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Hộp Số</Label>
        <Select
          value={filters.transmission}
          onValueChange={(value) => onFiltersChange({ ...filters, transmission: value })}
        >
          <SelectTrigger data-testid="select-transmission">
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {transmissionTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {transmissionLabels[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">
          Giá Thuê: {formatPrice(priceRange[0])}đ - {formatPrice(priceRange[1])}đ
        </Label>
        <Slider
          value={priceRange}
          onValueChange={handlePriceChange}
          onValueCommit={handlePriceCommit}
          min={0}
          max={5000000}
          step={100000}
          className="w-full"
          data-testid="slider-price"
        />
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Số Ghế</Label>
        <div className="flex flex-wrap gap-2">
          {seatOptions.map((seat) => (
            <Button
              key={seat}
              variant={filters.seats.includes(seat) ? "default" : "outline"}
              size="sm"
              onClick={() => handleSeatToggle(seat)}
              data-testid={`button-seat-${seat}`}
            >
              {seat} chỗ
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="available"
          checked={filters.availableOnly}
          onCheckedChange={(checked) =>
            onFiltersChange({ ...filters, availableOnly: checked as boolean })
          }
          data-testid="checkbox-available"
        />
        <Label htmlFor="available" className="text-sm cursor-pointer">
          Chỉ hiển thị xe còn trống
        </Label>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          className="w-full"
          onClick={clearFilters}
          data-testid="button-clear-filters"
        >
          <X className="h-4 w-4 mr-2" />
          Xóa Bộ Lọc
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm theo tên xe, hãng xe..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9"
            data-testid="input-search"
          />
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden" data-testid="button-filter-mobile">
              <Filter className="h-4 w-4 mr-2" />
              Bộ Lọc
              {hasActiveFilters && (
                <span className="ml-2 h-2 w-2 rounded-full bg-primary" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px]">
            <SheetHeader>
              <SheetTitle>Bộ Lọc</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden lg:block">
        <FilterContent />
      </div>
    </div>
  );
}

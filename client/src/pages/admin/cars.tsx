import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, Search, Loader2, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Car as CarType, InsertCar } from "@shared/schema";
import {
  carTypes,
  transmissionTypes,
  fuelTypes,
  carStatuses,
  carTypeLabels,
  transmissionLabels,
  fuelLabels,
  carStatusLabels,
} from "@shared/schema";

const carFormSchema = z.object({
  brand: z.string().min(1, "Vui lòng nhập hãng xe"),
  model: z.string().min(1, "Vui lòng nhập model xe"),
  year: z.coerce.number().min(1990, "Năm không hợp lệ").max(new Date().getFullYear() + 1),
  type: z.enum(carTypes),
  transmission: z.enum(transmissionTypes),
  fuel: z.enum(fuelTypes),
  seats: z.coerce.number().min(2).max(16),
  pricePerDay: z.coerce.number().min(100000, "Giá tối thiểu 100,000đ"),
  image: z.string().url("URL hình ảnh không hợp lệ"),
  description: z.string().optional(),
  status: z.enum(carStatuses),
  features: z.string().optional(),
});

type CarFormValues = z.infer<typeof carFormSchema>;

export default function AdminCarsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarType | null>(null);
  const [deletingCar, setDeletingCar] = useState<CarType | null>(null);

  const { data: cars, isLoading } = useQuery<CarType[]>({
    queryKey: ["/api/cars"],
  });

  const form = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      type: "sedan",
      transmission: "automatic",
      fuel: "gasoline",
      seats: 4,
      pricePerDay: 500000,
      image: "",
      description: "",
      status: "available",
      features: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertCar) => apiRequest("POST", "/api/cars", data),
    onSuccess: () => {
      toast({ title: "Thêm xe thành công!" });
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      closeDialog();
    },
    onError: () => {
      toast({ title: "Thêm xe thất bại", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertCar> }) =>
      apiRequest("PATCH", `/api/cars/${id}`, data),
    onSuccess: () => {
      toast({ title: "Cập nhật xe thành công!" });
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      closeDialog();
    },
    onError: () => {
      toast({ title: "Cập nhật xe thất bại", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/cars/${id}`),
    onSuccess: () => {
      toast({ title: "Xóa xe thành công!" });
      queryClient.invalidateQueries({ queryKey: ["/api/cars"] });
      setDeletingCar(null);
    },
    onError: () => {
      toast({ title: "Xóa xe thất bại", variant: "destructive" });
    },
  });

  const openCreateDialog = () => {
    form.reset({
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      type: "sedan",
      transmission: "automatic",
      fuel: "gasoline",
      seats: 4,
      pricePerDay: 500000,
      image: "",
      description: "",
      status: "available",
      features: "",
    });
    setEditingCar(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (car: CarType) => {
    form.reset({
      brand: car.brand,
      model: car.model,
      year: car.year,
      type: car.type as typeof carTypes[number],
      transmission: car.transmission as typeof transmissionTypes[number],
      fuel: car.fuel as typeof fuelTypes[number],
      seats: car.seats,
      pricePerDay: car.pricePerDay,
      image: car.image,
      description: car.description || "",
      status: car.status as typeof carStatuses[number],
      features: car.features || "",
    });
    setEditingCar(car);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCar(null);
    form.reset();
  };

  const onSubmit = (data: CarFormValues) => {
    if (editingCar) {
      updateMutation.mutate({ id: editingCar.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredCars = cars?.filter(
    (car) =>
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-cars-title">Quản Lý Xe</h1>
          <p className="text-muted-foreground">Thêm, sửa, xóa thông tin xe</p>
        </div>
        <Button onClick={openCreateDialog} data-testid="button-add-car">
          <Plus className="h-4 w-4 mr-2" />
          Thêm Xe Mới
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm xe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-cars"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-16 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          ) : filteredCars && filteredCars.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Hình</TableHead>
                  <TableHead>Xe</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Số Ghế</TableHead>
                  <TableHead>Giá/Ngày</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCars.map((car) => (
                  <TableRow key={car.id} data-testid={`row-car-${car.id}`}>
                    <TableCell>
                      <img
                        src={car.image}
                        alt={`${car.brand} ${car.model}`}
                        className="h-12 w-16 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{car.brand} {car.model}</p>
                        <p className="text-sm text-muted-foreground">{car.year}</p>
                      </div>
                    </TableCell>
                    <TableCell>{carTypeLabels[car.type as keyof typeof carTypeLabels]}</TableCell>
                    <TableCell>{car.seats} chỗ</TableCell>
                    <TableCell>{formatPrice(car.pricePerDay)}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(car.status)} border`}>
                        {carStatusLabels[car.status as keyof typeof carStatusLabels]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(car)}
                          data-testid={`button-edit-${car.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingCar(car)}
                          data-testid={`button-delete-${car.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center">
              <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chưa có xe nào</h3>
              <p className="text-muted-foreground mb-4">Thêm xe mới để bắt đầu</p>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm Xe Mới
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCar ? "Chỉnh Sửa Xe" : "Thêm Xe Mới"}</DialogTitle>
            <DialogDescription>
              {editingCar ? "Cập nhật thông tin xe" : "Điền thông tin xe mới"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hãng Xe</FormLabel>
                      <FormControl>
                        <Input placeholder="Toyota, Honda..." {...field} data-testid="input-brand" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="Camry, Civic..." {...field} data-testid="input-model" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Năm SX</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} data-testid="input-year" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seats"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số Ghế</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} data-testid="input-seats" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pricePerDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá/Ngày (VND)</FormLabel>
                      <FormControl>
                        <Input type="number" step="10000" {...field} data-testid="input-price" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại Xe</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-type">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {carTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {carTypeLabels[type]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="transmission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hộp Số</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-transmission">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {transmissionTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {transmissionLabels[type]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fuel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhiên Liệu</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-fuel">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fuelTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {fuelLabels[type]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng Thái</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-status">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {carStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {carStatusLabels[status]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Hình Ảnh</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/car.jpg" {...field} data-testid="input-image" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô Tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả chi tiết về xe..."
                        className="resize-none"
                        {...field}
                        data-testid="input-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tính Năng (phân cách bằng dấu phẩy)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="GPS, Camera lùi, Bluetooth..."
                        {...field}
                        data-testid="input-features"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting} data-testid="button-submit-car">
                  {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingCar ? "Cập Nhật" : "Thêm Xe"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingCar} onOpenChange={() => setDeletingCar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa xe?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa xe {deletingCar?.brand} {deletingCar?.model}? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingCar && deleteMutation.mutate(deletingCar.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

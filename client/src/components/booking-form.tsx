import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, differenceInDays, addDays } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Car } from "@shared/schema";

const bookingFormSchema = z.object({
  customerName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  customerPhone: z.string().regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, "Số điện thoại không hợp lệ"),
  customerId: z.string().min(9, "CMND/CCCD phải có ít nhất 9 số").max(12, "CMND/CCCD tối đa 12 số"),
  startDate: z.date({ required_error: "Vui lòng chọn ngày nhận xe" }),
  endDate: z.date({ required_error: "Vui lòng chọn ngày trả xe" }),
  notes: z.string().optional(),
}).refine((data) => data.endDate > data.startDate, {
  message: "Ngày trả xe phải sau ngày nhận xe",
  path: ["endDate"],
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  car: Car;
  onSubmit: (data: BookingFormValues & { totalPrice: number }) => void;
  isSubmitting?: boolean;
}

export function BookingForm({ car, onSubmit, isSubmitting = false }: BookingFormProps) {
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerId: "",
      notes: "",
    },
  });

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  useEffect(() => {
    if (startDate && endDate) {
      const days = differenceInDays(endDate, startDate);
      setTotalDays(days > 0 ? days : 0);
      setTotalPrice(days > 0 ? days * car.pricePerDay : 0);
    }
  }, [startDate, endDate, car.pricePerDay]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleSubmit = (data: BookingFormValues) => {
    onSubmit({ ...data, totalPrice });
  };

  return (
    <Card data-testid="card-booking-form">
      <CardHeader>
        <CardTitle className="text-xl">Đặt Thuê Xe</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và Tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} data-testid="input-customer-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số Điện Thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="0909123456" {...field} data-testid="input-customer-phone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CMND/CCCD</FormLabel>
                  <FormControl>
                    <Input placeholder="012345678901" {...field} data-testid="input-customer-id" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày Nhận Xe</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            data-testid="button-start-date"
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: vi })
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày Trả Xe</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            data-testid="button-end-date"
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: vi })
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date <= (startDate || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi Chú (Tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Yêu cầu đặc biệt, thời gian nhận xe..."
                      className="resize-none"
                      {...field}
                      data-testid="input-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Giá thuê/ngày:</span>
                <span>{formatPrice(car.pricePerDay)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Số ngày thuê:</span>
                <span>{totalDays} ngày</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Tổng cộng:</span>
                <span className="text-primary" data-testid="text-total-price">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || totalDays === 0}
              data-testid="button-submit-booking"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang Xử Lý...
                </>
              ) : (
                "Xác Nhận Đặt Xe"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

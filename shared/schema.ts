import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Car types
export const carTypes = ["sedan", "suv", "sports", "hatchback", "pickup"] as const;
export type CarType = typeof carTypes[number];

// Transmission types
export const transmissionTypes = ["automatic", "manual"] as const;
export type TransmissionType = typeof transmissionTypes[number];

// Fuel types
export const fuelTypes = ["gasoline", "diesel", "electric", "hybrid"] as const;
export type FuelType = typeof fuelTypes[number];

// Car status
export const carStatuses = ["available", "rented", "maintenance"] as const;
export type CarStatus = typeof carStatuses[number];

// Booking status
export const bookingStatuses = ["pending", "confirmed", "renting", "returned", "cancelled"] as const;
export type BookingStatus = typeof bookingStatuses[number];

// Cars table
export const cars = pgTable("cars", {
  id: varchar("id").primaryKey(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  type: text("type").notNull().$type<CarType>(),
  transmission: text("transmission").notNull().$type<TransmissionType>(),
  fuel: text("fuel").notNull().$type<FuelType>(),
  seats: integer("seats").notNull(),
  pricePerDay: integer("price_per_day").notNull(),
  image: text("image").notNull(),
  description: text("description"),
  status: text("status").notNull().$type<CarStatus>().default("available"),
  features: text("features"),
});

export const insertCarSchema = createInsertSchema(cars).omit({ id: true });
export type InsertCar = z.infer<typeof insertCarSchema>;
export type Car = typeof cars.$inferSelect;

// Bookings table
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey(),
  carId: varchar("car_id").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerId: text("customer_id").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: text("status").notNull().$type<BookingStatus>().default("pending"),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
});

export const insertBookingSchema = createInsertSchema(bookings)
  .omit({ id: true, createdAt: true })
  .extend({
    status: z.enum(bookingStatuses).optional().default("pending"),
    notes: z.string().optional(),
  });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// Users table (for future auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("customer"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Helper type for booking with car details
export type BookingWithCar = Booking & { car: Car };

// Vietnamese translations
export const carTypeLabels: Record<CarType, string> = {
  sedan: "Sedan",
  suv: "SUV",
  sports: "Xe Thể Thao",
  hatchback: "Hatchback",
  pickup: "Bán Tải",
};

export const transmissionLabels: Record<TransmissionType, string> = {
  automatic: "Tự Động",
  manual: "Số Sàn",
};

export const fuelLabels: Record<FuelType, string> = {
  gasoline: "Xăng",
  diesel: "Dầu Diesel",
  electric: "Điện",
  hybrid: "Hybrid",
};

export const carStatusLabels: Record<CarStatus, string> = {
  available: "Sẵn Sàng",
  rented: "Đang Cho Thuê",
  maintenance: "Bảo Trì",
};

export const bookingStatusLabels: Record<BookingStatus, string> = {
  pending: "Chờ Xác Nhận",
  confirmed: "Đã Xác Nhận",
  renting: "Đang Thuê",
  returned: "Đã Trả",
  cancelled: "Đã Hủy",
};

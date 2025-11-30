import { type User, type InsertUser, type Car, type InsertCar, type Booking, type InsertBooking, type BookingWithCar } from "@shared/schema";
import { randomUUID } from "crypto";
import * as bcryptjs from "bcryptjs";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  authenticateUser(username: string, password: string): Promise<User | undefined>;
  
  getCars(): Promise<Car[]>;
  getCar(id: string): Promise<Car | undefined>;
  createCar(car: InsertCar): Promise<Car>;
  updateCar(id: string, car: Partial<InsertCar>): Promise<Car | undefined>;
  deleteCar(id: string): Promise<boolean>;
  
  getBookings(): Promise<BookingWithCar[]>;
  getBooking(id: string): Promise<BookingWithCar | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: string, booking: Partial<InsertBooking>): Promise<Booking | undefined>;
  deleteBooking(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private cars: Map<string, Car>;
  private bookings: Map<string, Booking>;

  constructor() {
    this.users = new Map();
    this.cars = new Map();
    this.bookings = new Map();
    
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleCars: Car[] = [
      {
        id: "car-1",
        brand: "Toyota",
        model: "Camry",
        year: 2023,
        type: "sedan",
        transmission: "automatic",
        fuel: "gasoline",
        seats: 5,
        pricePerDay: 800000,
        image: "/attached_assets/stock_images/luxury_sedan_car_pro_15cee928.jpg",
        description: "Toyota Camry 2023 là dòng xe sedan hạng D sang trọng với thiết kế thể thao, nội thất hiện đại. Động cơ 2.5L mạnh mẽ, tiết kiệm nhiên liệu.",
        status: "available",
        features: "Camera lùi, GPS, Bluetooth, Ghế da, Điều hòa tự động, Cửa sổ trời",
      },
      {
        id: "car-2",
        brand: "Honda",
        model: "CR-V",
        year: 2023,
        type: "suv",
        transmission: "automatic",
        fuel: "gasoline",
        seats: 7,
        pricePerDay: 1200000,
        image: "/attached_assets/stock_images/suv_car_professional_7953a907.jpg",
        description: "Honda CR-V 7 chỗ rộng rãi, phù hợp cho gia đình và các chuyến du lịch dài ngày. Hệ thống an toàn Honda Sensing tiên tiến.",
        status: "available",
        features: "Honda Sensing, Camera 360, Cảm biến đỗ xe, Ghế chỉnh điện, Apple CarPlay",
      },
      {
        id: "car-3",
        brand: "Mercedes-Benz",
        model: "C300",
        year: 2022,
        type: "sedan",
        transmission: "automatic",
        fuel: "gasoline",
        seats: 5,
        pricePerDay: 2500000,
        image: "/attached_assets/stock_images/luxury_sedan_car_pro_66e91957.jpg",
        description: "Mercedes-Benz C300 AMG Line - đẳng cấp xe sang Đức. Nội thất MBUX hiện đại, động cơ 2.0L turbo mạnh mẽ 258 mã lực.",
        status: "available",
        features: "MBUX, Burmester Sound, Cửa sổ trời panoramic, Ghế massage, Ambient Light",
      },
      {
        id: "car-4",
        brand: "Ford",
        model: "Mustang",
        year: 2023,
        type: "sports",
        transmission: "automatic",
        fuel: "gasoline",
        seats: 4,
        pricePerDay: 3500000,
        image: "/attached_assets/stock_images/sports_car_rental_pr_3ef8e70b.jpg",
        description: "Ford Mustang - huyền thoại xe thể thao Mỹ. Động cơ V8 5.0L với 450 mã lực, âm thanh ống xả đặc trưng.",
        status: "available",
        features: "V8 Engine, Launch Control, Track Mode, Recaro Seats, Bang & Olufsen",
      },
      {
        id: "car-5",
        brand: "Mazda",
        model: "CX-5",
        year: 2023,
        type: "suv",
        transmission: "automatic",
        fuel: "gasoline",
        seats: 5,
        pricePerDay: 900000,
        image: "/attached_assets/stock_images/suv_car_professional_05b1cc64.jpg",
        description: "Mazda CX-5 với thiết kế KODO đẹp mắt, vận hành êm ái. Phù hợp cho cả di chuyển trong phố và đường trường.",
        status: "rented",
        features: "i-Activsense, Bose Sound, HUD, Ghế chỉnh điện, Cốp điện",
      },
      {
        id: "car-6",
        brand: "BMW",
        model: "M4",
        year: 2023,
        type: "sports",
        transmission: "automatic",
        fuel: "gasoline",
        seats: 4,
        pricePerDay: 4000000,
        image: "/attached_assets/stock_images/sports_car_rental_pr_aa2de8a4.jpg",
        description: "BMW M4 Competition - siêu phẩm thể thao từ Đức. Động cơ twin-turbo 503 mã lực, 0-100km/h chỉ 3.9 giây.",
        status: "available",
        features: "M xDrive, Carbon Roof, M Track Mode, Harman Kardon, Carbon Bucket Seats",
      },
      {
        id: "car-7",
        brand: "Hyundai",
        model: "Accent",
        year: 2023,
        type: "sedan",
        transmission: "automatic",
        fuel: "gasoline",
        seats: 5,
        pricePerDay: 500000,
        image: "/attached_assets/stock_images/luxury_sedan_car_pro_ab45093e.jpg",
        description: "Hyundai Accent - lựa chọn tiết kiệm và tin cậy. Phù hợp cho di chuyển hàng ngày và công tác.",
        status: "available",
        features: "Camera lùi, Bluetooth, Điều hòa, Cảm biến lùi, Android Auto",
      },
    ];

    sampleCars.forEach((car) => {
      this.cars.set(car.id, car);
    });

    const sampleBookings: Booking[] = [
      {
        id: "booking-1",
        carId: "car-5",
        customerName: "Nguyễn Văn An",
        customerPhone: "0909123456",
        customerId: "012345678901",
        startDate: "2024-11-28",
        endDate: "2024-12-02",
        totalPrice: 4500000,
        status: "renting",
        notes: "Cần nhận xe vào buổi sáng",
        createdAt: "2024-11-27T10:00:00Z",
      },
      {
        id: "booking-2",
        carId: "car-1",
        customerName: "Trần Thị Bình",
        customerPhone: "0912345678",
        customerId: "023456789012",
        startDate: "2024-12-01",
        endDate: "2024-12-03",
        totalPrice: 1600000,
        status: "confirmed",
        notes: "",
        createdAt: "2024-11-29T14:30:00Z",
      },
      {
        id: "booking-3",
        carId: "car-3",
        customerName: "Lê Minh Cường",
        customerPhone: "0987654321",
        customerId: "034567890123",
        startDate: "2024-12-05",
        endDate: "2024-12-10",
        totalPrice: 12500000,
        status: "pending",
        notes: "Đám cưới, cần trang trí xe",
        createdAt: "2024-11-30T09:15:00Z",
      },
    ];

    sampleBookings.forEach((booking) => {
      this.bookings.set(booking.id, booking);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = await bcryptjs.hash(insertUser.password, 10);
    const user: User = { 
      id, 
      username: insertUser.username,
      hashedPassword,
      role: insertUser.role || "customer"
    };
    this.users.set(id, user);
    return user;
  }

  async authenticateUser(username: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByUsername(username);
    if (!user) return undefined;
    
    const isPasswordValid = await bcryptjs.compare(password, user.hashedPassword);
    if (!isPasswordValid) return undefined;
    
    return user;
  }

  async getCars(): Promise<Car[]> {
    return Array.from(this.cars.values());
  }

  async getCar(id: string): Promise<Car | undefined> {
    return this.cars.get(id);
  }

  async createCar(insertCar: InsertCar): Promise<Car> {
    const id = `car-${randomUUID()}`;
    const car: Car = { ...insertCar, id };
    this.cars.set(id, car);
    return car;
  }

  async updateCar(id: string, updates: Partial<InsertCar>): Promise<Car | undefined> {
    const car = this.cars.get(id);
    if (!car) return undefined;
    
    const updatedCar = { ...car, ...updates };
    this.cars.set(id, updatedCar);
    return updatedCar;
  }

  async deleteCar(id: string): Promise<boolean> {
    return this.cars.delete(id);
  }

  async getBookings(): Promise<BookingWithCar[]> {
    const bookings = Array.from(this.bookings.values());
    return bookings.map((booking) => {
      const car = this.cars.get(booking.carId);
      return {
        ...booking,
        car: car as Car,
      };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getBooking(id: string): Promise<BookingWithCar | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const car = this.cars.get(booking.carId);
    return {
      ...booking,
      car: car as Car,
    };
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = `booking-${randomUUID()}`;
    const booking: Booking = {
      ...insertBooking,
      id,
      createdAt: new Date().toISOString(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBooking(id: string, updates: Partial<InsertBooking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, ...updates };
    this.bookings.set(id, updatedBooking);

    if (updates.status === "renting") {
      const car = this.cars.get(booking.carId);
      if (car) {
        this.cars.set(booking.carId, { ...car, status: "rented" });
      }
    } else if (updates.status === "returned" || updates.status === "cancelled") {
      const car = this.cars.get(booking.carId);
      if (car) {
        this.cars.set(booking.carId, { ...car, status: "available" });
      }
    }
    
    return updatedBooking;
  }

  async deleteBooking(id: string): Promise<boolean> {
    return this.bookings.delete(id);
  }
}

export const storage = new MemStorage();

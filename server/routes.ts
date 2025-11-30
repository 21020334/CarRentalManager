import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCarSchema, insertBookingSchema, signupSchema, loginSchema } from "@shared/schema";
import { z } from "zod";

declare global {
  namespace Express {
    interface Request {
      session: any;
    }
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = signupSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ error: "Tên đăng nhập đã tồn tại" });
      }
      
      const user = await storage.createUser({
        username: validatedData.username,
        password: validatedData.password,
        role: "customer",
      });
      
      req.session.userId = user.id;
      res.status(201).json({ 
        id: user.id, 
        username: user.username, 
        role: user.role 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Dữ liệu không hợp lệ", details: error.errors });
      }
      res.status(500).json({ error: "Không thể đăng ký" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const user = await storage.authenticateUser(validatedData.username, validatedData.password);
      if (!user) {
        return res.status(401).json({ error: "Tên đăng nhập hoặc mật khẩu không đúng" });
      }
      
      req.session.userId = user.id;
      res.json({ 
        id: user.id, 
        username: user.username, 
        role: user.role 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Dữ liệu không hợp lệ", details: error.errors });
      }
      res.status(500).json({ error: "Không thể đăng nhập" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ error: "Không thể đăng xuất" });
      }
      res.json({ message: "Đã đăng xuất" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Chưa đăng nhập" });
    }
    
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ error: "Người dùng không tồn tại" });
      }
      res.json({ 
        id: user.id, 
        username: user.username, 
        role: user.role 
      });
    } catch (error) {
      res.status(500).json({ error: "Có lỗi xảy ra" });
    }
  });

  app.get("/api/cars", async (req, res) => {
    try {
      const cars = await storage.getCars();
      res.json(cars);
    } catch (error) {
      res.status(500).json({ error: "Không thể lấy danh sách xe" });
    }
  });

  app.get("/api/cars/:id", async (req, res) => {
    try {
      const car = await storage.getCar(req.params.id);
      if (!car) {
        return res.status(404).json({ error: "Không tìm thấy xe" });
      }
      res.json(car);
    } catch (error) {
      res.status(500).json({ error: "Không thể lấy thông tin xe" });
    }
  });

  app.post("/api/cars", async (req, res) => {
    try {
      const validatedData = insertCarSchema.parse(req.body);
      const car = await storage.createCar(validatedData);
      res.status(201).json(car);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Dữ liệu không hợp lệ", details: error.errors });
      }
      res.status(500).json({ error: "Không thể tạo xe mới" });
    }
  });

  app.patch("/api/cars/:id", async (req, res) => {
    try {
      const partialSchema = insertCarSchema.partial();
      const validatedData = partialSchema.parse(req.body);
      const car = await storage.updateCar(req.params.id, validatedData);
      if (!car) {
        return res.status(404).json({ error: "Không tìm thấy xe" });
      }
      res.json(car);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Dữ liệu không hợp lệ", details: error.errors });
      }
      res.status(500).json({ error: "Không thể cập nhật xe" });
    }
  });

  app.delete("/api/cars/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCar(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Không tìm thấy xe" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Không thể xóa xe" });
    }
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Không thể lấy danh sách đơn thuê" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: "Không tìm thấy đơn thuê" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Không thể lấy thông tin đơn thuê" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      
      const car = await storage.getCar(validatedData.carId);
      if (!car) {
        return res.status(400).json({ error: "Xe không tồn tại" });
      }
      if (car.status !== "available") {
        return res.status(400).json({ error: "Xe không khả dụng" });
      }
      
      const booking = await storage.createBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Dữ liệu không hợp lệ", details: error.errors });
      }
      res.status(500).json({ error: "Không thể tạo đơn thuê" });
    }
  });

  app.patch("/api/bookings/:id", async (req, res) => {
    try {
      const partialSchema = insertBookingSchema.partial();
      const validatedData = partialSchema.parse(req.body);
      const booking = await storage.updateBooking(req.params.id, validatedData);
      if (!booking) {
        return res.status(404).json({ error: "Không tìm thấy đơn thuê" });
      }
      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Dữ liệu không hợp lệ", details: error.errors });
      }
      res.status(500).json({ error: "Không thể cập nhật đơn thuê" });
    }
  });

  app.delete("/api/bookings/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteBooking(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Không tìm thấy đơn thuê" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Không thể xóa đơn thuê" });
    }
  });

  return httpServer;
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCarSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

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

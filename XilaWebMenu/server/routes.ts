import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertCategorySchema, insertProductSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  // Categories
  app.get("/api/categories", async (_req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.post("/api/categories", async (req, res) => {
    const category = insertCategorySchema.parse(req.body);
    const created = await storage.createCategory(category);
    res.json(created);
  });

  app.patch("/api/categories/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const category = insertCategorySchema.partial().parse(req.body);
    const updated = await storage.updateCategory(id, category);
    res.json(updated);
  });

  app.delete("/api/categories/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteCategory(id);
    res.status(204).end();
  });

  // Products
  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.post("/api/products", async (req, res) => {
    const product = insertProductSchema.parse(req.body);
    const created = await storage.createProduct(product);
    res.json(created);
  });

  app.patch("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const product = insertProductSchema.partial().parse(req.body);
    const updated = await storage.updateProduct(id, product);
    res.json(updated);
  });

  app.delete("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteProduct(id);
    res.status(204).end();
  });

  const httpServer = createServer(app);
  return httpServer;
}

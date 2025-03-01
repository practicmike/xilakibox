import { pgTable, text, serial, integer, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  isRequired: boolean("is_required").notNull(),
  maxSelections: integer("max_selections").notNull(),
  sortOrder: integer("sort_order").notNull()
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  basePrice: integer("base_price").notNull(),
  categoryId: integer("category_id").notNull(),
  extraPrice: integer("extra_price").default(0),
  spicyLevel: integer("spicy_level").default(0)
});

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;

export const insertCategorySchema = createInsertSchema(categories);
export const insertProductSchema = createInsertSchema(products);

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export const orderItemSchema = z.object({
  productId: z.number(),
  quantity: z.number(),
  selections: z.array(z.number()),
  extras: z.array(z.number())
});

export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSchema = z.object({
  items: z.array(orderItemSchema),
  total: z.number(),
  customerName: z.string(),
  customerPhone: z.string()
});

export type Order = z.infer<typeof orderSchema>;

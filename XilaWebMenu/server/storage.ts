import { Category, Product, InsertCategory, InsertProduct } from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: number): Promise<void>;

  // Products
  getProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private categoryId: number;
  private productId: number;

  constructor() {
    this.categories = new Map();
    this.products = new Map();
    this.categoryId = 1;
    this.productId = 1;
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Add default categories
    const categories: InsertCategory[] = [
      { name: "Salsas", isRequired: true, maxSelections: 1, sortOrder: 1 },
      { name: "Proteínas", isRequired: true, maxSelections: 1, sortOrder: 2 },
      { name: "Toppings", isRequired: false, maxSelections: 99, sortOrder: 3 },
      { name: "Extras", isRequired: false, maxSelections: 99, sortOrder: 4 },
      { name: "Bebidas", isRequired: false, maxSelections: 99, sortOrder: 5 }
    ];

    categories.forEach(cat => this.createCategory(cat));

    // Add default products
    const products: InsertProduct[] = [
      // Salsas
      { name: "Salsa suiza", description: "🌶️", basePrice: 0, categoryId: 1, spicyLevel: 1 },
      { name: "Salsa verde", description: "🌶️🌶️", basePrice: 0, categoryId: 1, spicyLevel: 2 },
      { name: "Salsa roja", description: "🌶️🌶️", basePrice: 0, categoryId: 1, spicyLevel: 2 },
      { name: "Salsa chipotle", description: "🌶️🌶️🌶️", basePrice: 0, categoryId: 1, spicyLevel: 3 },

      // Proteínas
      { name: "Pollo", description: "", basePrice: 0, categoryId: 2 },
      { name: "Bistec", description: "", basePrice: 0, categoryId: 2 },
      { name: "Chorizo", description: "", basePrice: 0, categoryId: 2 },
      { name: "Huevo", description: "", basePrice: 0, categoryId: 2 },
      { name: "Vegetariano", description: "calabaza, pimiento, zanahoria", basePrice: 0, categoryId: 2 },

      // Toppings
      { name: "Cebolla", description: "", basePrice: 0, categoryId: 3 },
      { name: "Cilantro", description: "", basePrice: 0, categoryId: 3 },
      { name: "Queso tipo ranchero", description: "", basePrice: 0, categoryId: 3 },
      { name: "Crema", description: "", basePrice: 0, categoryId: 3 },

      // Extras
      { name: "Pollo Extra", description: "", basePrice: 2000, categoryId: 4 },
      { name: "Bistec Extra", description: "", basePrice: 2000, categoryId: 4 },
      { name: "Chorizo Extra", description: "", basePrice: 1800, categoryId: 4 },
      { name: "Huevo Extra", description: "", basePrice: 1300, categoryId: 4 },
      { name: "Vegetariano Extra", description: "", basePrice: 1500, categoryId: 4 },
      { name: "Salsa Extra", description: "", basePrice: 1500, categoryId: 4 },
      { name: "Aguacate", description: "🥑", basePrice: 1500, categoryId: 4 },
      { name: "Queso Manchego", description: "🧀", basePrice: 1500, categoryId: 4 },
      { name: "Guacamole", description: "100gr 🥑🍅🧅", basePrice: 2500, categoryId: 4 },

      // Bebidas
      { name: "Agua de Jamaica", description: "", basePrice: 3500, categoryId: 5 },
      { name: "Agua de limón con menta", description: "", basePrice: 3500, categoryId: 5 }
    ];

    products.forEach(prod => this.createProduct(prod));
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values())
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const newCategory = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category> {
    const existing = this.categories.get(id);
    if (!existing) throw new Error("Category not found");
    const updated = { ...existing, ...category };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: number): Promise<void> {
    this.categories.delete(id);
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const newProduct = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const existing = this.products.get(id);
    if (!existing) throw new Error("Product not found");
    const updated = { ...existing, ...product };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    this.products.delete(id);
  }
}

export const storage = new MemStorage();
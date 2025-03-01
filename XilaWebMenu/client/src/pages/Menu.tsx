import { useQuery } from "@tanstack/react-query";
import { Category, Product } from "@shared/schema";
import ProductCard from "@/components/ProductCard";
import Cart from "@/components/Cart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Settings } from "lucide-react";

export default function Menu() {
  const { data: categories, isLoading: loadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories']
  });

  const { data: products, isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products']
  });

  if (loadingCategories || loadingProducts) {
    return <div>Loading...</div>;
  }

  const basePrice = 14000; // $140 MXN in cents

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
            Xilaki'Box
          </h1>
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Chilaquiles Box</h2>
              <p className="text-muted-foreground">
                Precio base: ${basePrice/100} MXN
              </p>
            </div>

            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-8">
                {categories?.map(category => (
                  <div key={category.id} className="space-y-4">
                    <div className="flex items-baseline justify-between">
                      <h2 className="text-xl font-semibold">{category.name}</h2>
                      {category.isRequired && (
                        <span className="text-sm text-red-500">* Obligatorio</span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products
                        ?.filter(p => p.categoryId === category.id)
                        .map(product => (
                          <ProductCard 
                            key={product.id} 
                            product={product}
                            required={category.isRequired}
                            maxSelections={category.maxSelections}
                          />
                        ))
                      }
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <Cart />
        </div>
      </main>
    </div>
  );
}
import { useCart } from "@/context/CartContext";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, X } from "lucide-react";
import { Product } from "@shared/schema";

export default function Cart() {
  const { state, dispatch } = useCart();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products']
  });

  const getProductName = (id: number) => {
    return products.find(p => p.id === id)?.name || '';
  };

  const sendToWhatsApp = () => {
    const message = encodeURIComponent(`
🛍️ Nuevo pedido de Xilaki'Box:

${state.items.map((item, i) => {
  const selections = item.selections.map(id => getProductName(id));
  const extras = item.extras.map(id => getProductName(id));

  return `
${i + 1}. Chilaquiles Box
   - Salsa: ${selections[0]}
   - Proteína: ${selections[1]}
   ${extras.length > 0 ? `- Extras: ${extras.join(', ')}` : ''}
`}).join('\n')}

💰 Total: $${state.total/100} MXN
    `);

    window.open(`https://wa.me/529843625708?text=${message}`);
  };

  const canAddToCart = state.currentSelection.salsa !== null && 
                      state.currentSelection.proteina !== null;

  const handleAddToCart = () => {
    if (canAddToCart) {
      dispatch({ 
        type: 'ADD_ITEM',
        payload: {
          selections: [
            state.currentSelection.salsa!,
            state.currentSelection.proteina!,
            ...state.currentSelection.toppings
          ],
          extras: state.currentSelection.extras,
          basePrice: 14000 // $140 MXN in cents
        }
      });
    }
  };

  return (
    <Card className="w-full md:w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Carrito
        </CardTitle>
      </CardHeader>
      <CardContent>
        {state.currentSelection.salsa !== null || state.currentSelection.proteina !== null ? (
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Selección actual:</h3>
            {state.currentSelection.salsa && (
              <p className="text-sm">Salsa: {getProductName(state.currentSelection.salsa)}</p>
            )}
            {state.currentSelection.proteina && (
              <p className="text-sm">Proteína: {getProductName(state.currentSelection.proteina)}</p>
            )}
            {state.currentSelection.toppings.length > 0 && (
              <p className="text-sm">
                Toppings: {state.currentSelection.toppings.map(id => getProductName(id)).join(', ')}
              </p>
            )}
            {state.currentSelection.extras.length > 0 && (
              <p className="text-sm">
                Extras: {state.currentSelection.extras.map(id => getProductName(id)).join(', ')}
              </p>
            )}
            <Button 
              className="w-full mt-2" 
              disabled={!canAddToCart}
              onClick={handleAddToCart}
            >
              Agregar al carrito
            </Button>
          </div>
        ) : null}

        {state.items.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Tu carrito está vacío
          </p>
        ) : (
          <>
            <div className="space-y-4">
              {state.items.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Chilaquiles Box</p>
                      <p className="text-sm text-muted-foreground">
                        Salsa: {getProductName(item.selections[0])}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Proteína: {getProductName(item.selections[1])}
                      </p>
                      {item.extras.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Extras: {item.extras.map(id => getProductName(id)).join(', ')}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: index })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold">Total:</span>
                <span>${state.total/100} MXN</span>
              </div>
              <Button className="w-full" onClick={sendToWhatsApp}>
                Ordenar por WhatsApp
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
import { Product } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  required: boolean;
  maxSelections: number;
}

export default function ProductCard({ product, required, maxSelections }: ProductCardProps) {
  const { state, dispatch } = useCart();
  const { toast } = useToast();

  const isSalsa = product.categoryId === 1;
  const isProteina = product.categoryId === 2;
  const isTopping = product.categoryId === 3;
  const isExtra = product.categoryId === 4;
  const isBebida = product.categoryId === 5;

  const handleClick = () => {
    if (isSalsa) {
      dispatch({ type: 'SELECT_SALSA', payload: product.id });
      toast({
        title: "Salsa seleccionada",
        description: product.name
      });
    } else if (isProteina) {
      dispatch({ type: 'SELECT_PROTEINA', payload: product.id });
      toast({
        title: "Proteína seleccionada",
        description: product.name
      });
    } else if (isTopping) {
      const isToppingSelected = state.currentSelection.toppings.includes(product.id);
      if (isToppingSelected) {
        dispatch({ type: 'REMOVE_TOPPING', payload: product.id });
      } else if (state.currentSelection.toppings.length < maxSelections) {
        dispatch({ type: 'ADD_TOPPING', payload: product.id });
      }
    } else if (isExtra || isBebida) {
      const isExtraSelected = state.currentSelection.extras.includes(product.id);
      if (isExtraSelected) {
        dispatch({ type: 'REMOVE_EXTRA', payload: product.id });
      } else {
        dispatch({ 
          type: 'ADD_EXTRA', 
          payload: { 
            id: product.id,
            price: product.basePrice
          }
        });
      }
    }
  };

  const isSelected = isSalsa ? 
    state.currentSelection.salsa === product.id : 
    isProteina ? 
      state.currentSelection.proteina === product.id :
      isTopping ?
        state.currentSelection.toppings.includes(product.id) :
        state.currentSelection.extras.includes(product.id);

  const getButtonText = () => {
    if (isSelected) {
      return "Seleccionado";
    }
    if (isTopping || isExtra || isBebida) {
      return "Agregar";
    }
    return "Seleccionar";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{product.name}</span>
          {product.spicyLevel && product.spicyLevel > 0 && (
            <span>{'🌶️'.repeat(product.spicyLevel)}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          {product.basePrice > 0 && (
            <p className="text-lg font-semibold">
              +${product.basePrice / 100} MXN
            </p>
          )}
          <Button 
            onClick={handleClick}
            className="ml-auto"
            variant={isSelected ? "secondary" : required ? "default" : "outline"}
          >
            {getButtonText()}
          </Button>
        </div>
        {product.description && (
          <p className="text-sm text-muted-foreground mt-2">
            {product.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
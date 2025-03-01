import { createContext, useContext, useReducer, ReactNode } from 'react';
import { OrderItem } from '@shared/schema';

interface CartState {
  items: OrderItem[];
  total: number;
  currentSelection: {
    salsa: number | null;
    proteina: number | null;
    toppings: number[];
    extras: number[];
  };
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: { selections: number[]; extras: number[]; basePrice: number } }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'SELECT_SALSA'; payload: number }
  | { type: 'SELECT_PROTEINA'; payload: number }
  | { type: 'ADD_TOPPING'; payload: number }
  | { type: 'REMOVE_TOPPING'; payload: number }
  | { type: 'ADD_EXTRA'; payload: { id: number; price: number } }
  | { type: 'REMOVE_EXTRA'; payload: number }
  | { type: 'CLEAR_CART' }
  | { type: 'RESET_SELECTIONS' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

const BASE_PRICE = 14000; // $140 MXN in cents

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      const newItem: OrderItem = {
        productId: 0, // Este ID no se usa ya que guardamos las selecciones
        quantity: 1,
        selections: action.payload.selections,
        extras: state.currentSelection.extras
      };
      return {
        ...state,
        items: [...state.items, newItem],
        total: calculateTotal([...state.items, newItem], action.payload.basePrice),
        currentSelection: {
          salsa: null,
          proteina: null,
          toppings: [],
          extras: []
        }
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((_, index) => index !== action.payload),
        total: calculateTotal(
          state.items.filter((_, index) => index !== action.payload),
          BASE_PRICE
        )
      };
    case 'SELECT_SALSA':
      return {
        ...state,
        currentSelection: {
          ...state.currentSelection,
          salsa: action.payload
        }
      };
    case 'SELECT_PROTEINA':
      return {
        ...state,
        currentSelection: {
          ...state.currentSelection,
          proteina: action.payload
        }
      };
    case 'ADD_TOPPING':
      return {
        ...state,
        currentSelection: {
          ...state.currentSelection,
          toppings: [...state.currentSelection.toppings, action.payload]
        }
      };
    case 'REMOVE_TOPPING':
      return {
        ...state,
        currentSelection: {
          ...state.currentSelection,
          toppings: state.currentSelection.toppings.filter(id => id !== action.payload)
        }
      };
    case 'ADD_EXTRA':
      return {
        ...state,
        currentSelection: {
          ...state.currentSelection,
          extras: [...state.currentSelection.extras, action.payload.id]
        }
      };
    case 'REMOVE_EXTRA':
      return {
        ...state,
        currentSelection: {
          ...state.currentSelection,
          extras: state.currentSelection.extras.filter(id => id !== action.payload)
        }
      };
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        currentSelection: {
          salsa: null,
          proteina: null,
          toppings: [],
          extras: []
        }
      };
    case 'RESET_SELECTIONS':
      return {
        ...state,
        currentSelection: {
          salsa: null,
          proteina: null,
          toppings: [],
          extras: []
        }
      };
    default:
      return state;
  }
}

function calculateTotal(items: OrderItem[], basePrice: number): number {
  return items.reduce((sum, item) => {
    let itemTotal = basePrice;
    // Sumar precio de extras
    itemTotal += item.extras.length * 1500; // $15 MXN por extra
    return sum + itemTotal;
  }, 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    currentSelection: {
      salsa: null,
      proteina: null,
      toppings: [],
      extras: []
    }
  });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
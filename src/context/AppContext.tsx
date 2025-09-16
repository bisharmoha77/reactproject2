import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { MenuItem, Reservation, Order, Review, OrderItem } from '../types';
import { menuItems, mockReservations, mockOrders, mockReviews } from '../data/mockData';

interface AppState {
  menuItems: MenuItem[];
  reservations: Reservation[];
  orders: Order[];
  reviews: Review[];
  cart: OrderItem[];
  searchQuery: string;
  selectedCategory: string;
}

type AppAction =
  | { type: 'ADD_TO_CART'; payload: OrderItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_RESERVATION'; payload: Reservation }
  | { type: 'UPDATE_RESERVATION'; payload: { id: string; updates: Partial<Reservation> } }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: { id: string; updates: Partial<Order> } }
  | { type: 'ADD_REVIEW'; payload: Review }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string }
  | { type: 'ADD_MENU_ITEM'; payload: MenuItem }
  | { type: 'UPDATE_MENU_ITEM'; payload: { id: string; updates: Partial<MenuItem> } }
  | { type: 'DELETE_MENU_ITEM'; payload: string };

const initialState: AppState = {
  menuItems,
  reservations: mockReservations,
  orders: mockOrders,
  reviews: mockReviews,
  cart: [],
  searchQuery: '',
  selectedCategory: 'all',
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.menuItem.id === action.payload.menuItem.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.menuItem.id === action.payload.menuItem.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.menuItem.id !== action.payload),
      };
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.menuItem.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };
    
    case 'ADD_RESERVATION':
      return {
        ...state,
        reservations: [...state.reservations, action.payload],
      };
    
    case 'UPDATE_RESERVATION':
      return {
        ...state,
        reservations: state.reservations.map(res =>
          res.id === action.payload.id ? { ...res, ...action.payload.updates } : res
        ),
      };
    
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };
    
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? { ...order, ...action.payload.updates } : order
        ),
      };
    
    case 'ADD_REVIEW':
      return {
        ...state,
        reviews: [...state.reviews, action.payload],
      };
    
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    
    case 'SET_SELECTED_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
      };
    
    case 'ADD_MENU_ITEM':
      return {
        ...state,
        menuItems: [...state.menuItems, action.payload],
      };
    
    case 'UPDATE_MENU_ITEM':
      return {
        ...state,
        menuItems: state.menuItems.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.updates } : item
        ),
      };
    
    case 'DELETE_MENU_ITEM':
      return {
        ...state,
        menuItems: state.menuItems.filter(item => item.id !== action.payload),
      };
    
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
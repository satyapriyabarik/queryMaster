// context/InventoryContext.tsx
import { createContext, useContext, useState } from "react";
import { InventoryItem } from "../types/inventory";

interface InventoryContextType {
  items: InventoryItem[];
  addItem: (item: InventoryItem) => void;
  removeItem: (id: string, qty: number) => void;
}

const InventoryContext = createContext<InventoryContextType>(null!);

export const InventoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);

  const addItem = (item: InventoryItem) => {
    setItems(prev => [...prev, item]);
  };

  const removeItem = (id: string, qty: number) => {
    setItems(prev =>
      prev.map(i =>
        i.id === id ? { ...i, quantity: i.quantity - qty } : i
      )
    );
  };

  return (
    <InventoryContext.Provider value={{ items, addItem, removeItem }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);

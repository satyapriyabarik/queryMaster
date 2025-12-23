import { InventoryItem } from "../types/inventory";

export function useReorderSuggestion(items: InventoryItem[]) {
  return items.filter(
    item => item.quantity <= item.minStockLevel
  );
}

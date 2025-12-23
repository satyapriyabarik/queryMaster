import { InventoryItem } from "../types/inventory";

export function applyFEFO(items: InventoryItem[]) {
  return [...items].sort(
    (a, b) =>
      new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  );
}

import { InventoryItem } from "../types/inventory";

export interface InventoryRow {
  id: string;
  name: string;
  quantity: number;
  minStockLevel?: number;
  expiryDate: string;
  storageLocation: string;
  notifyRemainingSeconds?: number;
}

export function mapInventoryToGrid(
  items: InventoryItem[]
): InventoryRow[] {
  return items.map(item => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    minStockLevel: item.minStockLevel,
    maxStockLevel: item.maxStockLevel,
    expiryDate: item.expiryDate,
    storageLocation: item.storageLocation,
    notifyRemainingSeconds: item.notifyRemainingSeconds ?? 0
  }));
}

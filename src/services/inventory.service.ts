//Create InventoryService file
export default class InventoryService {
    private inventory: { id: number; name: string; quantity: number }[] = [];

    getInventory() {
        return this.inventory;
    }
    addItem(item: { id: number; name: string; quantity: number }) {
        this.inventory.push(item);
    }
    removeItem(id: number) {
        this.inventory = this.inventory.filter(item => item.id !== id);
    }
}
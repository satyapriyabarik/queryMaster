export default function EditInventoryModal() {
  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h2 className="text-lg font-semibold mb-4">Edit Inventory Item</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemName">
                          Item Name 
                      </label>
                      <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"  
                          id="itemName"   
                          type="text" 
                          placeholder="Enter item name"
                      />
                  </div>  
                  <div className="mb-4">  
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">   
                          Quantity
                      </label>
                  </div>
      </form>
        </div>
      </div>
    );
}
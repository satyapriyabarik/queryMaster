export default  function WasteEntryForm() {
  return (
      <form className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Log Waste Entry</h2>
        <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="wasteType">    
                  Waste Type
              </label>    
              <input  
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"  
                  id="wasteType"  
                  type="text" 
                  placeholder="Enter waste type"
              />
        </div>
        <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">     
                  Quantity
              </label>
              <input  

                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="quantity"   
                  type="number"
                  placeholder="Enter quantity"
              />
        </div>
        <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date"> 
                  Date
              </label>

              <input      
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="date"
                  type="date"
              />  
          </div>
          <button 
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"

              type="submit"   
          >
              Log Waste
          </button>
        </form>
    );
}

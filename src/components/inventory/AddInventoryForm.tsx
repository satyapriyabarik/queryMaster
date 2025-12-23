import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { ADD_INVENTORY_ITEM } from "../../graphql/mutations";
import { GET_INVENTORY } from "../../graphql/queries";
import { useNavigate } from "react-router-dom";
import "../../styles/form-steps.css";

export default function AddInventoryForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "DAIRY",
    quantity: 0,
    expiryDate: "",
    storageLocation: "FRIDGE",
    minStockLevel: 0,
    maxStockLevel: 0,
    costPerUnit: 0
  });

  const [addItem, { loading, error }] = useMutation(
    ADD_INVENTORY_ITEM,
    { refetchQueries: [{ query: GET_INVENTORY }] }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }));
  };

  const next = () => {
    setDirection("left");
    setStep(s => s + 1);
  };

  const prev = () => {
    setDirection("right");
    setStep(s => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addItem({ variables: form });
    navigate("/home"); // smooth SPA navigation
  };

  const progress = (step / 3) * 100;

  return (
    <div className="container mt-4" style={{ maxWidth: 520 }}>
      <form className="bg-white p-4 shadow rounded">

        {/* Progress */}
        <div className="mb-3">
          <div className="step-progress mb-1">
            <div
              className="step-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <small className="text-muted">
            Step {step} of 3
          </small>
        </div>

        <div className="step-wrapper">
          {/* STEP 1 */}
          {step === 1 && (
            <div className={`step step-enter-${direction}`}>
              <h5 className="mb-3">Basic Information</h5>

              <label className="form-label">Item Name</label>
              <input
                className="form-control mb-2"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <label className="form-label">Category</label>
              <select
                className="form-select mb-2"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option>DAIRY</option>
                <option>MEAT</option>
                <option>PRODUCE</option>
                <option>BAKERY</option>
              </select>

              <label className="form-label">Storage Location</label>
              <select
                className="form-select mb-3"
                name="storageLocation"
                value={form.storageLocation}
                onChange={handleChange}
              >
                <option>FRIDGE</option>
                <option>FREEZER</option>
                <option>DRY</option>
              </select>

              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={next}
                disabled={!form.name}
              >
                Next
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className={`step step-enter-${direction}`}>
              <h5 className="mb-3">Stock & Expiry</h5>

              <label className="form-label">Quantity</label>
              <input
                className="form-control mb-2"
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                required
              />

              <label className="form-label">Min Stock</label>
              <input
                className="form-control mb-2"
                type="number"
                name="minStockLevel"
                value={form.minStockLevel}
                onChange={handleChange}
                required
              />

              <label className="form-label">Max Stock</label>
              <input
                className="form-control mb-2"
                type="number"
                name="maxStockLevel"
                value={form.maxStockLevel}
                onChange={handleChange}
                required
              />

              <label className="form-label">Expiry Date</label>
              <input
                className="form-control mb-3"
                type="date"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
                required
              />

              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary w-50" onClick={prev}>
                  Previous
                </button>
                <button className="btn btn-primary w-50" onClick={next}>
                  Next
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className={`step step-enter-${direction}`}>
              <h5 className="mb-3">Cost & Submit</h5>

              <label className="form-label">Cost per Unit</label>
              <input
                className="form-control mb-3"
                type="number"
                name="costPerUnit"
                value={form.costPerUnit}
                onChange={handleChange}
                required
              />

              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary w-50" onClick={prev}>
                  Previous
                </button>
                <button
                  type="submit"
                  className="btn btn-success w-50"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Submit"}
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="text-danger mt-2">
            Failed to add inventory item
          </div>
        )}
      </form>
    </div>
  );
}

import { container, items as initialItems, calculateArea, packItems, optimizePacking } from "./packing";
import './App.css';
import type { PackingItem } from "./packing";
import { useState } from 'react';

// Each packaging unit represents 36 pixels
const CELL_SIZE = 36;

// Complementary accent colors so individual boxes are easy to tell apart.
// Picked by item id (not position) so a box keeps its color after optimizing.
const BOX_COLORS = [
  "#145568",
  "#C1663B",
  "#2E7D6B",
  "#6B4FA0",
  "#B8862B",
  "#397989",
  "#8C4B5E",
  "#4A6FA5",
];

function getBoxColor(id: number) {
  return BOX_COLORS[id % BOX_COLORS.length];
}

function App() {
  const [packingItems, setPackingItems] = useState<PackingItem[]>(initialItems);
  const [isOptimized, setIsOptimized] = useState(false);
  const [boxName, setBoxName] = useState("");
  const [boxWidth, setBoxWidth] = useState(2);
  const [boxHeight, setBoxHeight] = useState(2);
  const [formError, setFormError] = useState("");

  const { placed, unplaced } = isOptimized ? optimizePacking(packingItems, container): packItems(packingItems, container);

  const containerArea = calculateArea(
    container.width,
    container.height
  );

  // Calculate the total area occupied by packed boxes
  const usedArea = placed.reduce((total, item) => {
    return total + calculateArea(item.width, item.height);
  }, 0)

  // Calculate utilization as a percentage
  const utilization = (usedArea / containerArea) * 100;


  function handleAddBox() {
    const trimmedName = boxName.trim();

    if (trimmedName === "") {
      setFormError("Please give the box a name.");
      return;
    }

    if (
      !Number.isSafeInteger(boxWidth) ||
      !Number.isSafeInteger(boxHeight) ||
      boxWidth <= 0 ||
      boxHeight <= 0
    ) {
      setFormError("Width and height must be whole numbers greater than 0.");
      return;
    }

    if (boxWidth > container.width || boxHeight > container.height) {
      setFormError(
        `Heads up: ${trimmedName} (${boxWidth} × ${boxHeight}) is bigger than the container (${container.width} × ${container.height}) and won't be packed.`
      );
    } else {
      setFormError("");
    }

    const newBox: PackingItem = {
      id: Math.max(0, ...packingItems.map(item => item.id)) + 1,
      name: trimmedName,
      width: boxWidth,
      height: boxHeight,
    };

    setPackingItems([...packingItems, newBox]);
    setIsOptimized(false);
  }


  function handleRemoveBox(id: number) {
    setPackingItems(packingItems.filter((item) => item.id !== id));
    setIsOptimized(false);
  }


  function handleReset() {
    // Restore the original boxes
    setPackingItems([...initialItems]);

    // Reset the form
    setBoxName("");
    setBoxWidth(2);
    setBoxHeight(2);
    setFormError("");

    // Return to the original arrangement
    setIsOptimized(false);
  }


  return (
    <main className="app">
      <header>
        <h1>Tuckspace</h1>
        <p>Make every space count.</p>
      </header>

      
      <section className="panel">
        <h2>Add Custom Box</h2>

        <div className="box-form">
          <label>
            Box Name
            <input
              type="text"
              placeholder="Example: Laptop"
              value={boxName}
              onChange={(e) => setBoxName(e.target.value)}
            />
          </label>

          <label>
            Width
            <input
              type="number"
              min="1"
              value={boxWidth}
              onChange={(e) => setBoxWidth(Number(e.target.value))}
            />
          </label>

          <label>
            Height
            <input
              type="number"
              min="1"
              value={boxHeight}
              onChange={(e) => setBoxHeight(Number(e.target.value))}
            />
          </label>
        </div>

        {formError && <p className="form-error">{formError}</p>}

        <button
          className="add-box-button"
          onClick={handleAddBox}
        >
          + Add Box
        </button>
      </section>

      <div className="packing-actions">
        <button
          className="add-box-button"
          onClick={() => setIsOptimized(true)}
        >
          Optimize Packing
        </button>

        <button
          className="secondary-button"
          onClick={() => setIsOptimized(false)}
        >
          Original Order
        </button>

        <button
          className="reset-button"
          onClick={handleReset}
        >
          Reset Demo
        </button>

      </div>

      <section className="panel">
        <h2>Packaging Canvas</h2>

        <div className="canvas-scroll">

          <div
            className="packing-canvas"
            style={{
              width: container.width * CELL_SIZE,
              height: container.height * CELL_SIZE,
            }}
          >
            {placed.map((item) => (
              <div
                key={item.id}
                className="packing-box"
                style={{
                  left: item.x * CELL_SIZE,
                  top: item.y * CELL_SIZE,
                  width: item.width * CELL_SIZE,
                  height: item.height * CELL_SIZE,
                  background: getBoxColor(item.id),
                }}
              >
                {item.name}
            </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <h2>Available Objects</h2>

        {packingItems.length === 0 && (
          <p className="empty-message">No boxes yet — add one above.</p>
        )}

        {packingItems.map((item) => (
          <div className="box-list-item" key={item.id}>
            <span
              className="box-color-swatch"
              style={{ background: getBoxColor(item.id) }}
            />
            <p>
              {item.name}: {item.width} × {item.height}
              {' - '}
              {calculateArea(item.width, item.height)} units²
            </p>
            <button
              className="remove-button"
              onClick={() => handleRemoveBox(item.id)}
              aria-label={`Remove ${item.name}`}
            >
              ×
            </button>
          </div>
        ))}
      </section>

      <section className="panel">
        <h2>Unpacked Boxes</h2>

        {unplaced.length === 0 ? (
          <p className="empty-message">Every box fit. Nice work!</p>
        ) : (
          unplaced.map((item) => (
            <div className="box-list-item" key={item.id}>
              <span
                className="box-color-swatch"
                style={{ background: getBoxColor(item.id) }}
              />
              <p>
                {item.name}: {item.width} × {item.height}
                {' - '}
                {item.width > container.width || item.height > container.height
                  ? "too large for the container"
                  : "no space left in this layout"}
              </p>
            </div>
          ))
        )}
      </section>

      <section className="panel">
        <h2>Packing Statistics</h2>

        <p>Container Area: {containerArea} units²</p>

        <p>Used Area: {usedArea} units²</p>

        <p>Space Utilization: {utilization.toFixed(1)}%</p>

        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${Math.min(utilization, 100)}%` }}
          />
        </div>

        <p>Objects Packed: {placed.length}</p>

        <p>Objects Unpacked: {unplaced.length}</p>
      </section>
    </main>
  );
}

export default App;
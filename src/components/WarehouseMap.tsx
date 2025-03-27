import { useRef, useEffect, useState, useCallback } from "react";
import { Warehouse, Position, Place } from "../types";
import { drawGrid, drawCell, drawShuttle, drawPallet } from "./draw";
import { Tooltip } from "./Tooltip";

const CELL_SIZE = 60;
const GAP = 4;
const GRID_SIZE = 10;
const CANVAS_SIZE = GRID_SIZE * (CELL_SIZE + GAP) + GAP;
const SHUTTLE_SIZE = CELL_SIZE * 0.7;
const PALLET_SIZE = CELL_SIZE * 0.5;

const WS_URL = "ws://localhost:9004/ws";

export const WarehouseMap = ({ warehouse }: { warehouse: Warehouse }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [state, setState] = useState(warehouse);
  const [hoveredPlace, setHoveredPlace] = useState<Place | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const ws = useRef<WebSocket | null>(null);

  const connectWebSocket = useCallback(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onmessage = (event) => {
      try {
        const newData: Warehouse = JSON.parse(event.data);
        setState(newData);
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    ws.current.onclose = () => {
      setTimeout(connectWebSocket, 3000);
    };

    return () => ws.current?.close();
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid(ctx, CELL_SIZE, GRID_SIZE, GAP);

    state.floors[selectedFloor]?.rows.forEach((row) => {
      row.places.forEach((place) => {
        const x = place.coordinates.x * (CELL_SIZE + GAP) + GAP / 2;
        const y = place.coordinates.y * (CELL_SIZE + GAP) + GAP / 2;

        drawCell(ctx, place, CELL_SIZE, GAP);

        if (place.shuttle) {
          drawShuttle(ctx, x, y, SHUTTLE_SIZE, place.shuttle);
        }

        if (place.pallet) {
          const palletX = x + CELL_SIZE - PALLET_SIZE - 2;
          const palletY = y + 2;
          drawPallet(ctx, palletX, palletY, PALLET_SIZE);
        }
      });
    });
  }, [state, selectedFloor]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let foundPlace: Place | undefined;

      state.floors[selectedFloor]?.rows.forEach((row) => {
        row.places.forEach((place) => {
          const x = place.coordinates.x * (CELL_SIZE + GAP) + GAP / 2;
          const y = place.coordinates.y * (CELL_SIZE + GAP) + GAP / 2;

          if (
            mouseX >= x &&
            mouseX <= x + CELL_SIZE &&
            mouseY >= y &&
            mouseY <= y + CELL_SIZE
          ) {
            foundPlace = place;
            setTooltipPosition({ x: e.clientX + 15, y: e.clientY + 15 });
          }
        });
      });

      setHoveredPlace(foundPlace || null);
    },
    [state, selectedFloor]
  );

  useEffect(() => {
    draw();
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("mousemove", handleMouseMove);
    return () => canvas.removeEventListener("mousemove", handleMouseMove);
  }, [draw, handleMouseMove]);

  useEffect(() => {
    connectWebSocket();
  }, [connectWebSocket]);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ marginBottom: 10 }}>
        <label>Select Floor: </label>
        <select
          value={selectedFloor}
          onChange={(e) => setSelectedFloor(Number(e.target.value))}
        >
          {state.floors.map((floor, index) => (
            <option key={floor.floorNumber} value={index}>
              Floor {floor.floorNumber + 1}
            </option>
          ))}
        </select>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={{
          border: "1px solid #ccc",
          background: "#fff",
          margin: "50px 0",
        }}
      />

      {hoveredPlace && (
        <Tooltip
          position={tooltipPosition}
          text={[
            `Name: ${hoveredPlace.name}`,
            `Location: ${hoveredPlace.location}`,
            `Type: ${hoveredPlace.type}`,
            hoveredPlace.pallet && `Pallet: ${hoveredPlace.pallet.barcode}`,
            hoveredPlace.shuttle &&
              `Battery: ${hoveredPlace.shuttle.batteryLevel}%`,
          ]
            .filter(Boolean)
            .join("\n")}
          cellSize={0}
        />
      )}

      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          padding: "8px 16px",
          background:
            ws.current?.readyState === WebSocket.OPEN ? "#4CAF50" : "#f44336",
          color: "white",
          borderRadius: 4,
        }}
      >
        {ws.current?.readyState === WebSocket.OPEN
          ? "Connected"
          : "Disconnected"}
      </div>
    </div>
  );
};

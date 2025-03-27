import { useRef, useEffect, useState, useCallback } from "react";
import { Warehouse, Position } from "../types";
import { drawGrid, drawCell, drawShuttle } from "./draw";

// Настройки отображения
const CELL_SIZE = 60;
const GAP = 4;
const GRID_SIZE = 10;
const CANVAS_SIZE = GRID_SIZE * (CELL_SIZE + GAP) + GAP;

const colors = {
  STORAGE: "#f0f0f0",
  PASSAGE: "#b3e5fc",
  CHARGING: "#ffcc80",
};

const WS_URL = "ws://localhost:9004/ws";

export const WarehouseMap = ({ warehouse }: { warehouse: Warehouse }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tooltip, setTooltip] = useState<{
    pos: Position;
    text: string;
  } | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number>(0);
  const ws = useRef<WebSocket | null>(null);
  const [state, setState] = useState(warehouse);

  const connectWebSocket = useCallback(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onmessage = (event) => {
      try {
        const newData: Warehouse = JSON.parse(event.data);
        console.log(newData);
        if (newData) {
          setState(newData);
        }
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected, reconnecting...");
      setTimeout(connectWebSocket, 3000);
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const currentFloor = state.floors[selectedFloor];
    if (!currentFloor) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Фон
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Отрисовка сетки
    drawGrid(ctx, CELL_SIZE, GRID_SIZE, GAP);

    // Отрисовка ячеек
    currentFloor.places.forEach((place) => {
      drawCell(ctx, place, CELL_SIZE, GAP, colors);
      if (place.shuttle) {
        drawShuttle(ctx, place.shuttle, place, CELL_SIZE, GAP);
      }
    });
  }, [state, selectedFloor]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Обработка ховера
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const currentFloor = state.floors[selectedFloor];
      if (!currentFloor) return;

      const hoveredPlace = currentFloor.places.find((place) => {
        const x = place.coordinates.y * (CELL_SIZE + GAP) + GAP / 2;
        const y = place.coordinates.x * (CELL_SIZE + GAP) + GAP / 2;
        return (
          mouseX >= x &&
          mouseX <= x + CELL_SIZE &&
          mouseY >= y &&
          mouseY <= y + CELL_SIZE
        );
      });

      if (hoveredPlace) {
        setTooltip({
          pos: { x: mouseX, y: mouseY },
          text: `Name: ${hoveredPlace.name}\nLocation: ${hoveredPlace.location}\nType: ${hoveredPlace.type}`,
        });
      } else {
        setTooltip(null);
      }
    },
    [selectedFloor, state]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("mousemove", handleMouseMove);
    return () => canvas.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

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

      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.pos.x,
            top: tooltip.pos.y,
            background: "#fffff0",
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            pointerEvents: "none",
            whiteSpace: "pre",
            boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
            fontFamily: "monospace",
            fontSize: "14px",
            zIndex: 1000,
          }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Индикатор подключения */}
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

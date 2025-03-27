import { Place, Shuttle } from "../types";

// Чистые функции для отрисовки
export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  cellSize: number,
  gridSize: number,
  gap: number
) => {
  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 1;
  for (let i = 0; i <= gridSize; i++) {
    const pos = i * cellSize + i * gap;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, ctx.canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(ctx.canvas.width, pos);
    ctx.stroke();
  }
};

export const drawCell = (
  ctx: CanvasRenderingContext2D,
  place: Place,
  cellSize: number,
  gap: number,
  colors: Record<string, string>
) => {
  const x = place.coordinates.y * (cellSize + gap);
  const y = place.coordinates.x * (cellSize + gap);

  // Основная ячейка
  ctx.fillStyle = colors[place.type] || "#fff";
  ctx.fillRect(x + gap / 2, y + gap / 2, cellSize, cellSize);

  // Границы ячейки
  ctx.strokeStyle = "#999";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + gap / 2, y + gap / 2, cellSize, cellSize);
};

export const drawShuttle = (
  ctx: CanvasRenderingContext2D,
  shuttle: Shuttle,
  place: Place,
  cellSize: number,
  gap: number
) => {
  const x = place.coordinates.y * (cellSize + gap) + cellSize / 2 + gap / 2;
  const y = place.coordinates.x * (cellSize + gap) + cellSize / 2 + gap / 2;

  ctx.beginPath();
  ctx.arc(x, y, cellSize / 4, 0, Math.PI * 2);
  ctx.fillStyle = shuttle.state === "IDLE" ? "#ff5722" : "#4caf50";
  ctx.fill();

  ctx.fillStyle = "#000";
  ctx.font = `${Math.max(10, cellSize / 4)}px Arial`;
  ctx.textAlign = "center";
  ctx.fillText(`${shuttle.batteryLevel}%`, x, y + 5);
};

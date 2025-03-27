import { Place, Shuttle } from "../types";

const COLORS: Record<string, string> = {
  STORAGE: "#f0f0f0",
  PASSAGE: "#b3e5fc",
  CHARGING: "#ffcc80",
};

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
    const pos = i * (cellSize + gap) + gap / 2;
    ctx.beginPath();
    ctx.moveTo(pos, gap / 2);
    ctx.lineTo(pos, gridSize * (cellSize + gap) + gap / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(gap / 2, pos);
    ctx.lineTo(gridSize * (cellSize + gap) + gap / 2, pos);
    ctx.stroke();
  }
};

export const drawCell = (
  ctx: CanvasRenderingContext2D,
  place: Place,
  cellSize: number,
  gap: number
) => {
  const x = place.coordinates.x * (cellSize + gap);
  const y = place.coordinates.y * (cellSize + gap);

  ctx.strokeStyle = place.type === "PASSAGE" ? "#666" : "#999";
  ctx.lineWidth = place.type === "CHARGING" ? 2 : 1;
  ctx.strokeRect(x + gap / 2, y + gap / 2, cellSize, cellSize);

  // Основная ячейка
  ctx.fillStyle = COLORS[place.type] || "#fff";
  ctx.fillRect(x + gap / 2, y + gap / 2, cellSize, cellSize);

  // Границы ячейки
  ctx.strokeStyle = "#999";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + gap / 2, y + gap / 2, cellSize, cellSize);
};

export const drawShuttle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  shuttle: Shuttle
) => {
  // Рисуем квадратный шаттл
  ctx.fillStyle = "#2196F3";
  ctx.fillRect(x, y, size, size);

  // Тень для эффекта глубины
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Текст с батареей
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 10px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${shuttle.batteryLevel}%`, x + size / 2, y + size / 2 + 4);

  // Сбрасываем тень
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
};

export const drawPallet = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) => {
  // Рисуем круглую палету с обводкой
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2 - 2, 0, Math.PI * 2);

  // Градиент для объема
  const gradient = ctx.createRadialGradient(
    x + size / 2,
    y + size / 2,
    2,
    x + size / 2,
    y + size / 2,
    size / 2
  );
  gradient.addColorStop(0, "#4CAF50");
  gradient.addColorStop(1, "#388E3C");

  ctx.fillStyle = gradient;
  ctx.fill();

  // Белая обводка
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 2;
  ctx.stroke();
};

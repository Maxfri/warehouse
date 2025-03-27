import { useRef, useState, useEffect } from "react";
import { Position } from "../types";

interface TooltipProps {
  position: Position;
  text: string;
  cellSize: number;
}

export const Tooltip = ({ position, text, cellSize }: TooltipProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (tooltipRef.current) {
      const tooltipWidth = tooltipRef.current.offsetWidth;
      const tooltipHeight = tooltipRef.current.offsetHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let newX = position.x + cellSize + 10;
      let newY = position.y - tooltipHeight / 2;

      // Проверка на выход за границы экрана
      if (newX + tooltipWidth > windowWidth) {
        newX = position.x - tooltipWidth - 10;
      }
      if (newY < 0) {
        newY = 10;
      } else if (newY + tooltipHeight > windowHeight) {
        newY = windowHeight - tooltipHeight - 10;
      }

      setAdjustedPosition({ x: newX, y: newY });
    }
  }, [position, cellSize]);

  return (
    <div
      ref={tooltipRef}
      style={{
        position: "fixed",
        left: adjustedPosition.x,
        top: adjustedPosition.y,
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
      {text}
    </div>
  );
};

import { useState, useEffect } from "react";
import { Point, ModeEnum, options } from "@/lib/utils";
import { useStrokesStore } from "@/store/strokesStore";
import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from "@/lib/utils";

export const useCanvas = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const {
    mode,
    strokes,
    strokeColor,
    strokeWidth,
    strokeTaper,
    scale,
    panOffset,
    addStroke,
    eraseStroke,
    updatePanOffset,
    canvasRef,
  } = useStrokesStore((state) => state);

  useEffect(() => {
    options.size = strokeWidth;
    options.end.taper = strokeTaper;
  }, [strokeWidth, strokeTaper]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - panOffset.x) / scale;
    const y = (e.clientY - rect.top - panOffset.y) / scale;

    if (mode === ModeEnum.SCROLL) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    } else {
      setPoints([{ x, y, pressure: e.pressure }]);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (mode === ModeEnum.SCROLL && isPanning) {
      updatePanOffset({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
      return;
    }

    if (e.buttons !== 1) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - panOffset.x) / scale;
      const y = (e.clientY - rect.top - panOffset.y) / scale;
      setPoints((prev) => [...prev, { x, y, pressure: e.pressure }]);
    }
  };

  const handlePointerUp = () => {
    if (mode === ModeEnum.SCROLL) {
      setIsPanning(false);
      return;
    }

    const pointArray = points.map((point) => [
      point.x,
      point.y,
      point.pressure,
    ]);
    const newStrokePath = getSvgPathFromStroke(getStroke(pointArray, options));

    if (mode === ModeEnum.ERASE) {
      const erasePoints = points.map((p) => [p.x, p.y]);
      eraseStroke(erasePoints);
    } else if (mode === ModeEnum.DRAW) {
      addStroke({
        type: "draw",
        path: newStrokePath,
        color: strokeColor,
      });
    }
    setPoints([]);
  };

  const drawStrokesOnCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(panOffset.x, panOffset.y);

    strokes.forEach((stroke) => {
      if (stroke.type === "draw") {
        const path = new Path2D(stroke.path);
        ctx.fillStyle = stroke.color;
        ctx.fill(path);
      } else if (stroke.type === "text") {
        ctx.font = `${stroke.fontSize}px ${stroke.fontFamily}`;
        ctx.fillStyle = stroke.color;
        ctx.textBaseline = "top";
        ctx.fillText(stroke.text!, stroke.position!.x, stroke.position!.y);
      }
    });

    if (points.length > 0 && mode === ModeEnum.DRAW) {
      const path = new Path2D(
        getSvgPathFromStroke(
          getStroke(
            points.map((p) => [p.x, p.y, p.pressure]),
            { size: strokeWidth }
          )
        )
      );
      ctx.fillStyle = strokeColor;
      ctx.fill(path);
    }

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        drawStrokesOnCanvas(ctx);
      }
    }
  }, [strokes, points, panOffset, scale]);

  return {
    canvasRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
};

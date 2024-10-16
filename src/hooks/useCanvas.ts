import { useState, useEffect, useCallback } from "react";
import { Point, ModeEnum, options } from "@/lib/utils";
import { useStrokesStore } from "@/store/strokesStore";
import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from "@/lib/utils";

export const useCanvas = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(
    null
  );

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
    updateScale,
    canvasRef,
  } = useStrokesStore((state) => state);

  useEffect(() => {
    options.size = strokeWidth;
    options.end.taper = strokeTaper;
  }, [strokeWidth, strokeTaper]);

  const getAdjustedCoordinates = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left - panOffset.x) / scale;
      const y = (clientY - rect.top - panOffset.y) / scale;
      return { x, y };
    },
    [canvasRef, panOffset, scale]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const { x, y } = getAdjustedCoordinates(e.clientX, e.clientY);

      if (mode === ModeEnum.SCROLL) {
        setIsPanning(true);
        setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      } else {
        setPoints([{ x, y, pressure: e.pressure }]);
      }
    },
    [mode, panOffset, getAdjustedCoordinates]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (mode === ModeEnum.SCROLL && isPanning) {
        updatePanOffset({
          x: e.clientX - startPan.x,
          y: e.clientY - startPan.y,
        });
        return;
      }

      if (e.buttons !== 1) return;
      const { x, y } = getAdjustedCoordinates(e.clientX, e.clientY);
      setPoints((prev) => [...prev, { x, y, pressure: e.pressure }]);
    },
    [mode, isPanning, startPan, updatePanOffset, getAdjustedCoordinates]
  );

  const handlePointerUp = useCallback(() => {
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
  }, [mode, points, strokeColor, addStroke, eraseStroke]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (e.ctrlKey) {
        // Zooming
        const delta = e.deltaY * -0.01;
        // limit zoom between 50% and 200%
        const minScale = 0.5; // 50%
        const maxScale = 2.0; // 200%
        const newScale = Math.min(Math.max(scale + delta, minScale), maxScale);

        const scaleFactor = newScale / scale;

        const newPanOffset = {
          x: mouseX - (mouseX - panOffset.x) * scaleFactor,
          y: mouseY - (mouseY - panOffset.y) * scaleFactor,
        };

        updateScale(newScale);
        updatePanOffset(newPanOffset);
      } else {
        // Panning
        updatePanOffset({
          x: panOffset.x - e.deltaX,
          y: panOffset.y - e.deltaY,
        });
      }
    },
    [scale, panOffset, updateScale, updatePanOffset, canvasRef]
  );

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      setLastTouchDistance(distance);
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();

      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        // Handle panning
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;

        if (startPan.x !== 0 || startPan.y !== 0) {
          const deltaX = centerX - startPan.x;
          const deltaY = centerY - startPan.y;
          updatePanOffset({
            x: panOffset.x + deltaX,
            y: panOffset.y + deltaY,
          });
        }

        setStartPan({ x: centerX, y: centerY });

        // Handle zooming
        const distance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        if (lastTouchDistance !== null) {
          const delta = (distance - lastTouchDistance) * 0.01;
          const newScale = Math.min(Math.max(scale + delta, 0.1), 5);
          updateScale(newScale);
        }
        setLastTouchDistance(distance);
      }
    },
    [
      startPan,
      panOffset,
      scale,
      lastTouchDistance,
      updatePanOffset,
      updateScale,
    ]
  );

  const handleTouchEnd = useCallback(() => {
    setLastTouchDistance(null);
    setStartPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false });
      canvas.addEventListener("touchstart", handleTouchStart);
      canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
      canvas.addEventListener("touchend", handleTouchEnd);
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener("wheel", handleWheel);
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchmove", handleTouchMove);
        canvas.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [
    canvasRef,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  ]);

  const drawStrokesOnCanvas = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.save();
      ctx.translate(panOffset.x, panOffset.y);
      ctx.scale(scale, scale);

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
    },
    [strokes, points, panOffset, scale, mode, strokeColor, strokeWidth]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        drawStrokesOnCanvas(ctx);
      }
    }
  }, [strokes, points, panOffset, scale, drawStrokesOnCanvas]);

  return {
    canvasRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
};

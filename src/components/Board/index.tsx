"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import { MENU_ITEMS } from "~/constant";
import { useAppDispatch, useAppSelector } from "~/lib/hooks";
import { actionItemClick } from "~/lib/slice/menuSlice";

const Board: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldDraw = useRef<boolean>(false);
  const drawHistory = useRef<[]>([]);
  const historyPointer = useRef<number>(0);

  const dispatch = useAppDispatch();
  const { activeMenuItem, actionMenu } = useAppSelector((state) => state.menu);
  const { color, size } = useAppSelector(
    (state) => state.toolbox[activeMenuItem]
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (actionMenu === MENU_ITEMS.DOWNLOAD) {
      const URL = canvas.toDataURL();
      const anchor = document.createElement("a");
      anchor.href = URL;
      anchor.download = "un_titled.png";
      anchor.click();
    } else if (
      actionMenu === MENU_ITEMS.UNDO ||
      actionMenu === MENU_ITEMS.REDO
    ) {
      if (historyPointer.current > 0 && actionMenu === MENU_ITEMS.UNDO) {
        historyPointer.current -= 1;
      }
      if (
        historyPointer.current < drawHistory.current.length - 1 &&
        actionMenu === MENU_ITEMS.REDO
      ) {
        historyPointer.current += 1;
      }
      const imageData = drawHistory.current[historyPointer.current];
      if (!imageData) return;
      context?.putImageData(imageData, 0, 0);
    }
    dispatch(actionItemClick(null));
  }, [actionMenu]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const changeCanvaConfig = () => {
      context.strokeStyle = color;
      context.lineWidth = size;
    };

    changeCanvaConfig();
  }, [color, size]);

  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const beginPath = (x: number, y: number) => {
      context?.beginPath();
      context?.moveTo(x, y);
    };

    const drawLine = (x: number, y: number) => {
      context?.lineTo(x, y);
      context?.stroke();
    };

    const handleMouseDown = (e: MouseEvent) => {
      shouldDraw.current = true;
      beginPath(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!shouldDraw.current) return;
      drawLine(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      shouldDraw.current = false;
      const imageData = context?.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
      drawHistory.current.push(imageData);
      historyPointer.current = drawHistory.current.length - 1;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default Board;

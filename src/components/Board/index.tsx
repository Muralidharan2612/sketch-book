"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import { MENU_ITEMS } from "~/constant";
import { useAppDispatch, useAppSelector } from "~/lib/hooks";
import { actionItemClick } from "~/lib/slice/menuSlice";
import { changeBrushSize, changeColor, ToolboxState } from "~/lib/slice/toolbarSlice";

import { socket } from "~/socket";

const Board: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldDraw = useRef<boolean>(false);
  const drawHistory = useRef<ImageData[]>([]);
  const historyPointer = useRef<number>(0);

  const dispatch = useAppDispatch();
  const { activeMenuItem, actionMenu } = useAppSelector((state) => state.menu);
  const { color, size } = useAppSelector(
    (state) => state.toolbox[activeMenuItem as keyof ToolboxState]
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

  }, [actionMenu, dispatch]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.connected);

      // console.log('client connected'); // x8WIv7-mJelg7on_ALbx
    });
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");


    const changeCanvasConfig = () => {
      context!.strokeStyle = color;
      context!.lineWidth = size;
    };
    changeCanvasConfig();

    // const imageData = drawHistory.current[drawHistory.current.length - 1];
    // if (!imageData) return;
    // context?.putImageData(imageData, 0, 0);

  }, [color, size]);

  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });

    const coord = { x: 0, y: 0 };
    // let dpi = window.devicePixelRatio;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const imageData = drawHistory.current[drawHistory.current.length - 1];
      if (!imageData) return;
      context!.strokeStyle = color;
      context!.lineWidth = size;
      context?.putImageData(imageData, 0, 0);
      dispatch(actionItemClick(activeMenuItem));
      dispatch(
        changeBrushSize({ item: activeMenuItem, size: size })
      );
      dispatch(changeColor({ item: activeMenuItem, color: color }));
    };

    const reposition = (event: TouchEvent | MouseEvent) => {
      event.preventDefault();

      if (event.type.startsWith("touch")) {
        const touchEvent = event as TouchEvent;
        const touches = touchEvent?.changedTouches;

        for (let index = 0; index < touches.length; index++) {
          coord.x = touches[index].clientX - canvas.offsetLeft;
          coord.y = touches[index].clientY - canvas.offsetTop;
        }
      } else if (event.type.startsWith("mouse")) {
        const mouseEvent = event as MouseEvent;

        coord.x = mouseEvent.clientX - canvas.offsetLeft;
        coord.y = mouseEvent.clientY - canvas.offsetTop;
      }
    };

    const drawLine = (event: TouchEvent | MouseEvent) => {
      if (!shouldDraw.current) return;
      event.preventDefault();

      context!.lineJoin = 'round';
      context!.lineCap = 'round';
      context?.beginPath();
      context?.moveTo(coord.x, coord.y);

      // Update coordinates
      reposition(event);

      context?.closePath();
      context?.lineTo(coord.x, coord.y);
      context?.stroke();
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      shouldDraw.current = true;
      canvas.addEventListener("touchmove", drawLine);
      reposition(e);
    };

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      shouldDraw.current = true;
      canvas.addEventListener("mousemove", drawLine);
      socket.emit('drawLine', e);
      reposition(e);
    };

    const handleTouchEnd = () => {
      shouldDraw.current = false;
      canvas.removeEventListener("touchmove", drawLine);
      const imageData = context?.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
      drawHistory.current.push(imageData as ImageData);
      historyPointer.current = drawHistory.current.length - 1;
    };

    const handleMouseUp = () => {
      shouldDraw.current = false;
      canvas.removeEventListener("mousemove", drawLine);
      const imageData = context?.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
      drawHistory.current.push(imageData as ImageData);
      historyPointer.current = drawHistory.current.length - 1;
    };

    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("resize", resize);



    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default Board;

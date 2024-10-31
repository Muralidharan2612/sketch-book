"use client";

import React, { SyntheticEvent } from "react";
import cx from "classnames";

import styles from "./index.module.css";
import { COLORS, MENU_ITEMS } from "~/constant";

import { useAppDispatch, useAppSelector } from "~/lib/hooks";
import { changeBrushSize, changeColor } from "~/lib/slice/toolbarSlice";

const Toolbox: React.FC = () => {
  const activeMenuItem = useAppSelector((state) => state.menu.activeMenuItem);
  const activeColor = useAppSelector((state) => state.toolbox.PENCIL.color);
  const burshSize = useAppSelector(
    (state) => state.toolbox[activeMenuItem].size
  );

  const dispatch = useAppDispatch();
  const showStrokeToolOption = activeMenuItem === MENU_ITEMS.PENCIL;
  const showBrushToolOption =
    activeMenuItem === MENU_ITEMS.PENCIL ||
    activeMenuItem === MENU_ITEMS.ERASER;

  const updateBrushSize = (e: SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    dispatch(
      changeBrushSize({ item: activeMenuItem, size: Number(target.value) })
    );
  };

  const updateColor = (colorName: string) => {
    dispatch(changeColor({ item: activeMenuItem, color: colorName }));
  };

  return (
    <div className={styles.toolbarContainer}>
      {showStrokeToolOption && (
        <div className={styles.toolItem}>
          <h4 className={styles.toolText}>Stroke Color</h4>
          <div className={styles.itemContainer}>
            <div
              className={cx(styles.colorBox, {
                [styles.active]: activeColor === COLORS.BLACK,
              })}
              style={{ backgroundColor: COLORS.BLACK }}
              onClick={() => {
                updateColor(COLORS.BLACK);
              }}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: activeColor === COLORS.RED,
              })}
              style={{ backgroundColor: COLORS.RED }}
              onClick={() => {
                updateColor(COLORS.RED);
              }}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: activeColor === COLORS.BLUE,
              })}
              style={{ backgroundColor: COLORS.BLUE }}
              onClick={() => {
                updateColor(COLORS.BLUE);
              }}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: activeColor === COLORS.GREEN,
              })}
              style={{ backgroundColor: COLORS.GREEN }}
              onClick={() => {
                updateColor(COLORS.GREEN);
              }}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: activeColor === COLORS.ORANGE,
              })}
              style={{ backgroundColor: COLORS.ORANGE }}
              onClick={() => {
                updateColor(COLORS.ORANGE);
              }}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: activeColor === COLORS.YELLOW,
              })}
              style={{ backgroundColor: COLORS.YELLOW }}
              onClick={() => {
                updateColor(COLORS.BLACK);
              }}
            />
          </div>
        </div>
      )}
      {showBrushToolOption && (
        <div className={styles.toolItem}>
          <h4 className={styles.toolText}>Brush Size</h4>
          <div className={styles.itemContainer}>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={burshSize}
              onChange={updateBrushSize}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbox;

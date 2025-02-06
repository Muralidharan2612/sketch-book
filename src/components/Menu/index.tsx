"use client";

import React from "react";
import cx from "classnames";
import {
  FaPencil,
  FaEraser,
  FaArrowRotateLeft,
  FaArrowRotateRight,
  FaFileArrowDown,
} from "react-icons/fa6";
import styles from "./index.module.css";
import { MENU_ITEMS } from "~/constant";
import { menuItemClick, actionItemClick } from "~/lib/slice/menuSlice";
import { useAppDispatch, useAppSelector } from "~/lib/hooks";

const Menu: React.FC = () => {
  const dispatch = useAppDispatch();

  const activeMenuItem = useAppSelector((state) => state.menu.activeMenuItem);

  const handleMenuItemClick = (menuItem: string) => {
    dispatch(menuItemClick(menuItem));
  };

  const handleMenuActionClick = (menuAction: string) => {
    dispatch(actionItemClick(menuAction));
  };

  return (
    <div className={styles.menuContainer}>
      <div
        className={cx(styles.iconWrapper, {
          [styles.active]: activeMenuItem === MENU_ITEMS.PENCIL,
        })}
        onClick={() => handleMenuItemClick(MENU_ITEMS.PENCIL)}
      >
        <FaPencil className={styles.icon} />
      </div>
      <div
        className={cx(styles.iconWrapper, {
          [styles.active]: activeMenuItem === MENU_ITEMS.ERASER,
        })}
        onClick={() => handleMenuItemClick(MENU_ITEMS.ERASER)}
      >
        <FaEraser className={styles.icon} />
      </div>
      <div
        className={styles.iconWrapper}
        onClick={() => {
          handleMenuActionClick(MENU_ITEMS.UNDO);
        }}
      >
        <FaArrowRotateLeft className={styles.icon} />
      </div>
      <div
        className={styles.iconWrapper}
        onClick={() => {
          handleMenuActionClick(MENU_ITEMS.REDO);
        }}
      >
        <FaArrowRotateRight className={styles.icon} />
      </div>
      <div
        className={styles.iconWrapper}
        onClick={() => {
          handleMenuActionClick(MENU_ITEMS.DOWNLOAD);
        }}
      >
        <FaFileArrowDown className={styles.icon} />
      </div>
    </div>
  );
};

export default Menu;

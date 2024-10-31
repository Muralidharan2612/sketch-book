import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { MENU_ITEMS } from "~/constant";

export interface MenuState {
  activeMenuItem: string;
  actionMenu?: string | null;
}

const initialState: MenuState = {
  activeMenuItem: MENU_ITEMS.PENCIL,
  actionMenu: null,
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    menuItemClick: (state, action: PayloadAction<string>) => {
      state.activeMenuItem = action.payload;
    },
    actionItemClick: (state, action: PayloadAction<string>) => {
      state.actionMenu = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { menuItemClick, actionItemClick } = menuSlice.actions;

export default menuSlice.reducer;

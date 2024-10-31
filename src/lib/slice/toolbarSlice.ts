import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { COLORS, MENU_ITEMS } from "~/constant";

export interface ToolboxItem {
  color: string;
  size: number;
}

export interface ToolboxState {
  [key: string]: ToolboxItem;
}

const initialState: ToolboxState = {
  PENCIL: {
    color: COLORS.BLACK,
    size: 3,
  },
  ERASER: {
    color: COLORS.WHITE,
    size: 3,
  },
  // UNDO: null,
  // REDO: null,
  // DOWNLOAD: null,
};

interface ChangeColorPayload {
  item: keyof ToolboxState;
  color: string;
}

interface ChangeBrushSizePayload {
  item: keyof ToolboxState;
  size: number;
}

export const toolboxSlice = createSlice({
  name: "toolbox",
  initialState,
  reducers: {
    changeColor: (state, action: PayloadAction<ChangeColorPayload>) => {
      const { item, color } = action.payload;
      if (state[item]) {
        // Check if the item exists
        state[item].color = color; // Update the color
      } else {
        console.error(`Item ${item} does not exist in state.`);
      }
    },
    changeBrushSize: (state, action: PayloadAction<ChangeBrushSizePayload>) => {
      const { item, size } = action.payload;
      if (state[item]) {
        // Check if the item exists
        state[item].size = size; // Update the color
      } else {
        console.error(`Item ${item} does not exist in state.`);
      }
    },
  },
});

export const { changeColor, changeBrushSize } = toolboxSlice.actions;

export default toolboxSlice.reducer;

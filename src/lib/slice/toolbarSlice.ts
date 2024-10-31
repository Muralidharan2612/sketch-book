import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { COLORS, MENU_ITEMS } from "~/constant";

type ToolProperty = {
  color: string;
  size: number;
};

export interface ToolboxState {
  [MENU_ITEMS.PENCIL as string]: ToolProperty;
  [MENU_ITEMS.ERASER as string]: ToolProperty;
  [MENU_ITEMS.UNDO as string]?: object | null;
  [MENU_ITEMS.REDO as string]?: object | null;
  [MENU_ITEMS.DOWNLOAD as string]?: object | null;
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
  UNDO: null,
  REDO: null,
  DOWNLOAD: null,
};

interface ChangeColorPayload {
  item: keyof ToolboxState;
  color: string;
}

interface ChangeBrushSizePayload {
  item: keyof ToolboxState;
  size: string;
}

export const toolboxSlice = createSlice({
  name: "toolbox",
  initialState,
  reducers: {
    changeColor: (state, action: PayloadAction<ChangeColorPayload>) => {
      state[action.payload.item].color = action.payload.color;
    },
    changeBrushSize: (state, action: PayloadAction<ChangeBrushSizePayload>) => {
      state[action.payload.item].size = action.payload.size;
    },
  },
});

export const { changeColor, changeBrushSize } = toolboxSlice.actions;

export default toolboxSlice.reducer;

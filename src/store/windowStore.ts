import { create } from "zustand";

export type WindowType = "terminal" | "chat" | "admin" | "project" | "browser";

export interface AppWindowData {
  id: string;
  type: WindowType;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  props?: any;
}

interface WindowStore {
  windows: Record<string, AppWindowData>;
  topZIndex: number;
  activeWindowId: string | null;
  openWindow: (id: string, type: WindowType, title: string, props?: any) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: {},
  topZIndex: 100,
  activeWindowId: null,

  openWindow: (id, type, title, props) => {
    const { windows, topZIndex } = get();
    const newZIndex = topZIndex + 1;

    set({
      windows: {
        ...windows,
        [id]: {
          ...windows[id], // retain existing state if it was minimized
          id,
          type,
          title,
          isOpen: true,
          isMinimized: false,
          isMaximized: windows[id]?.isMaximized || false,
          zIndex: newZIndex,
          props,
        },
      },
      topZIndex: newZIndex,
      activeWindowId: id,
    });
  },

  closeWindow: (id) => {
    set((state) => {
      const newWindows = { ...state.windows };
      delete newWindows[id];
      return {
        windows: newWindows,
        activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
      };
    });
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isMinimized: true },
      },
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  maximizeWindow: (id) => {
    set((state) => {
      const win = state.windows[id];
      if (!win) return state;
      const newZIndex = state.topZIndex + 1;
      
      return {
        windows: {
          ...state.windows,
          [id]: { 
            ...win, 
            isMaximized: !win.isMaximized,
            zIndex: newZIndex 
          },
        },
        topZIndex: newZIndex,
        activeWindowId: id,
      };
    });
  },

  focusWindow: (id) => {
    const win = get().windows[id];
    if (!win) return;
    if (get().activeWindowId === id && !win.isMinimized) return; // Already focused

    const newZIndex = get().topZIndex + 1;
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], zIndex: newZIndex, isMinimized: false },
      },
      topZIndex: newZIndex,
      activeWindowId: id,
    }));
  },
}));

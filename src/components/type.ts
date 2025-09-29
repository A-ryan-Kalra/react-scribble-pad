export interface ToolsRefProps {
  eraser: boolean;
  pickColor: boolean;
  showText: boolean;
  canvasText: boolean;
  lockScroll: boolean;
  moveSticker?: boolean;
  showScreen: boolean;
  adjustFullScreen: boolean;
  eraserSize: string;
}
export interface ToolsProps {
  eraser: boolean;
  pickColor: boolean;
  penSize: boolean;
  canvasText: boolean;
  showScreen: boolean;
  lockScroll: boolean;
  adjustFullScreen: boolean;
}

export interface StickerDetailsProps {
  sticketTextAtom: boolean;
  bgColor: string;
  fontSize: number;
  customizeCursor?: boolean;
  hidePen?: boolean;
  hidePenOnEraser?: boolean;
  rgba: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
}

export interface RangeIndexProps {
  right: string;
  bottom: string;
  value: string;
}

export interface BgColorProps {
  openPalette: boolean;
  color: string;
  rgba: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
}

export interface ScribblePadProps {
  openPad?: boolean;
  setOpenPad: (openPad: boolean) => void;
}

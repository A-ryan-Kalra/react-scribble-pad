export interface ToolsRefProps {
  eraser: boolean;
  pickColor: boolean;
  showText: boolean;
  canvasText: boolean;
  lockScroll: boolean;
  moveSticker?: boolean;
}

export interface ToolsProps {
  eraser: boolean;
  pickColor: boolean;
  penSize: boolean;
  canvasText: boolean;
  showScreen: boolean;
  lockScroll: boolean;
}

export interface StickerDetailsProps {
  sticketTextAtom: boolean;
  bgColor: string;
  fontSize: number;
  customizeCursor?: boolean;
  hidePen?: boolean;
  hidePenOnEraser?: boolean;
}

export interface RangeIndexProps {
  right: string;
  bottom: string;
  value: string;
}

export interface BgColorProps {
  openPalette: boolean;
  color: string;
}

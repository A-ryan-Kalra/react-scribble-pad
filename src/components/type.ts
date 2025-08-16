export interface ToolsRefProps {
  eraser: boolean;
  pickColor: boolean;
  showText: boolean;
  canvasText: boolean;
  moveSticker?: boolean;
}

export interface ToolsProps {
  eraser: boolean;
  pickColor: boolean;
  penSize: boolean;
  canvasText: boolean;
  showScreen: boolean;
}

export interface StickerDetailsProps {
  sticketTextAtom: boolean;
  bgColor: string;
  fontSize: number;
  customizeCursor?: boolean;
  hidePen?: boolean;
}

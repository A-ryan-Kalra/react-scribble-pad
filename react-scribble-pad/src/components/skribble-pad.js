import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import CursorMovement from "./cursor-movement";
import StickerEditor from "./sticker-editor";
import Canvas from "./canvas";
import "./index.css";
function SkribblePad() {
    return (_jsxs("div", { style: {
            height: "100%",
            width: "100%",
            cursor: "none",
            overflow: "hidden",
        }, className: "", children: [_jsx(CursorMovement, {}), _jsx(StickerEditor, {}), _jsx(Canvas, {})] }));
}
export default SkribblePad;

import { jsx as _jsx } from "react/jsx-runtime";
import { Sketch } from "@uiw/react-color";
export default function PickColor({ pick }) {
    return (_jsx(Sketch, { style: {
            position: "absolute",
            bottom: 50,
            left: "-2rem",
        }, onChange: (color) => {
            pick({ ...color.rgba });
        } }));
}

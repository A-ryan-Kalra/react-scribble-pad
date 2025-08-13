import { Sketch } from "@uiw/react-color";

interface PickColorProps {
  pick: (rgba: { r: number; g: number; b: number; a: number }) => void;
}
export default function PickColor({ pick }: PickColorProps) {
  return (
    <Sketch
      style={{ marginLeft: 20, position: "absolute", top: 0, left: "1.75rem" }}
      onChange={(color) => {
        pick({ ...color.rgba });
      }}
    />
  );
}

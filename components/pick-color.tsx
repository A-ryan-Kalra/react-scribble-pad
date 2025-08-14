import { Sketch } from "@uiw/react-color";

interface PickColorProps {
  pick: (rgba: { r: number; g: number; b: number; a: number }) => void;
}
export default function PickColor({ pick }: PickColorProps) {
  return (
    <Sketch
      style={{
        position: "absolute",
        bottom: 50,
        left: "-2rem",
      }}
      onChange={(color) => {
        pick({ ...color.rgba });
      }}
    />
  );
}

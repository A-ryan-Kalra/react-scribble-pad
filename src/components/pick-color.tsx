import { Sketch } from "@uiw/react-color";

interface PickColorProps {
  pick: (rgba: { r: number; g: number; b: number; a: number }) => void;
  position: string;
}
export default function PickColor({ pick, position }: PickColorProps) {
  return (
    <Sketch
      style={{
        position: "absolute",
        bottom: 50,
        left: position,
      }}
      onChange={(color) => {
        pick({ ...color.rgba });
      }}
    />
  );
}

import { Sketch, rgbaToHsva } from "@uiw/react-color";

interface PickColorProps {
  pick: (rgba: { r: number; g: number; b: number; a: number }) => void;
  position: string;
  colorState: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
}
export default function PickColor({
  pick,
  position,
  colorState,
}: PickColorProps) {
  const initialRgba = colorState;
  const initialHsva = rgbaToHsva(initialRgba);

  return (
    <Sketch
      color={initialHsva}
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

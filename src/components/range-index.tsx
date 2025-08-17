import type { RangeIndexProps } from "./type";

function RangeIndex({ left, top, value }: RangeIndexProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        color: "black",
        backgroundColor: "black",
      }}
    >
      {value}
    </div>
  );
}

export default RangeIndex;

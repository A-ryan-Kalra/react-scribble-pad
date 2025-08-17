import type { RangeIndexProps } from "./type";

function RangeIndex({ right, bottom, value }: RangeIndexProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: `${bottom}%`,
        right: `${right}px`,
        color: "black",
        fontSize: "10px",
      }}
    >
      {value}
    </div>
  );
}

export default RangeIndex;

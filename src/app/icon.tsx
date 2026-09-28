import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14120f",
          border: "2px solid #c6a15b",
          color: "#c6a15b",
          fontSize: 28,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
          letterSpacing: "-1px",
        }}
      >
        RH
      </div>
    ),
    { ...size },
  );
}

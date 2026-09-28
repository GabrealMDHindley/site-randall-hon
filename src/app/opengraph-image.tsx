import { ImageResponse } from "next/og";
import { agent } from "@/content/agent";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(ellipse at 30% 20%, #221d15 0%, #14120f 60%)",
          color: "#ede7da",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#c6a15b",
          }}
        >
          {agent.brokerage}
        </div>
        <div style={{ fontSize: 76, marginTop: 24, display: "flex" }}>
          {agent.name}
        </div>
        <div
          style={{
            fontSize: 30,
            marginTop: 24,
            color: "#9c9585",
            display: "flex",
            maxWidth: 900,
          }}
        >
          Houston Real Estate Since {agent.practiceSince}
        </div>
      </div>
    ),
    { ...size },
  );
}

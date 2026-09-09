import { ImageResponse } from "next/og";

export const alt = "TripOne+ — websites built to sell experiences";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: "#041c16",
        color: "white",
        padding: "72px",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 520,
          height: 520,
          borderRadius: 520,
          right: -120,
          top: -180,
          background: "rgba(8,122,90,.42)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 360,
          height: 360,
          borderRadius: 360,
          left: 280,
          bottom: -250,
          background: "rgba(245,166,35,.2)",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f5a623",
              color: "#173028",
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            +
          </div>
          <div style={{ fontSize: 38, fontWeight: 700 }}>TripOne+</div>
        </div>
        <div
          style={{
            maxWidth: 900,
            marginTop: 105,
            fontSize: 76,
            lineHeight: 1.02,
            letterSpacing: "-3px",
            fontWeight: 700,
          }}
        >
          Websites built to sell experiences.
        </div>
        <div style={{ marginTop: 32, fontSize: 26, color: "#a8beb6" }}>
          Tourism-aware structure. Beautiful by default. Ready to grow.
        </div>
      </div>
    </div>,
    size,
  );
}

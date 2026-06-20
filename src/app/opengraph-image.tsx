import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Tarjeta de previsualización (1200×630) para cuando se comparte el enlace
// en WhatsApp, Facebook, LinkedIn, X, Slack, etc.
export const alt = "Pilar Humano — Consultoría RH";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const logo = readFileSync(join(process.cwd(), "public/logo.png")).toString(
    "base64",
  );
  const logoSrc = `data:image/png;base64,${logo}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#f6f4ee",
          color: "#161613",
          padding: "72px 80px",
          fontFamily: "serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={104} height={124} style={{ borderRadius: 10 }} />

        <div style={{ display: "flex", flexDirection: "column", marginTop: 36 }}>
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -1 }}>
            Pilar Humano
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: "#7a766b",
              marginTop: 8,
            }}
          >
            Consultoría RH
          </div>
        </div>

        <div
          style={{
            fontSize: 36,
            color: "#545046",
            marginTop: 34,
            maxWidth: 900,
            lineHeight: 1.3,
          }}
        >
          Encuentra el talento perfecto y potencia tu empresa.
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 16,
            background: "#1f4d44",
          }}
        />
      </div>
    ),
    { ...size },
  );
}

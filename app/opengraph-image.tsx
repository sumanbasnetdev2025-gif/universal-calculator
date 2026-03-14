import { ImageResponse } from "next/og";

export const alt         = "CalcNepal — Smart Calculators for Nepal";
export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0d0d1a 0%, #1a1040 40%, #0d1a2e 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Background grid dots */}
        <div
          style={{
            position: "absolute",
            inset: "0",
            backgroundImage: "radial-gradient(circle, rgba(124,58,237,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            display: "flex",
          }}
        />

        {/* Glow circle */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            display: "flex",
          }}
        />

        {/* Logo row */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "24px",
            marginBottom: "32px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "22px",
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 40px rgba(124,58,237,0.5)",
            }}
          >
            <div style={{ color: "white", fontSize: "52px", fontWeight: 800, display: "flex" }}>
              C
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                color: "white",
                fontSize: "62px",
                fontWeight: 800,
                letterSpacing: "-2px",
                lineHeight: 1,
              }}
            >
              <span style={{ color: "white" }}>Calc</span>
              <span style={{ color: "#a78bfa" }}>Nepal</span>
            </div>
            <div
              style={{
                display: "flex",
                color: "rgba(255,255,255,0.5)",
                fontSize: "20px",
                marginTop: "6px",
              }}
            >
              calcnepal.com
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            color: "white",
            fontSize: "36px",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "16px",
            zIndex: 1,
            letterSpacing: "-0.5px",
          }}
        >
          Smart Calculators Built for Nepal
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            color: "rgba(255,255,255,0.55)",
            fontSize: "22px",
            textAlign: "center",
            maxWidth: "680px",
            lineHeight: 1.6,
            zIndex: 1,
          }}
        >
          BS/AD converter · NEA electricity · EMI · Land units · Salary & tax · Fuel cost
        </div>

        {/* Tool chips */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "44px",
            justifyContent: "center",
            zIndex: 1,
            maxWidth: "900px",
          }}
        >
          {[
            { label: "Date Converter",  color: "#7c3aed" },
            { label: "NEA Electricity", color: "#d97706" },
            { label: "EMI Calculator",  color: "#2563eb" },
            { label: "Land Units",      color: "#0d9488" },
            { label: "Salary & Tax",    color: "#059669" },
            { label: "Fuel Cost",       color: "#dc2626" },
          ].map((t) => (
            <div
              key={t.label}
              style={{
                display: "flex",
                background: `${t.color}25`,
                border: `1.5px solid ${t.color}60`,
                color: "rgba(255,255,255,0.85)",
                borderRadius: "50px",
                padding: "9px 22px",
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              {t.label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
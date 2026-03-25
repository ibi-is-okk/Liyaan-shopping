export default function Logo({ color = "#111" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 0L16 4.5V13.5L9 18L2 13.5V4.5L9 0Z" fill={color} />
        <path d="M9 4L13 6.5V11.5L9 14L5 11.5V6.5L9 4Z" fill="white" opacity="0.4" />
      </svg>
      <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color, letterSpacing: 2 }}>
        LIYAAN
      </span>
    </div>
  );
}

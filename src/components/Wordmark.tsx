import React from "react";
import { C, F } from "../theme";

export const Wordmark: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.27, fontFamily: F.sans }}>
    <svg width={size} height={size} viewBox="0 0 52 52">
      <rect x={2} y={2} width={48} height={48} rx={10} fill={C.ink} />
      <rect x={10} y={12} width={32} height={10} rx={2} fill={C.amber} />
      <rect x={10} y={30} width={14} height={10} rx={2} fill={C.teal} />
      <rect x={28} y={30} width={14} height={10} rx={2} fill="#fff" />
    </svg>
    <span style={{ fontSize: size, fontWeight: 700, color: C.ink, letterSpacing: -0.01 * size }}>HeatOps</span>
  </div>
);

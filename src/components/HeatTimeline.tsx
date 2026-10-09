import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, F, clamp, easeInOut, easeOut } from "../theme";

export type Block = {
  readonly start: number; // decimal hours, e.g. 9.5 = 09:30
  readonly end: number;
  readonly toStart?: number; // optional destination for a shift animation
  readonly toEnd?: number;
};

export type Row = {
  readonly label: string;
  readonly sub: string;
  readonly blocks: readonly Block[];
  readonly tone: "ink" | "teal" | "muted";
  readonly locked?: boolean;
  readonly appearAt: number; // frame
  readonly moveAt?: number; // frame at which blocks move to toStart/toEnd
};

type Props = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly rows: readonly Row[];
  readonly band: { start: number; end: number; appearAt: number; label: string };
  readonly overlapAt: number; // frame when overlap turns red
  readonly axisAt: number;
  readonly startHour?: number;
  readonly endHour?: number;
  readonly rowHeight?: number;
  readonly labelWidth?: number;
  readonly gateLine?: { hour: number; toHour?: number; appearAt: number; moveAt?: number };
};

export const fmtHour = (h: number) => {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

const toneColor = { ink: C.ink, teal: C.teal, muted: "#7C8A90" } as const;

export const HeatTimeline: React.FC<Props> = ({
  x,
  y,
  width,
  rows,
  band,
  overlapAt,
  axisAt,
  startHour = 6,
  endHour = 18,
  rowHeight = 92,
  labelWidth = 300,
  gateLine,
}) => {
  const frame = useCurrentFrame();
  const plotW = width - labelWidth;
  const hx = (h: number) => labelWidth + ((h - startHour) / (endHour - startHour)) * plotW;
  const axisH = 56;
  const totalH = axisH + rows.length * rowHeight;

  const axisReveal = interpolate(frame, [axisAt, axisAt + 24], [0, 1], { ...clamp, easing: easeOut });
  const bandReveal = interpolate(frame, [band.appearAt, band.appearAt + 20], [0, 1], { ...clamp, easing: easeOut });
  const overlap = interpolate(frame, [overlapAt, overlapAt + 14], [0, 1], { ...clamp, easing: easeOut });

  const hours: number[] = [];
  for (let h = startHour; h <= endHour; h += 1) hours.push(h);

  return (
    <div style={{ position: "absolute", left: x, top: y, width, height: totalH, fontFamily: F.sans }}>
      {/* Heat band: grows downward from the axis */}
      <div
        style={{
          position: "absolute",
          left: hx(band.start),
          width: hx(band.end) - hx(band.start),
          top: axisH - 8,
          height: (totalH - axisH + 16) * bandReveal,
          background: C.amberBand,
          borderTop: `4px solid ${C.amber}`,
          opacity: bandReveal,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: hx(band.start),
          width: hx(band.end) - hx(band.start),
          top: -46,
          textAlign: "center",
          color: C.amber,
          fontWeight: 600,
          fontSize: 26,
          opacity: bandReveal,
          translate: `0px ${interpolate(bandReveal, [0, 1], [10, 0])}px`,
        }}
      >
        {band.label}
      </div>

      {/* Axis */}
      {hours.map((h) => {
        const major = h % 3 === 0;
        return (
          <React.Fragment key={h}>
            <div
              style={{
                position: "absolute",
                left: hx(h),
                top: axisH - 6,
                width: 1,
                height: (totalH - axisH + 6) * axisReveal,
                background: major ? "rgba(23,43,53,0.16)" : "rgba(23,43,53,0.07)",
              }}
            />
            {major ? (
              <div
                style={{
                  position: "absolute",
                  left: hx(h) - 50,
                  width: 100,
                  top: 6,
                  textAlign: "center",
                  fontFamily: F.mono,
                  fontSize: 24,
                  color: C.muted,
                  opacity: axisReveal,
                }}
              >
                {fmtHour(h)}
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: labelWidth,
          top: axisH - 6,
          height: 2,
          width: plotW * axisReveal,
          background: C.ink,
        }}
      />

      {gateLine ? <GateLine gate={gateLine} hx={hx} top={axisH - 6} height={totalH - axisH + 6} /> : null}

      {/* Rows */}
      {rows.map((row, i) => {
        const appear = interpolate(frame, [row.appearAt, row.appearAt + 18], [0, 1], { ...clamp, easing: easeOut });
        const move =
          row.moveAt === undefined
            ? 0
            : interpolate(frame, [row.moveAt, row.moveAt + 18], [0, 1], { ...clamp, easing: easeInOut });
        const top = axisH + i * rowHeight + 18;
        const blockH = rowHeight - 36;
        return (
          <React.Fragment key={row.label + i}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: top - 4,
                width: labelWidth - 28,
                opacity: appear,
                translate: `${interpolate(appear, [0, 1], [-14, 0])}px 0px`,
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 600, color: C.ink, lineHeight: 1.1 }}>
                {row.label}
                {row.locked ? <span style={{ color: C.muted, fontWeight: 500, fontSize: 22 }}>  · locked</span> : null}
              </div>
              <div style={{ fontSize: 22, color: C.muted, marginTop: 4 }}>{row.sub}</div>
            </div>
            {row.blocks.map((b, j) => {
              const s = b.toStart === undefined ? b.start : interpolate(move, [0, 1], [b.start, b.toStart]);
              const e = b.toEnd === undefined ? b.end : interpolate(move, [0, 1], [b.end, b.toEnd]);
              const ovS = Math.max(s, band.start);
              const ovE = Math.min(e, band.end);
              const hasOverlap = ovE > ovS;
              const left = hx(s);
              const w = (hx(e) - hx(s)) * appear;
              return (
                <React.Fragment key={j}>
                  <div
                    style={{
                      position: "absolute",
                      left,
                      top,
                      width: w,
                      height: blockH,
                      borderRadius: 6,
                      background: toneColor[row.tone],
                    }}
                  />
                  {hasOverlap ? (
                    <div
                      style={{
                        position: "absolute",
                        left: hx(ovS),
                        top,
                        width: Math.max(0, Math.min(hx(ovE) - hx(ovS), left + w - hx(ovS))),
                        height: blockH,
                        borderRadius: 6,
                        background: `repeating-linear-gradient(135deg, ${C.red} 0 10px, #9E2626 10px 20px)`,
                        opacity: overlap,
                        boxShadow: `0 0 0 3px rgba(184,50,50,${0.25 * overlap})`,
                      }}
                    />
                  ) : null}
                  <div
                    style={{
                      position: "absolute",
                      left: left + 12,
                      top: top + blockH / 2 - 14,
                      fontFamily: F.mono,
                      fontSize: 20,
                      color: "#fff",
                      opacity: appear > 0.95 && w > 150 ? 1 : 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fmtHour(s)}–{fmtHour(e)}
                  </div>
                </React.Fragment>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const GateLine: React.FC<{
  gate: NonNullable<Props["gateLine"]>;
  hx: (h: number) => number;
  top: number;
  height: number;
}> = ({ gate, hx, top, height }) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [gate.appearAt, gate.appearAt + 14], [0, 1], { ...clamp, easing: easeOut });
  const move =
    gate.moveAt === undefined || gate.toHour === undefined
      ? 0
      : interpolate(frame, [gate.moveAt, gate.moveAt + 20], [0, 1], { ...clamp, easing: easeInOut });
  const h = gate.toHour === undefined ? gate.hour : interpolate(move, [0, 1], [gate.hour, gate.toHour]);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: hx(h) - 2,
          top,
          width: 4,
          height: height * appear,
          background: C.teal,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: hx(h) + 10,
          top: top + height - 4,
          fontFamily: F.mono,
          fontWeight: 600,
          fontSize: 22,
          color: C.teal,
          opacity: appear,
          whiteSpace: "nowrap",
        }}
      >
        Gate opens {fmtHour(h)}
      </div>
    </>
  );
};

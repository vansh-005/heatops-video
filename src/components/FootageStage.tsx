import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { getClip } from "../data/manifest";
import { C, F, SAFE, clamp, easeOut } from "../theme";
import { FootageSlot } from "./FootageSlot";
import { Chapter, ScenarioBadge } from "./Labels";

export const PANEL = { x: SAFE, y: 112, w: 1352, h: 760 } as const;
export const COLUMN = { x: PANEL.x + PANEL.w + 40, w: 1920 - SAFE - (PANEL.x + PANEL.w + 40) } as const;

type Props = {
  readonly shotId: string;
  readonly index: string;
  readonly title: string;
  readonly scenario?: boolean; // synthetic-scenario shots keep the badge visible
  readonly children?: React.ReactNode; // right-column callouts
  readonly length: number; // scene length in frames, for the exit fade
};

/** Standard footage scene: chapter, framed footage panel, provenance strip, callout column. */
export const FootageStage: React.FC<Props> = ({ shotId, index, title, scenario = true, children, length }) => {
  const frame = useCurrentFrame();
  const clip = getClip(shotId);
  const ready = clip?.status === "ready";
  const enter = interpolate(frame, [0, 14], [0, 1], { ...clamp, easing: easeOut });
  const exit = interpolate(frame, [length - 8, length], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: C.canvas, opacity: exit }}>
      <Chapter index={index} title={title} />
      <div
        style={{
          position: "absolute",
          left: PANEL.x,
          top: PANEL.y,
          opacity: enter,
          scale: String(interpolate(enter, [0, 1], [0.985, 1])),
        }}
      >
        <FootageSlot shotId={shotId} width={PANEL.w} height={PANEL.h} />
      </div>
      <div
        style={{
          position: "absolute",
          left: PANEL.x,
          top: PANEL.y + PANEL.h + 14,
          width: PANEL.w,
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontFamily: F.mono,
          fontSize: 20,
          color: C.muted,
          opacity: enter,
        }}
      >
        {scenario ? <ScenarioBadge style={{ fontSize: 18, padding: "4px 12px" }} /> : null}
        <span>
          {ready
            ? `${clip?.verified ? "Real capture" : "Capture pending verification"} · run ${clip?.runId ?? "—"} · captured ${clip?.capturedAt ?? "—"}`
            : `Draft placeholder · ${shotId} awaiting real capture`}
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: COLUMN.x,
          top: PANEL.y,
          width: COLUMN.w,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

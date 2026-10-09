import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Wordmark } from "../components/Wordmark";
import { manifest } from "../data/manifest";
import { SCENES } from "../data/timeline";
import { at } from "../data/voice";
import { C, F, clamp, easeOut } from "../theme";

const L = (g: number) => g - SCENES.S10.from;

export const S10Close: React.FC = () => {
  const frame = useCurrentFrame();
  const url = manifest.facts.appUrl;
  const rise = (a: number, d = 16) => interpolate(frame, [a, a + d], [0, 1], { ...clamp, easing: easeOut });
  const brand = rise(L(at("S10", "HeatOps")) - 8, 18);
  const line1 = rise(L(at("S10", "Tomorrow's")) - 4);
  const line2 = rise(L(at("S10", "Tonight's")) - 4);
  const tail = rise(L(at("S10", "plan")) + 10, 20);

  return (
    <AbsoluteFill style={{ background: C.canvas, fontFamily: F.sans, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", translate: "0px -40px" }}>
        <div style={{ opacity: brand, scale: String(interpolate(brand, [0, 1], [0.94, 1])) }}>
          <Wordmark size={76} />
        </div>
        <div style={{ fontFamily: F.serif, fontSize: 92, lineHeight: 1.08, color: C.ink, textAlign: "center", marginTop: 54 }}>
          <div style={{ opacity: line1, translate: `0px ${interpolate(line1, [0, 1], [18, 0])}px` }}>
            Tomorrow's heat forecast.
          </div>
          <div style={{ color: C.teal, opacity: line2, translate: `0px ${interpolate(line2, [0, 1], [18, 0])}px` }}>
            Tonight's action plan.
          </div>
        </div>
        <div style={{ marginTop: 52, fontSize: 30, color: C.muted, opacity: tail, display: "flex", gap: 28, alignItems: "center" }}>
          {url ? <span style={{ fontFamily: F.mono, color: C.ink }}>{url}</span> : null}
          <span>Built on AWS · Amazon Bedrock</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

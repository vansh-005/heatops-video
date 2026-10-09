import manifestJson from "../../asset-manifest.json";

export type Segment = {
  readonly in: number; // source seconds
  readonly out: number;
  readonly rate?: number; // >1 shows an "Accelerated" label
  readonly shortened?: boolean; // shows "Processing time shortened" (a cut follows/precedes)
};

export type Focus = {
  readonly at: number; // seconds into the slot
  readonly x: number; // crop rect in source pixels
  readonly y: number;
  readonly w: number;
  readonly h: number;
};

export type Clip = {
  readonly shotId: string;
  readonly path: string;
  readonly status: "missing" | "ready";
  readonly verified: boolean;
  readonly kind: string;
  readonly runId: string | null;
  readonly capturedAt: string | null;
  readonly sourceInSeconds: number | null;
  readonly sourceOutSeconds: number | null;
  readonly segments?: readonly Segment[];
  readonly focus?: readonly Focus[];
  readonly sourceWidth?: number;
  readonly sourceHeight?: number;
  readonly note?: string;
};

export type Facts = {
  readonly status: string;
  readonly verified: boolean;
  readonly sourceMode: string;
  readonly workers: number;
  readonly baselineFlaggedWorkerHours: number;
  readonly revisedFlaggedWorkerHours: number;
  readonly taskWorkerHours: number;
  readonly reductionPercentDisplay: number;
  readonly appUrl: string | null;
  readonly awsServices?: readonly string[];
};

export type Manifest = {
  readonly mode: "draft" | "final";
  readonly facts: Facts;
  readonly clips: readonly Clip[];
  readonly narration: {
    kind: "tts" | "recorded";
    path: string;
    status: "missing" | "draft" | "ready";
    finalApproved: boolean;
    offsetSeconds?: number;
  };
  readonly music?: { enabled: boolean };
  readonly finalRenderAllowed: boolean;
};

export const manifest = manifestJson as unknown as Manifest;

export const getClip = (shotId: string): Clip | undefined => manifest.clips.find((c) => c.shotId === shotId);

export const clipSegments = (clip: Clip): Segment[] => {
  if (clip.segments && clip.segments.length > 0) return [...clip.segments];
  if (clip.sourceInSeconds !== null && clip.sourceOutSeconds !== null) {
    return [{ in: clip.sourceInSeconds, out: clip.sourceOutSeconds }];
  }
  return [];
};

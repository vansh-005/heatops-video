import "./fonts";
import { Composition, Folder, Freeze, Still } from "remotion";
import { HeatOpsDemo, heatOpsSchema } from "./HeatOpsDemo";
import { ModeProvider, RenderMode } from "./data/mode";
import { Act1Problem } from "./scenes/Act1Problem";
import { S10Close } from "./scenes/S10Close";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HeatOpsDemo"
        component={HeatOpsDemo}
        schema={heatOpsSchema}
        durationInFrames={5100}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ mode: "draft" as const }}
      />
      <Still
        id="HeatOpsPoster"
        component={Poster}
        schema={heatOpsSchema}
        width={1920}
        height={1080}
        defaultProps={{ mode: "draft" as const }}
      />
      <Folder name="Scenes">
        <Composition id="S01-Problem" component={Act1Problem} durationInFrames={660} fps={30} width={1920} height={1080} />
      </Folder>
    </>
  );
};

// Poster: the closing card, frozen once fully revealed, without burned-in captions.
const Poster: React.FC<{ mode: RenderMode }> = ({ mode }) => (
  <ModeProvider mode={mode}>
    <Freeze frame={200}>
      <S10Close />
    </Freeze>
  </ModeProvider>
);

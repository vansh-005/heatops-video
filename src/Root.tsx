import "./fonts";
import { Composition, Folder, Freeze, Still } from "remotion";
import { HeatOpsDemo, heatOpsSchema } from "./HeatOpsDemo";
import { ModeProvider, RenderMode } from "./data/mode";
import { S01Hook } from "./scenes/S01Hook";
import { S04TurningPoint } from "./scenes/S04TurningPoint";
import { S08Architecture } from "./scenes/S08Architecture";
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
        <Composition id="S01-Hook" component={S01Hook} durationInFrames={360} fps={30} width={1920} height={1080} />
        <Composition
          id="S04-TurningPoint"
          component={S04TurningPoint}
          durationInFrames={900}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="S08-Architecture"
          component={S08Architecture}
          durationInFrames={420}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition id="S10-Close" component={S10Close} durationInFrames={300} fps={30} width={1920} height={1080} />
      </Folder>
    </>
  );
};

// Poster: the closing card, frozen once fully revealed, without burned-in captions.
const Poster: React.FC<{ mode: RenderMode }> = ({ mode }) => (
  <ModeProvider mode={mode}>
    <Freeze frame={220}>
      <S10Close />
    </Freeze>
  </ModeProvider>
);

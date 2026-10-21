import { registerRoot, Composition } from 'remotion';
import { EqualityPropertyVisualization, TriangleComposition } from './TriangleComposition';

registerRoot(() => {
  return (
    <>
      <Composition
        id="EqualityPropertyComposition"
        component={EqualityPropertyVisualization}
        durationInFrames={240}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="TriangleComposition"
        component={TriangleComposition}
        durationInFrames={120}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
});
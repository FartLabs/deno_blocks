import { useEffect, useRef } from "preact/hooks";
import {
  denoBlockly,
  type DenoBlocklyOptions,
} from "#/lib/blockly/examples/deno_blockly/mod.ts";

export type DenoBlocksIDEIslandProps = Pick<
  DenoBlocklyOptions,
  "getInitialWorkspace" | "onWorkspaceChange"
>;

export default function DenoBlocksIDEIsland(props: DenoBlocksIDEIslandProps) {
  const blocklyRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!blocklyRef.current || !codeRef.current) {
      return;
    }

    denoBlockly({
      blocklyElement: blocklyRef.current,
      codeElement: codeRef.current,
      getInitialWorkspace: props.getInitialWorkspace,
      onWorkspaceChange: props.onWorkspaceChange,
    });
  }, [blocklyRef, codeRef]);

  return (
    <div className="container">
      <div className="blockly" ref={blocklyRef} />
      <div className="output-pane">
        <pre className="generated-code"><code ref={codeRef}/></pre>
        <div className="output" />
      </div>
    </div>
  );
}

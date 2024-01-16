import { useEffect, useRef } from "preact/hooks";
import {
  denoBlockly,
  type DenoBlocklyOptions,
} from "#/lib/blockly/examples/deno_blockly/mod.ts";
import DenoBlocksIcon from "#/components/deno_blocks_icon.tsx";

export interface DenoBlocksIDEIslandProps extends
  Pick<
    DenoBlocklyOptions,
    "getInitialWorkspace" | "onWorkspaceChange"
  > {
  projects?: {
    id: string;
    name: string;
  }[];
}

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
    <>
      <nav>
        <DenoBlocksIcon />

        <div id="project-selector">
          <select id="project-list">
            {props.projects?.map((p) => <option value={p.id}>{p.name}</option>)}
          </select>
          <form action="/project" method="POST">
            <button type="submit" id="new-project">
              Generate New Project
            </button>
          </form>
        </div>
      </nav>
      <main>
        <div className="container">
          <div className="blockly" ref={blocklyRef} />
          <div className="output-pane">
            <pre className="generated-code"><code ref={codeRef}/></pre>
            <div className="output" />
          </div>
        </div>
      </main>
    </>
  );
}

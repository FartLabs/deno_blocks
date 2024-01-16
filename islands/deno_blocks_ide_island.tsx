import { useEffect, useRef } from "preact/hooks";
import { denoBlockly } from "#/lib/blockly/examples/deno_blockly/mod.ts";
import DenoBlocksIcon from "#/components/deno_blocks_icon.tsx";
import { type SubhostingAPIProject } from "#/lib/subhosting_api/mod.ts";

export default function DenoBlocksIDEIsland() {
  const blocklyRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLElement>(null);

  // TODO: Load workspace from Deno KV by session ID. Listen for server-sent
  // events to update the workspace.
  // https://github.com/denoland/showcase_todo/blob/main/islands/TodoListView.tsx#L41
  //
  // TODO: Load projects from Deno KV by session ID.
  // https://github.com/denoland/subhosting_ide_starter/blob/main/main.tsx
  //

  const projects: SubhostingAPIProject[] = [];

  useEffect(() => {
    if (!blocklyRef.current) {
      throw new Error("blocklyRef.current is null");
    }

    if (!codeRef.current) {
      throw new Error("codeRef.current is null");
    }

    denoBlockly({
      blocklyElement: blocklyRef.current,
      codeElement: codeRef.current,
    });
  }, [blocklyRef, codeRef]);

  return (
    <>
      <nav>
        {
          /* TODO: Project selector should be a modal dialog. Add a focus trap.
        https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal#opening_a_modal_dialog */
        }
        <DenoBlocksIcon />

        <div id="project-selector">
          {projects.length > 0
            ? (
              <select id="project-list">
                {projects?.map((p) => <option value={p.id}>{p.name}</option>)}
              </select>
            )
            : null}
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

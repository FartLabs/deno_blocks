import { useEffect, useRef } from "preact/hooks";
import { denoBlockly } from "#/lib/blockly/examples/deno_blockly/mod.ts";
import DenoBlocksIcon from "#/components/deno_blocks_icon.tsx";
import type { SubhostingAPIProject } from "#/lib/subhosting_api/mod.ts";

export default function DenoBlocksIDEIsland() {
  const blocklyRef = useRef<HTMLDivElement>(null);
  const outputPanelRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLElement>(null);

  // TODO: Load workspace from Deno KV by session ID. Listen for server-sent
  // events to update the workspace.
  // https://github.com/denoland/showcase_todo/blob/main/islands/TodoListView.tsx#L41
  //
  // TODO: Load projects from Deno KV by session ID.
  // https://github.com/denoland/subhosting_ide_starter/blob/main/main.tsx
  //

  const projects: SubhostingAPIProject[] = [];

  function handleIconClick() {
    const dialogElement = document.querySelector<HTMLDialogElement>(
      "dialog.menu",
    );
    if (!dialogElement) {
      throw new Error("dialog.menu not found");
    }

    dialogElement.showModal();
  }

  useEffect(() => {
    if (!blocklyRef.current) {
      throw new Error("blocklyRef.current is null");
    }

    if (!codeRef.current) {
      throw new Error("codeRef.current is null");
    }

    // Test.
    codeRef.current.innerText = "console.log('Hello, world!');";

    // Set up Deno Blockly.
    denoBlockly({
      blocklyElement: blocklyRef.current,
      codeElement: codeRef.current,
    });
  }, [blocklyRef, codeRef]);

  return (
    <>
      <nav>
        <div
          class="icon-container"
          role="button"
          tabIndex={0}
          autoFocus={true}
          onClick={handleIconClick}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleIconClick();
            }
          }}
        >
          <DenoBlocksIcon />
        </div>
      </nav>

      <dialog class="menu">
        <form method="dialog">
          <h2>Deno Blocks</h2>
          <p>
            <label for="menu-project-input">Project:</label>
            <select name="menu-project-input">
              <option></option>
              {projects.map((project) => (
                <option value={project.id}>{project.name}</option>
              ))}
              {/* Test Data: */}
              <option>Brine shrimp</option>
              <option>Red panda</option>
              <option>Spider monkey</option>
            </select>
          </p>
          <div>
            {/* <button class="menu-create-button">Create new project</button> */}
            <button
              class="menu-close-button"
              type="submit"
            >
              Close
            </button>
          </div>
        </form>

        {
          /* TODO:
        Sign in/out
        Update dependencies
        Deploy project
        Select project
        Delete project
        Fork to edit/run
        Import library
        Share project */
        }
      </dialog>

      <main>
        {/* TODO: Define panels */}
        <div class="panel-container">
          <div class="blockly-panel">
            <div class="blockly" ref={blocklyRef} />
          </div>

          <div class="output-panel" ref={outputPanelRef}>
            <pre class="generated-code"><code ref={codeRef}/></pre>
            <output class="output" />
          </div>
        </div>
      </main>
    </>
  );
}

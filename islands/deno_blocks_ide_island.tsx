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

  function handleDeploymentChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const deploymentId = selectElement.value;
    if (!deploymentId) {
      return;
    }

    const iframeElement = outputPanelRef.current?.querySelector("iframe");
    if (!iframeElement) {
      return;
    }

    iframeElement.src = `https://${deploymentId}.deno.dev`;
  }

  function handleRefreshIframeButtonClick() {
    const iframeElement = outputPanelRef.current?.querySelector("iframe");
    if (!iframeElement?.contentWindow) {
      return;
    }

    iframeElement.contentWindow.location.href = iframeElement.src;
  }

  useEffect(() => {
    if (!blocklyRef.current) {
      throw new Error("blocklyRef.current is null");
    }

    if (!codeRef.current) {
      throw new Error("codeRef.current is null");
    }

    // Set up Deno Blockly.
    denoBlockly({
      blocklyElement: blocklyRef.current,
      codeElement: codeRef.current,
    });
  }, [denoBlockly, blocklyRef, codeRef]);

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
          <DenoBlocksIcon size="52px" />
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

      <noscript>
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000; background-color: white; height: 100vh; width: 100vw;">
          <p style="color: red; font-weight: bold; text-align: center; height: 100vh; display: flex; align-items: center; justify-content: center;">
            The Deno Blocks IDE requires JavaScript.<br />Please enable
            JavaScript in your browser and reload the page.
          </p>
        </div>
      </noscript>

      <main>
        <div class="panel-container">
          <div class="blockly-panel">
            <div class="blockly" ref={blocklyRef} />
          </div>

          <div class="output-panel" ref={outputPanelRef}>
            <details open>
              <summary>Generated code</summary>

              <pre class="generated-code"><code ref={codeRef}/></pre>
            </details>
            <details>
              <summary>Deployments</summary>
              <select onChange={handleDeploymentChange}>
                <option />
              </select>
              <button
                style="color: black;"
                onClick={handleRefreshIframeButtonClick}
              >
                Refresh
              </button>
              <br />
              <iframe
                style="width: 100%; height: 50vh;"
                src="http://example.com/"
              />
            </details>
            {/* TODO: Display section for defining environment variables. */}
            {/* TODO: Display reloadable iframe of selectable deployment URL. */}
          </div>
        </div>
      </main>
    </>
  );
}

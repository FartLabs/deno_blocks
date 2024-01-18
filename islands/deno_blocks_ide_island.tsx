import { useEffect, useRef, useState } from "preact/hooks";
import { default as Blockly } from "blockly";
import { denoBlockly } from "#/lib/blockly/examples/deno_blockly/mod.ts";
import DenoBlocksIcon from "#/components/deno_blocks_icon.tsx";
import type { DenoBlocksUser } from "#/lib/deno_blocks_kv/mod.ts";
import type {
  SubhostingAPIDeployment,
  SubhostingAPIProject,
} from "#/lib/subhosting_api/mod.ts";

export interface DenoBlocksIDEIslandProps {
  user: DenoBlocksUser;
  project: SubhostingAPIProject;
  stringifiedWorkspace: string | null;
}

export default function DenoBlocksIDEIsland(props: DenoBlocksIDEIslandProps) {
  const blocklyRef = useRef<HTMLDivElement>(null);
  const outputPanelRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLElement>(null);
  const [deploymentDomain, setDeploymentDomain] = useState<string>("");

  // TODO: Load workspace from Deno Kv by session ID. Listen for server-sent
  // events to update the workspace.
  // https://github.com/denoland/showcase_todo/blob/main/islands/TodoListView.tsx#L41
  //
  // TODO: Load projects from Deno Kv by session ID.
  // https://github.com/denoland/subhosting_ide_starter/blob/main/main.tsx
  //

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
    const deployedDomain = selectElement.value;
    if (!deployedDomain) {
      alert("Cannot load a failed deployment.");
      return;
    }

    // Only successful deployments have a domain.
    const iframeElement = outputPanelRef.current?.querySelector<
      HTMLIFrameElement
    >("iframe.deployments-iframe");
    if (!iframeElement) {
      return;
    }

    iframeElement.src = `https://${deployedDomain}`;
    setDeploymentDomain(deployedDomain);
  }

  function handleProjectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const projectID = selectElement.value;
    if (!projectID) {
      return;
    }

    window.location.href = `/projects/${projectID}`;
  }

  function handleRefreshIframeButtonClick() {
    const iframeElement = outputPanelRef.current?.querySelector<
      HTMLIFrameElement
    >(
      "iframe.deployments-iframe",
    );
    if (!iframeElement?.contentWindow) {
      return;
    }

    if (iframeElement && iframeElement.contentWindow) {
      const inputElement = outputPanelRef.current?.querySelector<
        HTMLInputElement
      >("input.deployments-address-input");
      if (!inputElement) {
        return;
      }

      const destination = iframeElement.src +
        inputElement.value;
      iframeElement.contentWindow.location.href = destination;
    }
  }

  function handleDeployButtonClick() {
    const code = codeRef.current?.innerText;
    fetch(
      `/api/projects/${props.project.id}/deployments`,
      {
        method: "POST",
        body: JSON.stringify({
          code,
          // TODO: Add input for env vars.
          envVars: {},
        }),
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to deploy project: ${response.status} ${response.statusText}`,
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function pollUpdateDeployments() {
    function updateDeployments() {
      fetch(
        `/api/projects/${props.project.id}/deployments`,
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to get deployments: ${response.status} ${response.statusText}`,
            );
          }

          return response.json();
        })
        .then((deployments: SubhostingAPIDeployment[]) => {
          const selectElement = document.querySelector<HTMLSelectElement>(
            "select.deployments",
          );
          const selectElementValue = selectElement?.value;
          if (selectElement) {
            selectElement.innerHTML = "";
            deployments.forEach((deployment) => {
              const optionElement = document.createElement("option");
              optionElement.value = deployment.domains?.[0] ?? "";
              optionElement.innerText =
                `${deployment.id} (${deployment.status})`;
              selectElement.appendChild(optionElement);
            });

            // Restore the selected deployment.
            if (selectElementValue) {
              selectElement.value = selectElementValue;

              // Update the deployment domain.
              if (selectElement.value !== deploymentDomain) {
                setDeploymentDomain(selectElement.value);

                // Update the iframe.
                const iframeElement = outputPanelRef.current?.querySelector<
                  HTMLIFrameElement
                >("iframe.deployments-iframe");
                const destination = `https://${selectElement.value}`;
                if (iframeElement && iframeElement.src !== destination) {
                  console.log(`Updating iframe to ${destination}`); // TODO: Fix polling.
                  iframeElement.src = destination;
                }
              }
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }

    updateDeployments();
    setInterval(() => {
      updateDeployments();
    }, 3e3);
  }

  function handleDeleteProjectButtonClick() {
    const confirmed = confirm(
      `Are you sure you want to delete project "${props.project.name}"?`,
    );
    if (!confirmed) {
      return;
    }

    fetch(`/api/projects/${props.project.id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to delete project: ${response.status} ${response.statusText}`,
          );
        }

        window.location.href = "/recent";
      });
  }

  function handleCreateProjectButtonClick() {
    window.location.href = "/new";
  }

  useEffect(
    () => {
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
        getInitialWorkspace: () => {
          return JSON.parse(props.stringifiedWorkspace ?? "null");
        },
        onWorkspaceChange: (workspace) => {
          fetch(`/api/projects/${props.project.id}/workspace`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
              Blockly.serialization.workspaces.save(workspace),
            ),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Failed to save workspace: ${response.status} ${response.statusText}`,
                );
              }
            });
        },
      });

      // Set timeout to update deployments list.
      pollUpdateDeployments();
    },
    [denoBlockly, blocklyRef, codeRef],
  );

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
            <label for="menu-project-input">Select project:</label>
            <br />
            <select
              name="menu-project-input"
              onChange={handleProjectChange}
              value={props.project.id}
            >
              {props.user.projects.length === 0
                ? <option value="">No projects</option>
                : props.user.projects.map((project) => (
                  <option value={project.id}>{project.name}</option>
                ))}
            </select>
            <hr />
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/docs">Documentation</a>
              </li>
              <li>
                <a href="/github">GitHub repository</a>
              </li>
              <li>
                <a
                  href="/signout"
                  title="Sign out"
                  aria-label="Sign out"
                  onClick={(event) => {
                    event.preventDefault();
                    window.location.href = "/signout";
                  }}
                >
                  Sign out
                </a>
              </li>
            </ul>
            <hr />
            <button
              class="menu-create-button"
              aria-label="Create new project"
              title="Create new project"
              onClick={handleCreateProjectButtonClick}
            >
              Create new project
            </button>
            <hr />
            <button
              class="menu-deploy-button"
              aria-label="Deploy project"
              title="Deploy project"
              onClick={handleDeployButtonClick}
            >
              Deploy
            </button>
            <hr />
            <button
              class="menu-delete-project-button"
              aria-label="Delete project"
              title="Delete project"
              onClick={handleDeleteProjectButtonClick}
            >
              Delete project
            </button>
            <hr />
            <button
              class="menu-close-button"
              type="submit"
            >
              Close
            </button>
          </p>
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
        Share project
        Delete project */
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
            <details open>
              <summary>Deployments</summary>
              <select
                onChange={handleDeploymentChange}
                class="deployments"
                value={deploymentDomain}
              >
              </select>
              <br />
              <span
                style="width: 100%; border-radius: 4px; padding: 0.5rem; background-color: #eee;"
                class="deployments-address"
              >
                <input type="text" value={deploymentDomain} readonly />
                <input
                  class="deployments-address-input"
                  type="text"
                  placeholder="/path/to/endpoint"
                />{" "}
                <button
                  style="color: black;"
                  onClick={handleRefreshIframeButtonClick}
                >
                  Refresh
                </button>
              </span>
              <br />
              <iframe
                style="width: 100%; height: 50vh;"
                class="deployments-iframe"
              />
            </details>
            {/* TODO: Display section for defining environment variables. */}
          </div>
        </div>
      </main>
    </>
  );
}

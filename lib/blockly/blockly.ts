import { default as Blockly } from "blockly";

export interface BlocklyOptions extends Blockly.BlocklyOptions {
  blocklyElement: HTMLDivElement;
  codeElement?: HTMLElement;
  // deno-lint-ignore no-explicit-any
  blocks: any[];
  name: string;
  generator: (g: Blockly.CodeGenerator) => void;
  getInitialWorkspace?: () => Blockly.Workspace | undefined;
  onWorkspaceChange?: (workspace: Blockly.Workspace) => void;
}

/**
 * setWorkspace saves the state of the workspace to browser's local storage.
 */
export function setWorkspace(storageKey: string, workspace: Blockly.Workspace) {
  const data = Blockly.serialization.workspaces.save(workspace);
  window.localStorage?.setItem(storageKey, JSON.stringify(data));
}

/**
 * getWorkspace loads saved state from local storage into the given workspace.
 */
export function getWorkspace(
  storageKey: string,
): Blockly.Workspace | undefined {
  if (!storageKey) {
    return;
  }

  const data = window.localStorage?.getItem(storageKey);
  if (!data) {
    return;
  }

  return JSON.parse(data) as Blockly.Workspace;
}

/**
 * @see
 * https://github.com/google/blockly-samples/blob/master/examples/custom-generator-codelab/src/index.js
 */
export function blockly(options: BlocklyOptions) {
  // Reference: https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks
  const blocks = Blockly.common.createBlockDefinitionsFromJsonArray(
    options.blocks,
  );

  const generator = new Blockly.Generator(options.name);
  options.generator(generator);

  // Register the blocks with Blockly.
  Blockly.common.defineBlocks(blocks);

  // Inject Blockly.
  const workspace = Blockly.inject(
    options.blocklyElement,
    { ...options },
  );

  // Generate code.
  function updateCode() {
    if (!options.codeElement) {
      return;
    }

    const code = generator.workspaceToCode(workspace);
    options.codeElement.textContent = code;
  }

  if (options.getInitialWorkspace) {
    const initialWorkspace = options.getInitialWorkspace();

    if (initialWorkspace) {
      // Don't emit events during loading.
      Blockly.Events.disable();
      Blockly.serialization.workspaces.load(
        initialWorkspace,
        workspace,
        { recordUndo: false },
      );
      Blockly.Events.enable();
    }
  }

  // Every time the workspace changes state, save the changes to storage.
  workspace.addChangeListener((event) => {
    // UI events are things like scrolling, zooming, etc.
    // No need to save after one of these.
    if (event.isUiEvent) {
      return;
    }

    // TODO: Add debounce.

    if (options.onWorkspaceChange) {
      options.onWorkspaceChange(workspace);
    }
  });

  if (options.codeElement) {
    // Whenever the workspace changes meaningfully, run the code again.
    workspace.addChangeListener((event) => {
      // Don't run the code when the workspace finishes loading; we're
      // already running it once when the application starts.
      // Don't run the code during drags; we might have invalid state.
      if (
        event.isUiEvent ||
        event.type == Blockly.Events.FINISHED_LOADING ||
        workspace.isDragging()
      ) {
        return;
      }

      // TODO: Add debounce.

      updateCode();
    });
  }

  updateCode();
}

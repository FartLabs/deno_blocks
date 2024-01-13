import { default as Blockly } from "blockly";
import { storageKey } from "./storage_key.ts";
import { toolbox } from "./toolbox.ts";

interface SetupOptions {
  blockly: HTMLDivElement;
  code: HTMLElement;
}

/**
 * @see
 * https://github.com/google/blockly-samples/blob/master/examples/custom-generator-codelab/src/index.js
 */
export function setup(options: SetupOptions) {
  // TODO: Replace JSON definitions with TypeScript definitions.
  // Reference: https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks
  const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([{
    type: "object",
    message0: "{ %1 %2 }",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "input_statement",
        name: "MEMBERS",
      },
    ],
    output: null,
    colour: 230,
  }, {
    type: "member",
    message0: "%1 %2 %3",
    args0: [
      {
        type: "field_input",
        name: "MEMBER_NAME",
        text: "",
      },
      {
        type: "field_label",
        name: "COLON",
        text: ":",
      },
      {
        type: "input_value",
        name: "MEMBER_VALUE",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
  }]);

  /**
   * saveWorkspace saves the state of the workspace to browser's local storage.
   */
  function saveWorkspace(workspace: Blockly.Workspace) {
    const data = Blockly.serialization.workspaces.save(workspace);
    window.localStorage?.setItem(storageKey, JSON.stringify(data));
  }

  /**
   * loadWorkspace loads saved state from local storage into the given workspace.
   */
  function loadWorkspace(workspace: Blockly.Workspace) {
    const data = window.localStorage?.getItem(storageKey);
    if (!data) return;

    // Don't emit events during loading.
    Blockly.Events.disable();
    Blockly.serialization.workspaces.load(
      JSON.parse(data),
      workspace,
      { recordUndo: false },
    );
    Blockly.Events.enable();
  }

  const typescriptGenerator = new Blockly.Generator("TypeScript");

  // Register the blocks with Blockly.
  Blockly.common.defineBlocks(blocks);

  // TODO:
  // https://blocklycodelabs.dev/codelabs/custom-generator/index.html?index=..%2F..index#3

  // Inject Blockly.
  const workspace = Blockly.inject(options.blockly, { toolbox });

  // Generate code.
  function updateCode() {
    if (!options.code) {
      return;
    }

    const code = typescriptGenerator.workspaceToCode(workspace);
    options.code.textContent = code;
  }

  loadWorkspace(workspace);
  updateCode();

  // Every time the workspace changes state, save the changes to storage.
  workspace.addChangeListener((event) => {
    // UI events are things like scrolling, zooming, etc.
    // No need to save after one of these.
    if (event.isUiEvent) {
      return;
    }

    saveWorkspace(workspace);
  });

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

    updateCode();
  });
}

import { default as Blockly } from "blockly";
import { storageKey } from "./storage_key.ts";
import { toolbox } from "./toolbox.ts";

interface SetupOptions {
  blockly: HTMLDivElement;
  code: HTMLElement;
}

enum Order {
  ATOMIC,
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

  typescriptGenerator.forBlock["logic_null"] = () => {
    return ["null", Order.ATOMIC];
  };

  typescriptGenerator.forBlock["text"] = (block) => {
    const textValue = block.getFieldValue("TEXT");
    const code = `"${textValue}"`;
    return [code, Order.ATOMIC];
  };

  typescriptGenerator.forBlock["math_number"] = (block) => {
    const code = String(block.getFieldValue("NUM"));
    return [code, Order.ATOMIC];
  };

  typescriptGenerator.forBlock["logic_boolean"] = (block) => {
    const code = (block.getFieldValue("BOOL") === "TRUE") ? "true" : "false";
    return [code, Order.ATOMIC];
  };

  typescriptGenerator.forBlock["member"] = (block, generator) => {
    const name = block.getFieldValue("MEMBER_NAME");
    const value = generator.valueToCode(
      block,
      "MEMBER_VALUE",
      Order.ATOMIC,
    );
    const code = `"${name}": ${value}`;
    return code;
  };

  typescriptGenerator.forBlock["lists_create_with"] = (block, generator) => {
    const values = [];
    const itemCount = (block as unknown as { itemCount_: number }).itemCount_;
    for (let i = 0; i < itemCount; i++) {
      const valueCode = generator.valueToCode(block, "ADD" + i, Order.ATOMIC);
      if (valueCode) {
        values.push(valueCode);
      }
    }

    const valueString = values.join(",\n");
    const indentedValueString = generator.prefixLines(
      valueString,
      generator.INDENT,
    );
    const codeString = "[\n" + indentedValueString + "\n]";
    return [codeString, Order.ATOMIC];
  };

  typescriptGenerator.forBlock["object"] = (block, generator) => {
    const statementMembers = generator.statementToCode(block, "MEMBERS");
    const code = "{\n" + statementMembers + "\n}";
    return [code, Order.ATOMIC];
  };

  (typescriptGenerator as (typeof typescriptGenerator & {
    scrub_: typeof typescriptGenerator["scrub_"];
  })).scrub_ = (
    block,
    code,
    thisOnly,
  ) => {
    const nextBlock = block.nextConnection &&
      block.nextConnection.targetBlock();
    if (nextBlock && !thisOnly) {
      return code + ",\n" + typescriptGenerator.blockToCode(nextBlock);
    }

    return code;
  };

  // Register the blocks with Blockly.
  Blockly.common.defineBlocks(blocks);

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

    // TODO: Add debounce.

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

    // TODO: Add debounce.

    updateCode();
  });
}

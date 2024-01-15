import { default as Blockly } from "blockly";
import { blockly, type BlocklyOptions } from "#/lib/blockly/mod.ts";
import { storageKey } from "./storage_key.ts";

const TOOLBOX: Blockly.utils.toolbox.ToolboxDefinition = {
  // TODO: Add categories.
  // https://developers.google.com/blockly/guides/configure/web/toolbox#categories
  "kind": "flyoutToolbox",
  "contents": [
    {
      "kind": "block",
      "type": "on_http_request_event",
    },
    {
      "kind": "block",
      "type": "routed_http_request_event_handler",
    },
    {
      "kind": "block",
      "type": "http_request_event_handler",
    },
    {
      "kind": "block",
      "type": "on_cron_schedule_event",
    },
    // {
    //   "kind": "block",
    //   "type": "on_kv_queue_message_event",
    // },
    // {
    //   "kind": "block",
    //   "type": "on_kv_watch_event",
    // },
    // {
    //   "kind": "block",
    //   "type": "import_all_as",
    // },
    // {
    //   "kind": "block",
    //   "type": "import_as",
    // },
    // {
    //   "kind": "block",
    //   "type": "http_request_handler",
    // },
    // {
    //   "kind": "block",
    //   "type": "kv_definition",
    // },
    // {
    //   "kind": "block",
    //   "type": "function_definition",
    // },
    // {
    //   "kind": "block",
    //   "type": "function_call",
    // },
  ],
};

const BLOCKS = [
  // TODO: Create kv watch event block.
  // TODO: Create kv queue message event block.
  // TODO: Create cron schedule event block.
  // TODO: Create function definition block.
  // TODO: Create call function block with drop down containing function names.
  // TODO: Create import block.
  // TODO: Create global variable assignment block.
  // TODO: Create kv definition block.
  // TODO: Create HTTP request handler block.
  // TODO: Deploy button.
  {
    type: "on_http_request_event",
    message0: "on http request %1 %2",
    // message0: "async function handle(r: Request) {\n %1 \n}",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "input_statement",
        name: "MEMBERS",
      },
    ],
    colour: 230,
  },
  {
    type: "http_request_event_handler",
    message0: "return await (async (request: Request) => {\n %1 \n})(request);",
    args0: [
      {
        type: "field_multilinetext",
        name: "CODE",
        text: "return new Response('Hello, world!');",
        spellcheck: false,
      },
    ],
    colour: 230,
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "routed_http_request_event_handler",
    colour: 230,
    message0: "method: %1 path: %2 %3 %4",
    args0: [
      {
        type: "field_dropdown",
        name: "METHOD",
        options: [
          ["GET", "GET"],
          ["POST", "POST"],
          ["PUT", "PUT"],
          ["PATCH", "PATCH"],
          ["DELETE", "DELETE"],
          ["OPTIONS", "OPTIONS"],
          ["HEAD", "HEAD"],
        ],
      },
      {
        type: "field_input",
        name: "PATH",
        text: "/",
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_statement",
        name: "MEMBERS",
      },
    ],
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "on_cron_schedule_event",
    message0: "on cron schedule %1 %2",
    args0: [
      {
        type: "field_input",
        name: "CRON_SCHEDULE",
        text: "* * * * *",
      },
      {
        type: "input_statement",
        name: "CODE",
      },
    ],
  },
  // {
  //   type: "function_definition",
  //   message0: "function %1 %2",
  //   args0: [
  //     {
  //       type: "field_input",
  //       name: "FUNCTION_NAME",
  //       text: "handle",
  //     },
  //     {
  //       type: "input_statement",
  //       name: "CODE",
  //     },
  //   ],
  // },
];

enum Order {
  ATOMIC,
}

function GENERATOR(g: Blockly.CodeGenerator) {
  g.forBlock["logic_null"] = () => {
    return ["null", Order.ATOMIC];
  };

  g.forBlock["text"] = (block) => {
    const textValue = block.getFieldValue("TEXT");
    const code = `"${textValue}"`;
    return [code, Order.ATOMIC];
  };

  g.forBlock["math_number"] = (block) => {
    const code = String(block.getFieldValue("NUM"));
    return [code, Order.ATOMIC];
  };

  g.forBlock["logic_boolean"] = (block) => {
    const code = (block.getFieldValue("BOOL") === "TRUE") ? "true" : "false";
    return [code, Order.ATOMIC];
  };

  g.forBlock["member"] = (block, generator) => {
    const name = block.getFieldValue("MEMBER_NAME");
    const value = generator.valueToCode(
      block,
      "MEMBER_VALUE",
      Order.ATOMIC,
    );
    const code = `"${name}": ${value}`;
    return code;
  };

  g.forBlock["lists_create_with"] = (block, generator) => {
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

  g.forBlock["object"] = (block, generator) => {
    const statementMembers = generator.statementToCode(block, "MEMBERS");
    const code = "{\n" + statementMembers + "\n}";
    return [code, Order.ATOMIC];
  };

  (g as (typeof g & {
    scrub_: typeof g["scrub_"];
  })).scrub_ = (
    block,
    code,
    thisOnly,
  ) => {
    const nextBlock = block.nextConnection &&
      block.nextConnection.targetBlock();
    if (nextBlock && !thisOnly) {
      return code + ",\n" + g.blockToCode(nextBlock);
    }

    return code;
  };
}

const THEME = Blockly.Theme.defineTheme("deno", {
  // TODO: Update theme.
  // https://developers.google.com/blockly/guides/configure/web/appearance/themes#built-in
  "name": "Deno",
  "base": Blockly.Themes.Classic,
  "startHats": true,
});

export type DenoBlocklyOptions = Pick<
  BlocklyOptions,
  "blocklyElement" | "codeElement"
>;

export function denoBlockly(options: DenoBlocklyOptions) {
  blockly({
    ...options,
    name: "Deno",
    toolbox: TOOLBOX,
    blocks: BLOCKS,
    generator: GENERATOR,
    theme: THEME,
    storageKey,
    trashcan: true,
  });
}

import { default as Blockly } from "blockly";
import {
  blockly,
  type BlocklyOptions,
  getWorkspace,
  setWorkspace,
} from "#/lib/blockly/mod.ts";
import { DarkTheme } from "#/lib/blockly/dark_theme.ts";
import { storageKey } from "./storage_key.ts";

// TODO: Fix Blockly code generation.

// Blockly colours:
// https://developers.google.com/blockly/guides/create-custom-blocks/block-colour
const HTTP_COLOUR = "0";
const CRON_COLOUR = "270";
// const DISCORD_COLOUR = "#5865F2"; // Blurple.

const GET_DENO_BLOCKLY_TOOLBOX =
  (): Blockly.utils.toolbox.ToolboxDefinition => {
    return {
      "kind": "categoryToolbox",
      "contents": [
        {
          "kind": "category",
          "name": "HTTP",
          "colour": HTTP_COLOUR,
          "contents": [
            {
              "kind": "block",
              "type": "on_http_request_event",
            },
            {
              "kind": "block",
              "type": "http_request_event_method_handler",
            },
            {
              "kind": "block",
              "type": "http_request_event_pathname_handler",
            },
            {
              "kind": "block",
              "type": "http_request_event_handler",
            },
          ],
        },
        {
          "kind": "category",
          "name": "Cron",
          "colour": CRON_COLOUR,
          "contents": [
            {
              "kind": "block",
              "type": "on_cron_schedule_event",
            },
            {
              "kind": "block",
              "type": "cron_schedule_event_handler",
            },
          ],
        },
        // Category ideas:
        // TODO: Add Kv watch category.
        // TODO: Add Kv queues category.
        // TODO: Add Discord category.
        //
      ],
    };
  };

const GET_DENO_BLOCKLY_BLOCKS = () => [
  // Block ideas:
  // TODO: Create kv watch event block.
  // TODO: Create kv queue message event block.
  // TODO: Create function definition block.
  // TODO: Create call function block with drop down containing function names.
  // TODO: Create import block.
  // TODO: Create global variable assignment block.
  // TODO: Create kv definition block.

  // HTTP blocks.
  {
    type: "on_http_request_event",
    colour: HTTP_COLOUR,
    message0: "on http request %1 %2",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "input_statement",
        name: "MEMBERS",
      },
    ],
  },
  {
    type: "http_request_event_handler",
    colour: HTTP_COLOUR,
    message0: "(request: Request) => {\n %1 \n}",
    args0: [
      {
        type: "field_multilinetext",
        name: "CODE",
        text: "return new Response('Hello, world!');",
        spellcheck: false,
      },
    ],
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "http_request_event_method_handler",
    colour: HTTP_COLOUR,
    message0: "if method is %1\n %2",
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
        type: "input_statement",
        name: "MEMBERS",
      },
    ],
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "http_request_event_pathname_handler",
    colour: HTTP_COLOUR,
    message0: "if pathname matches %1\n %2 %3",
    args0: [
      {
        type: "field_input",
        name: "PATH",
        text: "/",
      },
      {
        type: "input_statement",
        name: "MEMBERS",
      },
      {
        type: "input_dummy",
      },
    ],
    previousStatement: null,
    nextStatement: null,
  },

  // Cron blocks.
  {
    type: "on_cron_schedule_event",
    colour: CRON_COLOUR,
    helpUrl: "https://crontab.guru/",
    message0: "on cron schedule %1\nwith name %2\n %3",
    args0: [
      {
        type: "field_input",
        name: "CRON_SCHEDULE",
        text: "* * * * *",
      },
      {
        type: "field_input",
        name: "NAME",
        text: "",
      },
      {
        type: "input_statement",
        name: "CODE",
      },
    ],
  },
  {
    type: "cron_schedule_event_handler",
    colour: CRON_COLOUR,
    message0: "() => {\n %1 \n}",
    args0: [
      {
        type: "field_multilinetext",
        name: "CODE",
        text: "console.log('Hello, world!');",
        spellcheck: false,
      },
    ],
    previousStatement: null,
    nextStatement: null,
  },
];
const handlersIdentifier = "__HTTP_REQUEST_EVENT_HANDLERS";

const GET_DENO_BLOCKLY_GENERATOR = () => (g: Blockly.CodeGenerator) => {
  // HTTP blocks.
  g.forBlock["on_http_request_event"] = (block, generator) => {
    const statementMembers = generator.statementToCode(block, "MEMBERS");
    // TODO: Push handlers into an array in the generated code and use
    // a prefix and suffix to set up the array and call each handler.
    const code =
      `${handlersIdentifier}.push(async (request) => {\n${statementMembers}\n});`;
    return code;
  };

  g.forBlock["http_request_event_handler"] = (block) => {
    const code = block.getFieldValue("CODE");
    return code;
  };

  g.forBlock["http_request_event_method_handler"] = (block, generator) => {
    const method = block.getFieldValue("METHOD");
    const statementMembers = generator.statementToCode(block, "MEMBERS");
    const code =
      `if (request.method === "${method}") {\n${statementMembers}\n}`;
    return code;
  };

  g.forBlock["http_request_event_pathname_handler"] = (block, generator) => {
    const pathname = block.getFieldValue("PATH");
    const statementMembers = generator.statementToCode(block, "MEMBERS");
    const code =
      `if (new URLPattern({ pathname: "${pathname}" }).test({ pathname: new URL(request.url).pathname })) {\n${statementMembers}\n}`;
    return code;
  };

  // Cron blocks.
  g.forBlock["on_cron_schedule_event"] = (block, generator) => {
    const name = block.getFieldValue("NAME");
    const cronSchedule = block.getFieldValue("CRON_SCHEDULE");
    const statementCode = generator.statementToCode(block, "CODE");
    const code =
      `Deno.cron("${name}", "${cronSchedule}", async () => {\n${statementCode}\n});`;
    return code;
  };

  g.forBlock["cron_schedule_event_handler"] = (block) => {
    const code = block.getFieldValue("CODE");
    return code;
  };

  g.finish = (code) => {
    return `if (import.meta.main) {
const ${handlersIdentifier} = [];
${code}
Deno.serve(async (request) => {
  for (const handler of ${handlersIdentifier}}) {
    const response = await handler(request);
    if (response) {
      return response;
    }
  }
  return new Response("Not found", { status: 404 });
});
}`;
  };
};

const GET_DENO_BLOCKLY_THEME = () => {
  const prefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = prefersDark ? DarkTheme : Blockly.Themes.Classic;

  // Customize theme.
  // https://developers.google.com/blockly/guides/configure/web/appearance/themes#create_a_theme
  theme.name = "Deno";
  theme.startHats = true;
  return theme;
};

export type DenoBlocklyOptions = Pick<
  BlocklyOptions,
  "blocklyElement" | "codeElement" | "getInitialWorkspace" | "onWorkspaceChange"
>;

export function denoBlockly(options: DenoBlocklyOptions) {
  blockly({
    ...options,
    name: "Deno",
    getToolbox: GET_DENO_BLOCKLY_TOOLBOX,
    getBlocks: GET_DENO_BLOCKLY_BLOCKS,
    getGenerator: GET_DENO_BLOCKLY_GENERATOR,
    getTheme: GET_DENO_BLOCKLY_THEME,
    getInitialWorkspace: options.getInitialWorkspace ??
      (() => getWorkspace(storageKey)),
    onWorkspaceChange: options.onWorkspaceChange ??
      ((workspace) => setWorkspace(storageKey, workspace)),
    trashcan: true,
  });
}

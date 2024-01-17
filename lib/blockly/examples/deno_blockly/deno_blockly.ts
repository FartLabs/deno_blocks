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
const DISCORD_COLOUR = "#5865F2"; // Blurple.

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
        {
          "kind": "category",
          "name": "Discord",
          "colour": DISCORD_COLOUR,
          "contents": [
            {
              "kind": "block",
              "type": "on_discord_message_interaction_event",
            },
            {
              "kind": "block",
              "type": "discord_message_interaction_event_handler",
            },
            {
              "kind": "block",
              "type": "on_discord_user_interaction_event",
            },
            {
              "kind": "block",
              "type": "discord_user_interaction_event_handler",
            },
          ],
        },
        // TODO: Add Kv watch category.
        // TODO: Add Kv queues category.
        // TODO: Add mapper block that is a function that maps one type to another.
        //

        //
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
  };

const GET_DENO_BLOCKLY_BLOCKS = () => [
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
    message0: "if method is %1 %2 %3",
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
    type: "http_request_event_pathname_handler",
    colour: HTTP_COLOUR,
    message0: "if pathname matches %1 %2 %3",
    args0: [
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

  // Cron blocks.
  {
    type: "on_cron_schedule_event",
    colour: CRON_COLOUR,
    message0: "on cron schedule %1\nname: %2\n %3",
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

  // Discord blocks.
  {
    type: "on_discord_message_interaction_event",
    colour: DISCORD_COLOUR,
    message0: "on discord message interaction %1 %2",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "input_statement",
        name: "CODE",
      },
    ],
  },
  {
    type: "discord_message_interaction_event_handler",
    colour: DISCORD_COLOUR,
    message0:
      "(interaction: APIMessageApplicationCommandInteraction) => {\n %1 \n}",
    args0: [
      {
        type: "field_multilinetext",
        name: "CODE",
        text: `const message =
  interaction.data.resolved.messages[interaction.data.target_id];
const messageURL =
  \`https://discord.com/channels/\${interaction.guild_id}/\${message.channel_id}/\${message.id}\`;
return {
  type: InteractionResponseType.ChannelMessageWithSource,
  data: {
    content:
      \`Bookmarked \${messageURL} for <@\${interaction.member?.user.id}>!\`,
  },
};`,
      },
    ],
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: "on_discord_user_interaction_event",
    colour: DISCORD_COLOUR,
    message0: "on discord user interaction %1 %2",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "input_statement",
        name: "CODE",
      },
    ],
  },
  {
    type: "discord_user_interaction_event_handler",
    colour: DISCORD_COLOUR,
    message0:
      "(interaction: APIUserApplicationCommandInteraction) => {\n %1 \n}",
    args0: [
      {
        type: "field_multilinetext",
        name: "CODE",
        text: `const targetUser =
  interaction.data.resolved.users[interaction.data.target_id];
return {
  type: InteractionResponseType.ChannelMessageWithSource,
  data: {
    content:
      \`<@\${interaction.member?.user.id}> high-fived <@\${targetUser.id}>!\`,
  },
};`,
        spellcheck: false,
      },
    ],
    previousStatement: null,
    nextStatement: null,
  },
];

enum Order {
  ATOMIC,
}

const GET_DENO_BLOCKLY_GENERATOR = () => (g: Blockly.CodeGenerator) => {
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

const ADD_EXPRESSION_JS = (a: number, b: number) => `${a} + ${b}`;
const SUBTRACT_EXPRESSION_JS = (a: number, b: number) => `${a} - ${b}`;
const MULTIPLY_EXPRESSION_JS = (a: number, b: number) => `${a} * ${b}`;
const DIVIDE_EXPRESSION_JS = (a: number, b: number) => `${a} / ${b}`;

const RETURN_STATEMENT_JS = (expression: string) => `return ${expression};`;
const REST_ARGUMENT_JS = (name: string) => `...${name}`;
const FUNCTION_EXPRESSION_JS = (
  name: string,
  expression: string,
  ...args: string[]
) => `function ${name}(${args.join(", ")}) {\n${expression}\n}`;
const ANONYMOUS_FUNCTION_EXPRESSION_JS = (
  expression: string,
  ...args: string[]
) => `function(${args.join(", ")}) {\n${expression}\n}`;
const ARROW_FUNCTION_EXPRESSION_JS = (expression: string, ...args: string[]) =>
  `(${args.join(", ")}) => {\n${expression}\n}`;
const ARROW_FUNCTION_EXPRESSION_JS_SHORTHAND = (
  expression: string,
  ...args: string[]
) => `(${args.join(", ")}) => ${expression};`;
const FUNCTION_CALL_JS = (name: string, ...args: string[]) =>
  `${name}(${args.join(", ")})`;

const CONST_DECLARATION_JS = (name: string, expression: string) =>
  `const ${name} = ${expression};`;
const LET_DECLARATION_JS = (name: string, expression: string) =>
  `let ${name} = ${expression};`;
const EXPORT_STATEMENT_JS = (expression: string) => `export ${expression}`;
const EXPORT_DEFAULT_STATEMENT_JS = (expression: string) =>
  `export default ${expression}`;

const TYPED_ARGUMENT_TS = (name: string, type: string) => `${name}: ${type}`;
const TYPED_REST_ARGUMENT_TS = (name: string, type: string) =>
  TYPED_ARGUMENT_TS(REST_ARGUMENT_JS(name), type);
const FUNCTION_EXPRESSION_TS = (
  name: string,
  expression: string,
  ...args: { name: string; type: string }[]
) =>
  `function ${name}(${
    args.map(({ name, type }) => TYPED_ARGUMENT_TS(name, type)).join(", ")
  }): number {\n${expression}\n}`;
const TYPE_DECLARATION_TS = (name: string, type: string) =>
  `type ${name} = ${type};`;
const INTERFACE_DECLARATION_TS = (
  name: string,
  ...args: { name: string; type: string }[]
) =>
  `interface ${name} {\n${
    args
      .map(({ name, type }) => `${TYPED_ARGUMENT_TS(name, type)};`)
      .join("\n")
  }\n}`;
const ARRAY_TYPE_TS = (type: string) => `${type}[]`;
const FUNCTION_TYPE_TS = (
  returnType: string,
  ...args: { name: string; type: string }[]
): string => `(${args.map(({ type }) => type).join(", ")}) => ${returnType}`;

// An IDE that helps you create TS-Morph components in a type-safe way.
// https://ts-morph.com/

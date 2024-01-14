import { useEffect, useRef } from "preact/hooks";
import { typescriptBlockly } from "#/lib/blockly/examples/typescript_blockly/mod.ts";

export default function TypeScriptBlocklyIsland() {
  const blocklyRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!blocklyRef.current || !codeRef.current) {
      return;
    }

    typescriptBlockly({
      blocklyElement: blocklyRef.current,
      codeElement: codeRef.current,
    });
  }, [blocklyRef, codeRef]);

  return (
    <div className="container">
      <div className="blockly" ref={blocklyRef} />
      <div className="output-pane">
        <pre className="generated-code"><code ref={codeRef}/></pre>
        <div className="output" />
      </div>
    </div>
  );
}

import { useEffect, useRef } from "preact/hooks";
import { setup } from "#/lib/typescript_generator/mod.ts";

export default function TypeScriptBlocklyIsland() {
  const blocklyRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!blocklyRef.current || !codeRef.current) {
      return;
    }

    setup({
      blockly: blocklyRef.current,
      code: codeRef.current,
    });
  }, [blocklyRef, codeRef]);

  return (
    <div className="container">
      <div className="output-pane">
        <pre className="generated-code"><code ref={codeRef}/></pre>
        <div className="output" />
      </div>

      <div className="blockly" ref={blocklyRef} />
    </div>
  );
}

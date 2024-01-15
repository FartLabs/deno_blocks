import { useEffect, useRef } from "preact/hooks";
import { denoBlockly } from "#/lib/blockly/examples/deno_blockly/mod.ts";

export default function BlocklyIsland() {
  const blocklyRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!blocklyRef.current || !codeRef.current) {
      return;
    }

    denoBlockly({
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

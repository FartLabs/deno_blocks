import DenoBlocksIDEIsland from "#/islands/deno_blocks_ide_island.tsx";
// import { kv } from "#/lib/resources/kv.ts";

export default /*async*/ function HomePage(_request: Request) {
  // TODO: Load workspace from Deno KV by session ID.
  return <DenoBlocksIDEIsland />;
}

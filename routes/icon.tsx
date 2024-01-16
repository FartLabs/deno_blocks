import DenoBlocksIcon from "#/components/deno_blocks_icon.tsx";

export default function Icon(_request: Request) {
  // TODO: Load workspace from Deno KV by session ID.
  return <DenoBlocksIcon size="min(50vw, 50vh)" />;
}

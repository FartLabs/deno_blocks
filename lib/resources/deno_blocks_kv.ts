import { DenoBlocksKv } from "#/lib/deno_blocks_kv/mod.ts";
import { kv } from "./kv.ts";

export const denoBlocksKv = new DenoBlocksKv(kv);

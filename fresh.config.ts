import { defineConfig } from "$fresh/server.ts";
import { kvOAuthPlugin } from "#/plugins/kv_oauth/mod.ts";
import { kv } from "#/lib/resources/kv.ts";
import { denoBlocksAPIPlugin } from "#/plugins/deno_blocks_api/mod.ts";

export default defineConfig({
  plugins: [
    kvOAuthPlugin(kv),
    denoBlocksAPIPlugin({
      kv,
    }),
  ],
});

import { defineConfig } from "$fresh/server.ts";
import { kvInsightsPlugin } from "https://deno.land/x/deno_kv_insights@v0.8.0-beta/mod.ts";
import { kvOAuthPlugin } from "#/plugins/kv_oauth/mod.ts";
import { denoBlocksAPIPlugin } from "#/plugins/deno_blocks_api/mod.ts";
import { kv } from "#/lib/resources/kv.ts";

export default defineConfig({
  plugins: [
    kvOAuthPlugin(),
    denoBlocksAPIPlugin({ kv }),
    kvInsightsPlugin({ kv }),
  ],
});

import { defineConfig } from "$fresh/server.ts";
import { kvInsightsPlugin } from "deno_kv_insights/mod.ts";
import { parse } from "boolean/mod.ts";
import { kvOAuthPlugin } from "#/plugins/kv_oauth/mod.ts";
import { kv } from "#/lib/resources/kv.ts";

const plugins = [kvOAuthPlugin()];

const ENABLE_KV_INSIGHTS_KEY = "ENABLE_KV_INSIGHTS";
let enableKvInsights = false;
if (
  (await Deno.permissions.query({
    name: "env",
    variable: ENABLE_KV_INSIGHTS_KEY,
  }))
    .state === "granted"
) {
  enableKvInsights = parse(Deno.env.get(ENABLE_KV_INSIGHTS_KEY));
}

if (enableKvInsights) {
  plugins.push(kvInsightsPlugin({ kv }));
}

export default defineConfig({ plugins });

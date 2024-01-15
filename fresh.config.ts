import { defineConfig } from "$fresh/server.ts";
import { kvOAuthPlugin } from "#/plugins/kv_oauth/mod.ts";

export default defineConfig({
  plugins: [
    kvOAuthPlugin,
  ],
});

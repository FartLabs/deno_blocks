import { createGitHubOAuthConfig, createHelpers } from "deno_kv_oauth/mod.ts";
import type { Plugin } from "$fresh/server.ts";

const { signIn, handleCallback, signOut, getSessionId } = createHelpers(
  createGitHubOAuthConfig(),
);

export const kvOAuthPlugin = (_kv: Deno.Kv): Plugin => ({
  name: "kv-oauth",
  routes: [
    {
      path: "/signin",
      async handler(req) {
        return await signIn(req);
      },
    },
    {
      path: "/callback",
      async handler(req) {
        // Return object also includes `accessToken` and `sessionId` properties.
        const { response } = await handleCallback(req);

        // TODO: See if I need to store the access token in KV manually.

        return response;
      },
    },
    {
      path: "/signout",
      async handler(req) {
        return await signOut(req);
      },
    },
    {
      path: "/protected",
      async handler(req) {
        return await getSessionId(req) === undefined
          ? new Response("Unauthorized", { status: 401 })
          : new Response("You are allowed");
      },
    },
  ],
});

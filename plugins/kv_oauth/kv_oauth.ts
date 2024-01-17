import { createGitHubOAuthConfig, createHelpers } from "deno_kv_oauth/mod.ts";
import type { Plugin } from "$fresh/server.ts";

export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 1 week
export const SESSION_DURATION_MS = SESSION_DURATION_SECONDS * 1e3;

export const oauthConfig = createGitHubOAuthConfig();

export const {
  signIn,
  handleCallback,
  signOut,
  getSessionId,
} = createHelpers(
  oauthConfig,
  {
    cookieOptions: {
      maxAge: SESSION_DURATION_SECONDS,
    },
  },
);

export const kvOAuthPlugin = (_kv: Deno.Kv): Plugin => ({
  name: "kv-oauth",
  routes: [
    {
      path: "/signin",
      async handler(request) {
        return await signIn(request);
      },
    },
    {
      path: "/callback",
      async handler(request) {
        // Return object also includes `accessToken` and `sessionId` properties.
        const { response, sessionId, tokens } = await handleCallback(request);
        console.log({ sessionId, tokens });

        // TODO: See if I need to store the access token in KV manually.

        return response;
      },
    },
    {
      path: "/signout",
      async handler(request) {
        return await signOut(request);
      },
    },
    {
      path: "/protected",
      async handler(request) {
        return await getSessionId(request) === undefined
          ? new Response("Unauthorized", { status: 401 })
          : new Response("You are allowed");
      },
    },
  ],
});

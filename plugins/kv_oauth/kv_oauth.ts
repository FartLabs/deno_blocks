import type { Plugin } from "$fresh/server.ts";
import { WEEK } from "$fresh/src/dev/deps.ts";
import { createGitHubOAuthConfig, createHelpers } from "deno_kv_oauth/mod.ts";
import { getGitHubAPIUserByAccessToken } from "#/lib/github_api/mod.ts";
import { denoBlocksKv } from "#/lib/resources/deno_blocks_kv.ts";

export const SESSION_DURATION_SECONDS = WEEK;
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

export const kvOAuthPlugin = (): Plugin => ({
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

        // Check if user exists in Kv by GitHub user ID.
        const githubUser = await getGitHubAPIUserByAccessToken(
          tokens.accessToken,
        );
        let user = await denoBlocksKv.getUserByGitHubUserID({
          githubUserID: githubUser.id.toString(),
        });
        // If user does not exist, create user in Kv.
        if (!user) {
          user = await denoBlocksKv.createUser({
            githubUserID: githubUser.id.toString(),
            githubUsername: githubUser.login,
          });
        }

        // Associate session ID with user ID.
        await denoBlocksKv.addSession({
          sessionID: sessionId,
          userID: user.id,
          expireIn: tokens.expiresIn,
        });

        // TODO: Store project workspaces by user ID in Kv.
        // See: /lib/deno_blocks_kv/deno_blocks_kv.ts

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

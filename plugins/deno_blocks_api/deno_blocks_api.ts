import type { Plugin } from "$fresh/server.ts";
import { getSessionId } from "deno_kv_oauth/mod.ts";
import { getGitHubAPIUserByAccessToken } from "#/lib/github_api/mod.ts";

export interface DenoBlocksAPIPluginOptions {
  kv: Deno.Kv;
  kvKeyNamespace?: Deno.KvKey;
  basePath?: string;
}

export enum DenoBlocksAPIPluginKVKey {
  ACCESS_TOKEN_BY_SESSION_ID = "access_token_by_session_id",
}

export const DENO_BLOCKS_API_PLUGIN_KV_KEY_NAMESPACE: Deno.KvKey = [
  "deno_blocks_api",
];

/**
 * Requires kv-oauth plugin to be loaded before this plugin.
 */
export function denoBlocksAPIPlugin(
  options: DenoBlocksAPIPluginOptions,
): Plugin {
  const { basePath = "/api" } = options;
  return {
    name: "deno-blocks-api",
    routes: [
      {
        path: `${basePath}/projects`,
        async handler(request) {
          if (request.method === "POST") {
            const sessionID = await getSessionId(request);
            if (!sessionID) {
              return new Response("Unauthorized", { status: 401 });
            }

            const accessTokenResult = await options.kv.get<string>([
              ...(options.kvKeyNamespace ??
                DENO_BLOCKS_API_PLUGIN_KV_KEY_NAMESPACE),
              DenoBlocksAPIPluginKVKey.ACCESS_TOKEN_BY_SESSION_ID,
              sessionID,
            ]);
            if (!accessTokenResult.value) {
              return new Response("Unauthorized", { status: 401 });
            }

            const githubUser = await getGitHubAPIUserByAccessToken(
              accessTokenResult.value,
            );

            return new Response(JSON.stringify(githubUser));

            // Create a project with subhosting API.
            // https://github.com/denoland/subhosting_ide_starter/blob/main/subhosting.ts

            // const projectID = crypto.randomUUID();
          }

          // return await signIn(req);
          return new Response("Not implemented", { status: 501 });
        },
      },
      // {
      //   path: "/callback",
      //   async handler(req) {
      //     // Return object also includes `accessToken` and `sessionId` properties.
      //     const { response } = await handleCallback(req);
      //     return response;
      //   },
      // },
      // {
      //   path: "/signout",
      //   async handler(req) {
      //     return await signOut(req);
      //   },
      // },
    ],
  };
}

import type { Plugin } from "$fresh/server.ts";
import { getSessionId } from "deno_kv_oauth/mod.ts";

export interface DenoBlocksAPIPluginOptions {
  basePath?: string;
}

/**
 * Requires kv-oauth plugin to be loaded before this plugin.
 */
export function denoBlocksAPIPlugin(
  options: DenoBlocksAPIPluginOptions = {},
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

            // TODO: Create a new project for the user.
          }

          if (request.method === "GET") {
            const sessionID = await getSessionId(request);
            if (!sessionID) {
              return new Response("Unauthorized", { status: 401 });
            }

            // List project from Kv that are owned by the user.
          }

          // return await signIn(req);
          return new Response("Not implemented", { status: 501 });
        },
      },
    ],
  };
}

import { FreshContext, Handlers } from "$fresh/server.ts";
import { getSessionId } from "deno_kv_oauth/mod.ts";
import { denoBlocksKv } from "#/lib/resources/deno_blocks_kv.ts";

export const handler: Handlers = {
  async GET(request: Request, context: FreshContext) {
    const projectID = context.params.project_id;
    if (!projectID) {
      return new Response("Expected project_id", { status: 400 });
    }

    const sessionID = await getSessionId(request);
    if (!sessionID) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Check if user owns project.
    const user = await denoBlocksKv.getUserBySessionID({ sessionID });
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!user.projects.find((p) => p.id === projectID)) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Get workspace from KV.
    const stringifiedWorkspace = await denoBlocksKv
      .getStringifiedWorkspaceByProjectID({ projectID });
    return new Response(
      stringifiedWorkspace,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  },
  async POST(request: Request, context: FreshContext) {
    const projectID = context.params.project_id;
    if (!projectID) {
      return new Response("Expected project_id", { status: 400 });
    }

    const sessionID = await getSessionId(request);
    if (!sessionID) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Check if user owns project.
    const user = await denoBlocksKv.getUserBySessionID({ sessionID });
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!user.projects.find((p) => p.id === projectID)) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Update workspace in KV.
    const stringifiedWorkspace = await request.text();
    await denoBlocksKv.setStringifiedWorkspace({
      projectID,
      stringifiedWorkspace,
    });
    return new Response("OK");
  },
};

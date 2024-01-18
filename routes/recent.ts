import { Handlers } from "$fresh/server.ts";
import { getSessionId } from "deno_kv_oauth/mod.ts";
import { denoBlocksKv } from "#/lib/resources/deno_blocks_kv.ts";

export const handler: Handlers = {
  async GET(request: Request) {
    const sessionID = await getSessionId(request);
    if (!sessionID) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Find the most recent project from Kv that are owned by the user.
    const userID = await denoBlocksKv.getUserIDBySessionID({
      sessionID,
    });
    if (!userID) {
      return new Response("Unauthorized", { status: 401 });
    }

    const projects = await denoBlocksKv.getProjectsByUserID({
      id: userID,
    });
    if (!projects) {
      return new Response("Internal Server Error", { status: 500 });
    }

    const recentProjects = projects.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    const recentProject = recentProjects[0];
    return new Response("", {
      status: 302,
      headers: {
        Location: recentProject ? `/projects/${recentProject.id}` : "/new",
      },
    });
  },
};

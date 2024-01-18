import { Handlers } from "$fresh/server.ts";
import { getSessionId } from "deno_kv_oauth/mod.ts";
import { createProject } from "#/lib/subhosting_api/mod.ts";
import { denoBlocksKv } from "#/lib/resources/deno_blocks_kv.ts";

const DEPLOY_ORG_ID = Deno.env.get("DEPLOY_ORG_ID")!;
const DEPLOY_ACCESS_TOKEN = Deno.env.get("DEPLOY_ACCESS_TOKEN")!;

export const handler: Handlers = {
  async GET(request: Request) {
    const sessionID = await getSessionId(request);
    if (!sessionID) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Create a new project for the user.
    const userID = await denoBlocksKv.getUserIDBySessionID({
      sessionID,
    });
    if (!userID) {
      return new Response("Unauthorized", { status: 401 });
    }

    const project = await createProject({
      organizationID: DEPLOY_ORG_ID,
      accessToken: DEPLOY_ACCESS_TOKEN,
    });
    await denoBlocksKv.addProject({ userID, project });
    return new Response("", {
      status: 302,
      headers: {
        Location: `/projects/${project.id}`,
      },
    });
  },
};

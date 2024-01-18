import { FreshContext, Handlers } from "$fresh/server.ts";
import { getSessionId } from "deno_kv_oauth/mod.ts";
import { denoBlocksKv } from "#/lib/resources/deno_blocks_kv.ts";
import { deleteProject } from "#/lib/subhosting_api/mod.ts";

const DEPLOY_ORG_ID = Deno.env.get("DEPLOY_ORG_ID")!;
const DEPLOY_ACCESS_TOKEN = Deno.env.get("DEPLOY_ACCESS_TOKEN")!;

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

    // List project from Kv that are owned by the user.
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
      return new Response("Unauthorized", { status: 401 });
    }

    const project = projects.find((project) => project.id === projectID);
    if (!project) {
      return new Response("Unauthorized", { status: 401 });
    }

    return Response.json(project);
  },
  async DELETE(request: Request, context: FreshContext) {
    const projectID = context.params.project_id;
    if (!projectID) {
      return new Response("Expected project_id", { status: 400 });
    }

    const sessionID = await getSessionId(request);
    if (!sessionID) {
      return new Response("Unauthorized", { status: 401 });
    }

    // List project from Kv that are owned by the user.
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
      return new Response("Unauthorized", { status: 401 });
    }

    const project = projects.find((project) => project.id === projectID);
    if (!project) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Delete the project with Subhosting API.
    await deleteProject({
      projectId: projectID,
      organizationID: DEPLOY_ORG_ID,
      accessToken: DEPLOY_ACCESS_TOKEN,
    });

    // Delete the project from Kv.
    await denoBlocksKv.deleteProject({ userID, projectID });
    return new Response("", { status: 200 });
  },
};

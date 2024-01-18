import type { FreshContext } from "$fresh/src/server/mod.ts";
import { getSessionId } from "deno_kv_oauth/mod.ts";
import DenoBlocksIDEIsland from "#/islands/deno_blocks_ide_island.tsx";
import { getDeployments } from "#/lib/subhosting_api/mod.ts";
import { denoBlocksKv } from "#/lib/resources/deno_blocks_kv.ts";

const DEPLOY_ORG_ID = Deno.env.get("DEPLOY_ORG_ID")!;
const DEPLOY_ACCESS_TOKEN = Deno.env.get("DEPLOY_ACCESS_TOKEN")!;

export default async function ProjectPage(
  request: Request,
  context: FreshContext,
) {
  const projectID = context.params.project_id;
  if (!projectID) {
    return new Response("Not found", { status: 404 });
  }

  const sessionID = await getSessionId(request);
  if (!sessionID) {
    return new Response("", {
      status: 302,
      headers: {
        Location: `/signin?success_url=/projects/${projectID}`,
      },
    });
  }

  // List project from Kv that are owned by the user.
  const userID = await denoBlocksKv.getUserIDBySessionID({
    sessionID,
  });
  if (!userID) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await denoBlocksKv.getUserByID({ id: userID });
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Get the project from the user's projects.
  const project = user.projects.find((project) => project.id === projectID);
  if (!project) {
    return new Response("Not found", { status: 404 });
  }

  // Get the workspace from the project.
  const stringifiedWorkspace = await denoBlocksKv
    .getStringifiedWorkspaceByProjectID({ projectID });

  return (
    <DenoBlocksIDEIsland
      user={user}
      project={project}
      stringifiedWorkspace={stringifiedWorkspace}
    />
  );
}

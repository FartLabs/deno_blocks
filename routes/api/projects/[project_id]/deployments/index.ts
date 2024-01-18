import { FreshContext, Handlers } from "$fresh/server.ts";
import { getSessionId } from "deno_kv_oauth/mod.ts";
import { createDeployment, getDeployments } from "#/lib/subhosting_api/mod.ts";
import { denoBlocksKv } from "#/lib/resources/deno_blocks_kv.ts";

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

    // Check if user owns project.
    const user = await denoBlocksKv.getUserBySessionID({ sessionID });
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!user.projects.find((p) => p.id === projectID)) {
      return new Response("Unauthorized", { status: 401 });
    }

    // List deployments with Subhosting API.
    const deployments = await getDeployments({
      projectId: projectID,
      organizationID: DEPLOY_ORG_ID,
      accessToken: DEPLOY_ACCESS_TOKEN,
    });
    if (!deployments) {
      return new Response("Failed to list deployments", { status: 500 });
    }

    console.log({ deployments, user });

    return new Response(
      JSON.stringify(deployments),
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

    // Deploy project with Subhosting API.
    const code = await request.text();
    const deployment = await createDeployment({
      projectId: projectID,
      entryPointUrl: "main.ts",
      assets: {
        "main.ts": {
          kind: "file",
          content: code,
          encoding: "utf-8",
        },
      },
      envVars: {}, // TODO: Add input for env vars.
      importMapUrl: null,
      lockFileUrl: null,
      compilerOptions: null,
      organizationID: DEPLOY_ORG_ID,
      accessToken: DEPLOY_ACCESS_TOKEN,
    });
    if (!deployment) {
      return new Response("Failed to deploy", { status: 500 });
    }

    console.log({ deployment, user });

    return new Response(
      JSON.stringify(deployment),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  },
};

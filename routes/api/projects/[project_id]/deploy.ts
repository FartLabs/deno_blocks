import { FreshContext, Handlers } from "$fresh/server.ts";
import { getSessionId } from "deno_kv_oauth/mod.ts";
import { createDeployment } from "#/lib/subhosting_api/mod.ts";

const DEPLOY_ORG_ID = Deno.env.get("DEPLOY_ORG_ID")!;
const DEPLOY_ACCESS_TOKEN = Deno.env.get("DEPLOY_ACCESS_TOKEN")!;

export const handler: Handlers = {
  async POST(request: Request, context: FreshContext) {
    const projectID = context.params.project_id;
    if (!projectID) {
      return new Response("Expected project_id", { status: 400 });
    }

    const sessionID = await getSessionId(request);
    if (!sessionID) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Deploy project with Subhosting API.
    const code = await request.text();
    const deployment = await createDeployment({
      projectId: projectID,
      entrypointUrl: "main.ts",
      assets: {
        "main.ts": {
          kind: "file",
          content: code,
          encoding: "utf-8",
        },
      },
      importMapUrl: null,
      lockFileUrl: null,
      compilerOptions: null,
      organizationID: DEPLOY_ORG_ID,
      accessToken: DEPLOY_ACCESS_TOKEN,
    });
    if (!deployment) {
      return new Response("Failed to deploy", { status: 500 });
    }

    return new Response(
      JSON.stringify(deployment),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  },
};

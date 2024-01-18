import { getSessionId } from "deno_kv_oauth/mod.ts";
import { denoBlocksKv } from "#/lib/resources/deno_blocks_kv.ts";

export default async function HomePage(request: Request) {
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

  const user = await denoBlocksKv.getUserByID({ id: userID });
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  return <p>Hello, {user.githubUsername}</p>;
}

/// <reference lib="deno.unstable" />

// Using the same instance of KV across all plugins by accessing it from the
// same Deno Kv path.
// https://github.com/denoland/deno_kv_oauth/blob/5c17b1868fb239e97b89e8400b1a97a66342ea61/lib/_kv.ts#L10
//
// Attention: This relies on MY_DENO_KV_PATH being the same as DENO_KV_PATH.
//

const DENO_KV_PATH_KEY = "MY_DENO_KV_PATH";
let path: string | undefined = undefined;
if (
  (await Deno.permissions.query({
    name: "env",
    variable: DENO_KV_PATH_KEY,
  }))
    .state === "granted"
) {
  path = Deno.env.get(DENO_KV_PATH_KEY);
}

export const kv = await Deno.openKv(path);

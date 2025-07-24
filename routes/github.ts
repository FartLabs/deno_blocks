import { Handlers } from "fresh/compat";

export const handler: Handlers = {
  GET() {
    return Response.redirect("https://github.com/ethanthatonekid/deno_blocks");
  },
};

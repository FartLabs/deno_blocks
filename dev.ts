import { Builder } from "fresh/dev";

// Pass development only configuration here
const builder = new Builder({ target: "safari12" });

// Create optimized assets for the browser when
// running `deno run -A dev.ts build`
if (Deno.args.includes("build")) {
  await builder.build();
} else {
  // ...otherwise start the development server
  await builder.listen(() => import("./main.ts"));
}

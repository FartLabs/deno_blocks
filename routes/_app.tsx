import { type PageProps } from "$fresh/server.ts";

export default function App(props: PageProps) {
  if (props.url.pathname.startsWith("/kv-insights/")) {
    return <props.Component />;
  }

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>deno_subhosting</title>
        <link rel="stylesheet" href="/styles.css" />

        <script src="https://unpkg.com/blockly/blockly_compressed.js"></script>
      </head>
      <body>
        <props.Component />
      </body>
    </html>
  );
}

import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>deno_subhosting</title>
        <link rel="stylesheet" href="/styles.css" />

        <script src="https://unpkg.com/blockly/blockly_compressed.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/split.js/1.6.5/split.min.js">
        </script>
        <script src="/ide_splitter.js"></script>
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}

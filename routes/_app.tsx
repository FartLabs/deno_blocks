import { useEffect } from "preact/hooks";
import { type PageProps } from "$fresh/server.ts";

export default function App(props: PageProps) {
  if (props.url.pathname.startsWith("/kv-insights/")) {
    return <props.Component />;
  }

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute("data-color-mode", "dark");
    } else {
      document.documentElement.setAttribute("data-color-mode", "light");
    }
  });

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Deno Blocks</title>
        <link rel="stylesheet" href="/styles.css" />

        <script src="https://unpkg.com/blockly/blockly_compressed.js"></script>
      </head>
      <body
        class="markdown-body"
        data-light-theme="light"
        data-dark-theme="dark"
      >
        <props.Component />
      </body>
    </html>
  );
}

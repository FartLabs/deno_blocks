<img align="right" src="static/deno-blocks-icon.gif" width="256px" title="Credit: @_tanakaworld">

# Deno Blocks

## Overview

- **Prompt**:
  [Build a Cloud IDE for the Deno Subhosting Hackathon](https://deno.com/blog/subhosting-hackathon).
- **Demo URL**: [blocks.deno.dev](https://blocks.deno.dev)

For the Deno Subhosting Hackathon, we've developed an IDE built with
[Fresh](https://github.com/denoland/fresh) and
[Blockly](https://github.com/google/blockly) that allows you to drag and drop
pieces to write code.

## Accolades

**Ryan's favorite** (1st place) and **Most fun** at the
[Deno Subhosting Hackathon](https://deno.com/blog/subhosting-hackathon#winning-submissions).

## Known issues/future work

- UI accessibility.
- Add environment variables to deployment.
- Real-time project workspace synchronization with
  [`kv.watch`](https://deno.com/blog/kv-watch).
- Editable project metadata.
- Deno Blocks toolbox versioning.
- Resizable IDE panels.
- Use [prismjs](https://prismjs.com/) syntax highlighted code in generated code
  output panel.
- Add compiler errors output panel with
  [ts-morph](https://github.com/dsherret/ts-morph).
- Generate [gfm](https://deno.land/x/gfm) documentation from markdown
- More? [Open an issue](https://github.com/FartLabs/deno_blocks/issues/new).

## Development

Make sure to install Deno:
<https://deno.land/manual/getting_started/installation>

Then start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.

## Credits

- [Deno](https://deno.land/).
- Icon artwork by [**@_tanakaworld**](https://twitter.com/_tanakaworld).

---

Developed with [🦕](https://deno.land/)

import DenoBlocksIcon from "#/components/deno_blocks_icon.tsx";

export default function DenoBlocksIconPage() {
  return (
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <div>
        <DenoBlocksIcon size="min(50vw, 50vh)" />
        <br />
        <p style="font-size: 2rem; font-weight: bold; text-align: center; color: var(--text-color, #000);">
          Documentation available on GitHub:<br />
          <a href="https://github.com/ethanthatonekid/deno_blocks">
            github.com/ethanthatonekid/deno_blocks
          </a>
        </p>
      </div>
    </div>
  );
}

import DenoBlocksIcon from "#/components/deno_blocks_icon.tsx";

export default function LandingPage() {
  return (
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <div>
        <h1>Deno Blocks</h1>
        <br />
        <DenoBlocksIcon size="min(50vw, 50vh)" />
        <br />
        <p style="font-size: 2rem; font-weight: bold; text-align: center;">
          Credit: <a href="https://twitter.com/_tanakaworld">@_tanakaworld</a>
        </p>
      </div>
    </div>
  );
}

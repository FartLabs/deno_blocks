import TypeScriptBlocklyIsland from "#/islands/typescript_blockly_island.tsx";

export default function Home() {
  return (
    <div class="">
      <div class="">
        <img
          class=""
          src="/logo.svg"
          width="128"
          height="128"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
        <h1 class="">Welcome to Fresh</h1>
        <p class="">
          Try updating this message in the
          <code class="">./routes/index.tsx</code> file, and refresh.
        </p>
        <TypeScriptBlocklyIsland />
      </div>
    </div>
  );
}

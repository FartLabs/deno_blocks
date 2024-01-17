import DenoBlocksIcon from "#/components/deno_blocks_icon.tsx";

export default function LandingPage() {
  return (
    <div class="landing__page">
      <div class="landing__page__content">
        <div class="landing__page__header">
          <h1 class="landing__page__title">Deno Blocks</h1>
          <div class="landing__page__logo"><img src="deno-blocks-icon.gif" alt="Deno Blocks Icon"/></div>
        </div>
        <p class="landing__page__description">Play with Deno Blocks, an IDE built for the <a href="https://deno.com/blog/subhosting-hackathon">Deno Subhosting Hackathon</a> that allows developers to play/access/move Deno's automatic instrumentation and other powerful features.</p>
      </div>
      <div class="landing__page__image">
        <img src="/landing_page_image.png" alt="Deno Blocks" />
      </div>
    </div>
    // <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
    //   <div>
    //     <h1>Deno Blocks</h1>
    //     <br />
    //     <DenoBlocksIcon size="min(50vw, 50vh)" />
    //     <br />
    //     <p style="font-size: 2rem; font-weight: bold; text-align: center;">
    //       Credit: <a href="https://twitter.com/_tanakaworld">@_tanakaworld</a>
    //     </p>
    //   </div>
    // </div>
  );
}

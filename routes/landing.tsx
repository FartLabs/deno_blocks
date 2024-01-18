import DenoBlocksIcon from "#/components/deno_blocks_icon.tsx";

export default function LandingPage() {
  return (
    <section class="landing__page">
      <div class="landing__page__buttons">
        <a class="landing__page__sourcecode" href="https://etok.codes/deno_blocks">
          <img src="github_logo.svg" alt="Github Logo" />
        </a>
      </div>
      <div class="landing__page__section">
        <div class="landing__page__content">
          <div class="landing__page__header">
            <h1 class="landing__page__title">Deno Blocks</h1>
            <div class="landing__page__logo">
              <img src="deno-blocks-icon.gif" alt="Deno Blocks Icon" />
            </div>
          </div>
          <p class="landing__page__description">
            Play with Deno Blocks, an IDE built for the{" "}
            <a href="https://deno.com/blog/subhosting-hackathon">
              Deno Subhosting Hackathon
            </a>{" "}
            that allows developers to play/access/move Deno's automatic
            instrumentation and other powerful features.
          </p>
          <div class="landing__page__signin">
            <img src="github_logo.svg" alt="Github Logo" />
            <a class="landing__page__signin__text" href="/_404">Sign In</a>
          </div>
          <a class="landing__page__openide__text" href="/">Open IDE</a>
        </div>
        <div class="landing__page__image">
          <img src="/landing_page_image.png" alt="Deno Blocks" />
        </div>
      </div>
      <div class="landing__page__footer">
        <div class="landing_page_footer_content">
          <p class="landing__page__footer__text1">
            Logo Artwork Credit:{" "}
            <a href="https://twitter.com/_tanakaworld">@_tanakaworld</a>
          </p>
          <p class="landing__page__footer__text1">
            Deno Blocks built with 🦕
          </p>
        </div>
      </div>
    </section>
  );
}

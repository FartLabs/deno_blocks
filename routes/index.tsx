import { getSessionId } from "deno_kv_oauth/mod.ts";

export default async function IndexPage(request: Request) {
  const sessionID = await getSessionId(request);
  return (
    <section class="landing__page">
      <div class="landing__page__buttons">
        <a class="landing__page__sourcecode" href="/github">
          <img src="/github_logo.svg" alt="Github Logo" />
        </a>
      </div>
      <div class="landing__page__section">
        <div class="landing__page__content">
          <div class="landing__page__header">
            <h1 class="landing__page__title">Deno Blocks</h1>
            <div class="landing__page__logo">
              <picture>
                <source
                  srcset="/deno-blocks-icon.gif"
                  media="(prefers-reduced-motion: no-preference)"
                />
                <source
                  srcset="/deno-blocks-icon-frame-0.gif"
                  media="(prefers-reduced-motion: reduce)"
                />
                <img
                  src="/deno-blocks-icon.gif"
                  alt="Deno Blocks Icon"
                  style="image-rendering: pixelated;"
                />
              </picture>
            </div>
          </div>
          <p class="landing__page__description">
            Play with <strong>Deno Blocks</strong>, an <i>IDE</i> built with
            {" "}
            <a href="https://github.com/denoland/fresh">Fresh</a> and{" "}
            <a href="https://github.com/google/blockly">Blockly</a> for the{" "}
            <a href="https://deno.com/blog/subhosting-hackathon">
              Deno Subhosting Hackathon
            </a>{" "}
            that allows developers to drag-and-drop Deno's automatic
            instrumentation.
          </p>
          {sessionID
            ? (
              <>
                <a class="landing__page__openide__text" href="/recent">
                  Open IDE
                </a>
                <a class="landing__page__openide__text" href="/signout">
                  Sign out
                </a>
              </>
            )
            : (
              <div class="landing__page__signin">
                <img src="/github_logo.svg" alt="Github Logo" />
                <a class="landing__page__signin__text" href="/signin">
                  Sign In
                </a>
              </div>
            )}
        </div>
        <div class="landing__page__image">
          <picture>
            {/* TODO: Add light mode image. */}
            <source
              srcset="/landing_page_image.png"
              media="(prefers-color-scheme: light)"
            />
            <source
              srcset="/landing_page_image.png"
              media="(prefers-color-scheme: dark)"
            />
            <img src="/landing_page_image.png" alt="Deno Blocks" />
          </picture>
        </div>
      </div>
      <div class="landing__page__footer">
        <div class="landing_page_footer_content">
          <p class="landing__page__footer__text1">
            Logo artwork credit:{" "}
            <a href="https://twitter.com/_tanakaworld">@_tanakaworld</a>
          </p>
          <p class="landing__page__footer__text1">
            Deno Blocks developed with 🦕
          </p>
        </div>
      </div>
    </section>
  );
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");
  // TODO: Only run on IDE page.
  Split(
    [".blockly-panel", ".output-panel"],
    {
      minSize: 0,
      snapOffset: 10,
      gutterSize: 20,
    },
  );
});

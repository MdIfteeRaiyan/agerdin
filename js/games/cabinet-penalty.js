// Lazy entry module for After-School Cup. The shared game runtime owns state and rendering.
export const id = "penalty";
export const title = Object.freeze({ en: "After-School Cup", bn: "স্কুল-পরের কাপ" });
export const memory = "A quick penalty shootout";
export function open({ mount }) {
  if (typeof mount !== "function") throw new TypeError("Agerdin game runtime was not provided");
  return mount();
}

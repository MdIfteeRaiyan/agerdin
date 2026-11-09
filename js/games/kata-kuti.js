// Lazy entry module for Kata-Kuti. The shared game runtime owns state and rendering.
export const id = "kata";
export const title = Object.freeze({ en: "Kata-Kuti", bn: "কাটা-কুটি" });
export const memory = "Three in a row";
export function open({ mount }) {
  if (typeof mount !== "function") throw new TypeError("Agerdin game runtime was not provided");
  return mount();
}

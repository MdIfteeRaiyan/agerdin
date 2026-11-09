// Lazy entry module for Snake. The shared game runtime owns state and rendering.
export const id = "snake";
export const title = Object.freeze({ en: "Snake", bn: "সাপ খেলা" });
export const memory = "Guide the growing snake";
export function open({ mount }) {
  if (typeof mount !== "function") throw new TypeError("Agerdin game runtime was not provided");
  return mount();
}

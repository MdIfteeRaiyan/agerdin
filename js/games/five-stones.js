// Lazy entry module for Five Stones. The shared game runtime owns state and rendering.
export const id = "five-stones";
export const title = Object.freeze({ en: "Five Stones", bn: "পাঁচ গুটি" });
export const memory = "Toss and catch courtyard stones";
export function open({ mount }) {
  if (typeof mount !== "function") throw new TypeError("Agerdin game runtime was not provided");
  return mount();
}

// Lazy entry module for Paper Football. The shared game runtime owns state and rendering.
export const id = "paper-football";
export const title = Object.freeze({ en: "Paper Football", bn: "কাগজের ফুটবল" });
export const memory = "Move the folded-paper ball across the grid";
export function open({ mount }) {
  if (typeof mount !== "function") throw new TypeError("Agerdin game runtime was not provided");
  return mount();
}

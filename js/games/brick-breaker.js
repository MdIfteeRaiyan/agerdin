// Lazy entry module for Brick Breaker. The shared game runtime owns state and rendering.
export const id = "brick";
export const title = Object.freeze({ en: "Brick Breaker", bn: "ইট ভাঙা" });
export const memory = "Keep the ball in play";
export function open({ mount }) {
  if (typeof mount !== "function") throw new TypeError("Agerdin game runtime was not provided");
  return mount();
}

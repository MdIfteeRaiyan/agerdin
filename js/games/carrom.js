// Lazy entry module for Golir Carrom. The shared game runtime owns state and rendering.
export const id = "carrom";
export const title = Object.freeze({ en: "Golir Carrom", bn: "গলির ক্যারম" });
export const memory = "Pocket your coins and cover the queen";
export function open({ mount }) {
  if (typeof mount !== "function") throw new TypeError("Agerdin game runtime was not provided");
  return mount();
}
